import dotenv from 'dotenv'
import express from 'express'
import { fileURLToPath } from 'node:url'
import { buildAnalysis, projectCatalog } from './projects.js'

dotenv.config({ path: fileURLToPath(new URL('./.env', import.meta.url)) })

const app = express()
const port = Number(process.env.GEMINI_API_PORT ?? process.env.PORT ?? 3001)
const maxImageBytes = 5 * 1024 * 1024
const model = process.env.GEMINI_MODEL ?? 'gemini-3.6-flash'
const requestCounts = new Map()

const responseSchema = {
  type: 'OBJECT',
  properties: {
    detectedItems: { type: 'ARRAY', items: { type: 'STRING' } },
    projectScores: {
      type: 'OBJECT',
      properties: {
        mini_wind_tunnel: { type: 'INTEGER', minimum: 0, maximum: 100 },
        rotating_solar_system: { type: 'INTEGER', minimum: 0, maximum: 100 },
      },
      required: Object.keys(projectCatalog),
    },
  },
  required: ['detectedItems', 'projectScores'],
}

app.use(express.json({ limit: '8mb' }))

app.post('/api/analyze-image', async (request, response) => {
  const now = Date.now()
  for (const [ip, entry] of requestCounts) {
    if (now - entry.startedAt >= 60_000) requestCounts.delete(ip)
  }
  const ip = request.ip
  const current = requestCounts.get(ip)
  if (current && current.count >= 10) {
    response.status(429).json({ error: 'Terlalu banyak permintaan. Coba lagi sebentar.' })
    return
  }
  requestCounts.set(ip, current ? { ...current, count: current.count + 1 } : { startedAt: now, count: 1 })

  if (!process.env.GEMINI_API_KEY) {
    response.status(503).json({ error: 'API Gemini belum dikonfigurasi di server.' })
    return
  }

  const { image, language } = request.body ?? {}
  if (
    !image ||
    !['image/jpeg', 'image/png', 'image/webp'].includes(image.mimeType) ||
    typeof image.data !== 'string' ||
    !image.data ||
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(image.data)
  ) {
    response.status(400).json({ error: 'Foto tidak valid. Ambil foto baru lalu coba lagi.' })
    return
  }

  const imageBytes = Buffer.from(image.data, 'base64')
  if (imageBytes.length > maxImageBytes) {
    response.status(413).json({ error: 'Ukuran foto terlalu besar. Coba ambil foto dengan resolusi lebih rendah.' })
    return
  }
  if (!['id', 'en'].includes(language)) {
    response.status(400).json({ error: 'Bahasa analisis tidak valid.' })
    return
  }

  const languageName = language === 'id' ? 'Indonesian' : 'English'
  const prompt = `Analyze the entire photo for visible tools and materials used in these two school science projects. Respond in ${languageName}.
Identify every clearly visible relevant object, including multiple different objects in the same photo. Never guess. Assess how useful the complete combination of visible objects is for each project, and return a relevance score from 0 to 100 for BOTH projects. Use 0 when there is no clear supporting object. A toy car strongly supports mini_wind_tunnel; styrofoam balls strongly support rotating_solar_system. Cardboard, a DC motor, batteries, wires, and a switch can support either project, so judge the complete combination, not one shared item in isolation. Scores should reflect which project the visible items best support. The backend will show only the higher-scoring project, or both when their scores differ by 10 points or less. Return only detectedItems and projectScores; do not create project guides or suggest other projects.`

  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: 'You are a careful visual assistant for safe, low-cost school science projects. Never claim an item is present unless it is visible.' }],
          },
          contents: [{
            role: 'user',
            parts: [
              { text: prompt },
              { inlineData: { mimeType: image.mimeType, data: image.data } },
            ],
          }],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema,
            temperature: 0.3,
          },
        }),
      },
    )
    const result = await geminiResponse.json()
    if (!geminiResponse.ok) {
      const message = result.error?.message ?? 'Layanan Gemini gagal menganalisis foto.'
      response.status(geminiResponse.status === 429 ? 429 : 502).json({ error: message })
      return
    }

    const resultText = result.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? '')
      .join('')
    if (!resultText) throw new Error('Gemini tidak mengembalikan hasil analisis.')

    const analysis = JSON.parse(resultText)
    response.json(buildAnalysis({ ...analysis, language }))
  } catch (error) {
    console.error('Gemini image analysis failed:', error)
    response.status(502).json({
      error: error instanceof Error ? error.message : 'Analisis foto gagal. Silakan coba lagi.',
    })
  }
})

app.use((error, _request, response, next) => {
  if (response.headersSent) {
    next(error)
    return
  }
  const status = error.status === 413 ? 413 : error instanceof SyntaxError ? 400 : 500
  if (status === 500) console.error('Request failed:', error)
  const message = status === 413
    ? 'Ukuran permintaan terlalu besar.'
    : status === 400
      ? 'Format permintaan tidak valid.'
      : 'Permintaan gagal diproses.'
  response.status(status).json({ error: message })
})

app.listen(port, () => {
  console.log(`E-MORTAL API listening on http://localhost:${port}`)
})
