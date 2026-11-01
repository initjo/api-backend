export const projectCatalog = {
  mini_wind_tunnel: {
    en: {
      title: 'Make a Mini Wind Tunnel',
      description: 'Build a cardboard tunnel with a protected fan to observe airflow around a small object.',
      materials: [
        'Used cardboard box or corrugated cardboard',
        'Clear plastic sheet for the observation window',
        'DC motor with propeller',
        '1.5–3 V battery pack',
        'Electrical wires and an on/off switch',
        'Protective mesh for the fan',
        'Drinking straws',
        'Hot glue',
        'Scissors, ruler, and cutter',
      ],
      steps: [
        'Prepare the cardboard, clear plastic, motor, battery, wires, switch, mesh, straws, and tools.',
        'Cut the cardboard into a top, base, left side, and right side. A sample size is 30 × 10 cm; adjust it to the available materials.',
        'Join the cardboard panels into a long rectangular tunnel, leaving the air inlet and outlet open.',
        'Cut a viewing window into one side and cover the opening securely with the clear plastic.',
        'Cut the straws to equal lengths and arrange them together across the air inlet to straighten the airflow.',
        'Mount the DC motor and propeller at the outlet, then cover the propeller with protective mesh.',
        'Connect the battery pack, switch, and motor with wires. Check the motor voltage before switching it on.',
        'Turn on the fan and observe the airflow through the window using a lightweight object such as a toy car. Keep hands away from the propeller.',
      ],
    },
    id: {
      title: 'Membuat Mini Wind Tunnel',
      description: 'Buat terowongan dari kardus dengan kipas berpelindung untuk mengamati aliran udara di sekitar benda kecil.',
      materials: [
        'Kardus bekas atau karton bergelombang',
        'Mika atau plastik bening untuk jendela pengamatan',
        'Dinamo DC beserta baling-baling',
        'Tempat baterai 1,5–3 V',
        'Kabel dan sakelar on/off',
        'Kasa pelindung baling-baling',
        'Sedotan',
        'Lem tembak',
        'Gunting, penggaris, dan cutter',
      ],
      steps: [
        'Siapkan kardus, mika bening, dinamo, baterai, kabel, sakelar, kasa, sedotan, dan alat kerja.',
        'Potong kardus menjadi bagian atas, alas, sisi kiri, dan sisi kanan. Contoh ukuran 30 × 10 cm; sesuaikan dengan bahan yang tersedia.',
        'Rekatkan potongan kardus menjadi terowongan berbentuk kotak memanjang, dengan lubang masuk dan keluar udara tetap terbuka.',
        'Potong jendela pengamatan pada salah satu sisi badan terowongan, lalu tempelkan mika dengan kuat.',
        'Potong sedotan sama panjang dan susun rapat pada lubang masuk udara untuk merapikan aliran udara.',
        'Pasang dinamo dan baling-baling pada lubang keluar, lalu tutup baling-baling dengan kasa pelindung.',
        'Hubungkan baterai, sakelar, dan dinamo menggunakan kabel. Periksa tegangan dinamo sebelum sakelar dinyalakan.',
        'Nyalakan kipas dan amati aliran udara melalui jendela menggunakan benda ringan, misalnya mobil mainan. Jauhkan tangan dari baling-baling.',
      ],
    },
  },
  rotating_solar_system: {
    en: {
      title: 'Make a Rotating Solar System Model',
      description: 'Build a motorized model with the Sun and eight planets orbiting on a rotating frame.',
      materials: [
        'DC motor',
        'Battery holder with 3–6 V batteries',
        'Electrical wires and an on/off switch',
        'Styrofoam balls in different sizes',
        'Thick used cardboard for the base and orbit frame',
        'Skewers or flexible wire for planet supports',
        'Bottle caps or small cardboard pieces for motor support',
        'Hot glue and paint',
        'Scissors, ruler, and cutter',
      ],
      steps: [
        'Prepare the DC motor, battery holder, wires, switch, styrofoam balls, cardboard, skewers or wire, glue, and paint.',
        'Cut thick cardboard into a round base. Glue multiple layers together so the base is firm and balanced.',
        'Secure the DC motor at the center of the base and attach a straight shaft or rod to its rotating axle.',
        'Make a light circular orbit frame from cardboard and attach it securely to the motor shaft.',
        'Shape and paint the styrofoam balls as the Sun and eight planets, using smaller balls for the inner planets.',
        'Attach the planets to the orbit frame with skewers or flexible wire, spacing them around the Sun and keeping them clear of the base.',
        'Connect the motor to the battery holder through the on/off switch. Use a supply within the motor’s rated voltage (3–6 V only if the motor supports it).',
        'Switch on the motor and check that the frame rotates freely. Balance or reposition the planets if the frame wobbles.',
      ],
    },
    id: {
      title: 'Membuat Miniatur Tata Surya Berputar',
      description: 'Buat miniatur bermotor dengan Matahari dan delapan planet pada rangka yang berputar.',
      materials: [
        'Dinamo DC',
        'Tempat baterai dan baterai 3–6 V',
        'Kabel dan sakelar on/off',
        'Bola styrofoam berbagai ukuran',
        'Kardus bekas tebal untuk alas dan rangka orbit',
        'Tusuk sate atau kawat lentur untuk penyangga planet',
        'Tutup botol atau potongan kardus kecil sebagai dudukan dinamo',
        'Lem tembak dan cat warna',
        'Gunting, penggaris, dan cutter',
      ],
      steps: [
        'Siapkan dinamo, tempat baterai, kabel, sakelar, bola styrofoam, kardus, tusuk sate atau kawat, lem, dan cat.',
        'Potong kardus tebal berbentuk lingkaran sebagai alas. Rekatkan beberapa lapis agar alas kuat dan seimbang.',
        'Pasang dinamo dengan kokoh di tengah alas, lalu pasang poros atau batang lurus pada sumbu putarnya.',
        'Buat rangka orbit berbentuk lingkaran dari kardus yang ringan, lalu hubungkan dengan kuat ke poros dinamo.',
        'Bentuk dan warnai bola styrofoam menjadi Matahari dan delapan planet. Gunakan ukuran lebih kecil untuk planet bagian dalam.',
        'Pasang planet pada rangka orbit dengan tusuk sate atau kawat lentur. Atur posisinya mengelilingi Matahari dan pastikan tidak menyentuh alas.',
        'Hubungkan dinamo ke tempat baterai melalui sakelar on/off. Gunakan tegangan sesuai spesifikasi dinamo (3–6 V hanya jika dinamo mendukungnya).',
        'Nyalakan dinamo dan pastikan rangka berputar bebas. Seimbangkan atau atur ulang posisi planet jika rangka bergoyang.',
      ],
    },
  },
}

const MINIMUM_PROJECT_SCORE = 30
const PROJECT_SCORE_TIE_MARGIN = 10

export function buildAnalysis({ detectedItems, projectScores, language }) {
  if (
    !Array.isArray(detectedItems) ||
    !detectedItems.every((item) => typeof item === 'string') ||
    !projectScores ||
    typeof projectScores !== 'object' ||
    !['id', 'en'].includes(language)
  ) {
    throw new Error('Format hasil analisis Gemini tidak valid.')
  }

  const scores = Object.keys(projectCatalog).map((id) => {
    const score = projectScores[id]
    if (!Number.isInteger(score) || score < 0 || score > 100) {
      throw new Error('Skor relevansi proyek dari Gemini tidak valid.')
    }
    return { id, score }
  })
  const rankedProjects = scores.sort((left, right) => right.score - left.score)
  const [best, second] = rankedProjects
  const recommendedProjects = best.score < MINIMUM_PROJECT_SCORE
    ? []
    : best.score - second.score <= PROJECT_SCORE_TIE_MARGIN && second.score >= MINIMUM_PROJECT_SCORE
      ? rankedProjects
      : [best]

  return {
    detectedItems: detectedItems.map((item) => item.trim()).filter(Boolean).slice(0, 20),
    recommendations: recommendedProjects.map(({ id }) => ({
      id,
      ...projectCatalog[id][language],
    })),
    safetyNote: language === 'id'
      ? 'Gunakan cutter dan lem tembak dengan pengawasan orang dewasa. Jauhkan tangan dari baling-baling dan poros yang berputar, serta gunakan baterai sesuai tegangan dinamo.'
      : 'Use cutters and hot glue with adult supervision. Keep hands away from rotating propellers and shafts, and use batteries within the motor’s rated voltage.',
  }
}
