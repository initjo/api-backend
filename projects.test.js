import assert from 'node:assert/strict'
import test from 'node:test'
import { buildAnalysis, projectCatalog } from './projects.js'

test('only the two fixed Indonesian project guides are available', () => {
  assert.deepEqual(Object.keys(projectCatalog), ['mini_wind_tunnel', 'rotating_solar_system'])

  for (const project of Object.values(projectCatalog)) {
    assert.equal(project.id.steps.length, 8)
    assert.equal(project.id.materials.length > 0, true)
  }
})

test('analysis returns only the dominant project when scores are distinct', () => {
  const analysis = buildAnalysis({
    detectedItems: [' Bola styrofoam ', 'Mobil mainan', ''],
    projectScores: { rotating_solar_system: 90, mini_wind_tunnel: 45 },
    language: 'id',
  })

  assert.deepEqual(analysis.detectedItems, ['Bola styrofoam', 'Mobil mainan'])
  assert.deepEqual(analysis.recommendations.map(({ title }) => title), [
    'Membuat Miniatur Tata Surya Berputar',
  ])
})

test('analysis returns both choices when both projects are similarly dominant', () => {
  const analysis = buildAnalysis({
    detectedItems: ['Bola styrofoam', 'Mobil mainan', 'Kardus'],
    projectScores: { rotating_solar_system: 85, mini_wind_tunnel: 80 },
    language: 'id',
  })

  assert.deepEqual(
    analysis.recommendations.map(({ id }) => id),
    ['rotating_solar_system', 'mini_wind_tunnel'],
  )
})

test('analysis returns only the leading project when the runner-up is outside the tie margin', () => {
  const analysis = buildAnalysis({
    detectedItems: ['Bola styrofoam', 'Kardus'],
    projectScores: { rotating_solar_system: 90, mini_wind_tunnel: 79 },
    language: 'id',
  })

  assert.deepEqual(
    analysis.recommendations.map(({ id }) => id),
    ['rotating_solar_system'],
  )
})

test('analysis returns no project when neither score is relevant', () => {
  const analysis = buildAnalysis({
    detectedItems: ['Buku'],
    projectScores: { rotating_solar_system: 0, mini_wind_tunnel: 0 },
    language: 'en',
  })

  assert.deepEqual(analysis.recommendations, [])
  assert.equal(analysis.safetyNote.length > 0, true)
})

test('analysis rejects malformed model scores', () => {
  assert.throws(() => buildAnalysis({
    detectedItems: ['Bola styrofoam'],
    projectScores: { rotating_solar_system: 200, mini_wind_tunnel: 0 },
    language: 'id',
  }))
})
