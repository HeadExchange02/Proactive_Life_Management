// Curated disease/symptom -> specialist hospital mapping for Bangladesh.
// Edit this file to add or reorder hospitals; no database migration needed.
// `hospitals` are listed best-first. `match` is a keyword used to look the hospital
// up in the Hospitals_count_in_Bangladesh table (adds beds/location when found). Please verify names/addresses before release.

export const SPECIALTIES = [
  {
    id: 'cardiology',
    label: 'Heart Disease (Cardiology)',
    specialists: ['Cardiologist', 'Cardiac Surgeon'],
    keywords: [
      'heart', 'cardiac', 'heart attack', 'heart block', 'blockage', 'angina',
      'chest pain', 'palpitation', 'myocardial', 'arrhythmia', 'heart failure',
      'cholesterol', 'bypass',
    ],
    hospitals: [
      {
        name: 'Shaheed Suhrawardy Medical College Hospital',
        match: 'suhrawardy',
        address: 'Sher-e-Bangla Nagar, Agargaon, Dhaka-1207',
        note: 'Recommended for heart attack and heart block',
      },
      {
        name: 'National Institute of Cardiovascular Diseases (NICVD)',
        match: 'cardiovascular',
        address: 'Sher-e-Bangla Nagar, Dhaka-1207',
        note: 'Specialized cardiac institute',
      },
      {
        name: 'Bangabandhu Sheikh Mujib Medical University (BSMMU)',
        match: 'sheikh mujib medical',
        address: 'Shahbag, Dhaka-1000',
        note: 'Cardiology department',
      },
    ],
  },
  {
    id: 'neurology',
    label: 'Brain & Nerve (Neurology)',
    specialists: ['Neurologist', 'Neurosurgeon'],
    keywords: ['stroke', 'paralysis', 'seizure', 'epilepsy', 'migraine', 'brain', 'numbness', 'parkinson'],
    hospitals: [
      {
        name: 'National Institute of Neurosciences & Hospital (NINS)',
        match: 'neuroscience',
        address: 'Sher-e-Bangla Nagar, Agargaon, Dhaka-1207',
        note: 'Specialized neuro institute',
      },
      {
        name: 'Bangabandhu Sheikh Mujib Medical University (BSMMU)',
        match: 'sheikh mujib medical',
        address: 'Shahbag, Dhaka-1000',
        note: 'Neurology department',
      },
    ],
  },
  {
    id: 'nephrology',
    label: 'Kidney & Urology',
    specialists: ['Nephrologist', 'Urologist'],
    keywords: ['kidney', 'dialysis', 'renal', 'urine', 'urinary', 'kidney stone', 'prostate'],
    hospitals: [
      {
        name: 'National Institute of Kidney Diseases & Urology (NIKDU)',
        match: 'kidney diseases',
        address: 'Sher-e-Bangla Nagar, Dhaka-1207',
        note: 'Specialized kidney and urology institute',
      },
    ],
  },
  {
    id: 'oncology',
    label: 'Cancer (Oncology)',
    specialists: ['Oncologist'],
    keywords: ['cancer', 'tumor', 'tumour', 'chemotherapy', 'lump', 'leukemia'],
    hospitals: [
      {
        name: 'National Institute of Cancer Research & Hospital (NICRH)',
        match: 'cancer research',
        address: 'Mohakhali, Dhaka-1212',
        note: 'Specialized cancer institute',
      },
    ],
  },
  {
    id: 'ophthalmology',
    label: 'Eye Care (Ophthalmology)',
    specialists: ['Ophthalmologist'],
    keywords: ['eye', 'vision', 'cataract', 'glaucoma', 'blurry', 'blindness'],
    hospitals: [
      {
        name: 'National Institute of Ophthalmology & Hospital (NIOH)',
        match: 'ophthalmology',
        address: 'Sher-e-Bangla Nagar, Agargaon, Dhaka-1207',
        note: 'Specialized eye institute',
      },
    ],
  },
  {
    id: 'orthopedics',
    label: 'Bone & Joint (Orthopedics)',
    specialists: ['Orthopedic Surgeon'],
    keywords: ['fracture', 'bone', 'joint', 'spine', 'knee', 'back pain', 'arthritis'],
    hospitals: [
      {
        name: 'National Institute of Traumatology & Orthopaedic Rehabilitation (NITOR)',
        match: 'traumatology',
        address: 'Sher-e-Bangla Nagar, Agargaon, Dhaka-1207',
        note: 'Specialized orthopedic institute',
      },
    ],
  },
  {
    id: 'mental-health',
    label: 'Mental Health (Psychiatry)',
    specialists: ['Psychiatrist'],
    keywords: ['depression', 'anxiety', 'panic', 'suicidal', 'mental', 'insomnia', 'stress'],
    hospitals: [
      {
        name: 'National Institute of Mental Health (NIMH)',
        match: 'mental health',
        address: 'Sher-e-Bangla Nagar, Dhaka-1207',
        note: 'Specialized mental health institute',
      },
    ],
  },
  {
    id: 'pediatrics',
    label: "Children's Health (Pediatrics)",
    specialists: ['Pediatrician'],
    keywords: ['child', 'infant', 'baby', 'newborn', 'pediatric', 'toddler'],
    hospitals: [
      {
        name: 'Dhaka Shishu (Children) Hospital',
        match: 'shishu',
        address: 'Sher-e-Bangla Nagar, Dhaka-1207',
        note: 'Specialized children hospital',
      },
    ],
  },
]

// Returns the best-matching specialty (most keyword hits; phrase hits weigh more) or null.
export function findSpecialty(symptoms = '') {
  const text = symptoms.toLowerCase()
  if (!text.trim()) return null

  let best = null
  let bestScore = 0
  for (const specialty of SPECIALTIES) {
    let score = 0
    for (const kw of specialty.keywords) {
      if (text.includes(kw)) score += kw.includes(' ') ? 2 : 1
    }
    if (score > bestScore) {
      best = specialty
      bestScore = score
    }
  }
  return best
}
