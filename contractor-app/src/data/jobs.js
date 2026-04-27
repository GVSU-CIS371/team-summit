import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase'

export const JOB_STATUSES = [
  'Requested',
  'Estimated',
  'Approved',
  'In-Progress',
  'Completed',
]

export const SERVICE_OPTIONS = [
  'Roof Repair',
  'Leak Inspection',
  'Replacement Estimate',
  'Storm Damage',
  'Gutter Work',
]

export const WORKFLOW_STAGES = [
  'Requested',
  'Matched',
  'Inspection Scheduled',
  'Estimate Issued',
  'Approved',
  'In-Progress',
  'Completed',
  'Dispute Window',
  'Released',
]

export const CONTRACTORS = [
  {
    id: 'con-1001',
    name: 'Summit Peak Roofing',
    rating: 4.9,
    reviews: 184,
    services: ['Roof Repair', 'Leak Inspection', 'Replacement Estimate', 'Storm Damage'],
    availability: ['Mon 9:00 AM', 'Mon 1:30 PM', 'Tue 10:00 AM'],
    pricingRange: '$250-$550 inspection',
    serviceAreas: ['Downtown', 'Northside', 'West End'],
    photoHighlights: ['Leak patch', 'Storm restoration', 'Slate repair'],
    address: '120 N Wacker Dr, Chicago, IL',
    phone: '(312) 555-0184',
    location: { lat: 41.8857, lng: -87.6364 },
    pricing: {
      'Roof Repair': { min: 350, max: 1200 },
      'Leak Inspection': { min: 250, max: 550 },
      'Replacement Estimate': { min: 0, max: 0 },
      'Storm Damage': { min: 800, max: 6500 },
    },
    googleReviews: [
      { author: 'Maya R.', rating: 5, text: 'Found the leak in 20 minutes — fast, fair pricing.', date: '2026-03-22' },
      { author: 'Daniel K.', rating: 5, text: 'Storm damage handled professionally start to finish.', date: '2026-02-10' },
      { author: 'Priya S.', rating: 4, text: 'Great work, scheduling was a touch slow.', date: '2026-01-08' },
    ],
  },
  {
    id: 'con-1002',
    name: 'Cedar Ridge Exteriors',
    rating: 4.8,
    reviews: 142,
    services: ['Roof Repair', 'Leak Inspection', 'Gutter Work'],
    availability: ['Tue 8:30 AM', 'Wed 11:00 AM', 'Thu 2:00 PM'],
    pricingRange: '$180-$420 service call',
    serviceAreas: ['Northside', 'East Market', 'South Hill'],
    photoHighlights: ['Gutter replacement', 'Flashing repair', 'Wind damage'],
    address: '4500 N Clark St, Chicago, IL',
    phone: '(312) 555-0142',
    location: { lat: 41.9645, lng: -87.6680 },
    pricing: {
      'Roof Repair': { min: 280, max: 950 },
      'Leak Inspection': { min: 180, max: 420 },
      'Gutter Work': { min: 220, max: 1400 },
    },
    googleReviews: [
      { author: 'Tom L.', rating: 5, text: 'Cleanest gutter job I have ever seen.', date: '2026-03-30' },
      { author: 'Bea N.', rating: 5, text: 'Quoted and finished same week.', date: '2026-02-18' },
      { author: 'Hugo P.', rating: 4, text: 'Solid crew, communicative.', date: '2026-01-22' },
    ],
  },
  {
    id: 'con-1003',
    name: 'Atlas Roofing Co.',
    rating: 4.7,
    reviews: 96,
    services: ['Replacement Estimate', 'Storm Damage', 'Roof Repair'],
    availability: ['Mon 3:00 PM', 'Wed 9:30 AM', 'Fri 10:00 AM'],
    pricingRange: '$400-$750 estimate',
    serviceAreas: ['Downtown', 'Riverside', 'Airport District'],
    photoHighlights: ['Full replacement', 'Decking repair', 'Project staging'],
    address: '233 S Wacker Dr, Chicago, IL',
    phone: '(312) 555-0096',
    location: { lat: 41.8789, lng: -87.6359 },
    pricing: {
      'Roof Repair': { min: 450, max: 1800 },
      'Replacement Estimate': { min: 400, max: 750 },
      'Storm Damage': { min: 950, max: 7500 },
    },
    googleReviews: [
      { author: 'Sarah B.', rating: 5, text: 'Full re-roof finished ahead of schedule.', date: '2026-04-01' },
      { author: 'Marcus J.', rating: 4, text: 'Fair estimate, no surprises.', date: '2026-02-25' },
      { author: 'Luis F.', rating: 5, text: 'Highly recommend Atlas for big jobs.', date: '2026-01-15' },
    ],
  },
  {
    id: 'con-1004',
    name: 'Harborline Roofing',
    rating: 4.6,
    reviews: 88,
    services: ['Gutter Work', 'Roof Repair', 'Leak Inspection'],
    availability: ['Tue 1:00 PM', 'Thu 9:00 AM', 'Fri 1:30 PM'],
    pricingRange: '$150-$390 service call',
    serviceAreas: ['West End', 'Harbor District', 'South Hill'],
    photoHighlights: ['Gutter guards', 'Roof tune-up', 'Water intrusion'],
    address: '2350 W Roosevelt Rd, Chicago, IL',
    phone: '(312) 555-0088',
    location: { lat: 41.8669, lng: -87.6845 },
    pricing: {
      'Roof Repair': { min: 240, max: 880 },
      'Leak Inspection': { min: 150, max: 390 },
      'Gutter Work': { min: 200, max: 1300 },
    },
    googleReviews: [
      { author: 'Aiden V.', rating: 5, text: 'Tuned up our roof — no more leaks.', date: '2026-03-12' },
      { author: 'Carla M.', rating: 4, text: 'Good value, friendly team.', date: '2026-02-04' },
      { author: 'Owen T.', rating: 5, text: 'Quick gutter guard install.', date: '2026-01-29' },
    ],
  },
]

export const SAMPLE_JOBS = [
  {
    id: 'sample-001',
    contractorName: 'Summit Peak Roofing',
    serviceType: 'Leak Inspection',
    description: 'Water spots appearing on ceiling near chimney after recent storms.',
    address: '482 Lakeview Dr, Chicago, IL 60614',
    propertyType: 'Homeowner',
    selectedSlot: 'Mon 9:00 AM',
    contactEmail: '',
    status: 'Estimated',
    estimateTotal: 425,
    createdAt: '2026-04-22T14:30:00Z',
  },
  {
    id: 'sample-002',
    contractorName: 'Cedar Ridge Exteriors',
    serviceType: 'Gutter Work',
    description: 'Replace damaged gutters along the back of the house.',
    address: '1207 Maple Ave, Chicago, IL 60657',
    propertyType: 'Homeowner',
    selectedSlot: 'Tue 8:30 AM',
    contactEmail: '',
    status: 'Approved',
    estimateTotal: 1180,
    createdAt: '2026-04-18T09:10:00Z',
  },
  {
    id: 'sample-003',
    contractorName: 'Atlas Roofing Co.',
    serviceType: 'Replacement Estimate',
    description: 'Full roof replacement quote needed before insurance renewal.',
    address: '88 Riverside Pl, Chicago, IL 60607',
    propertyType: 'Business',
    selectedSlot: 'Wed 9:30 AM',
    contactEmail: '',
    status: 'Requested',
    estimateTotal: null,
    createdAt: '2026-04-25T11:45:00Z',
  },
  {
    id: 'sample-004',
    contractorName: 'Harborline Roofing',
    serviceType: 'Roof Repair',
    description: 'Missing shingles on south slope after windstorm.',
    address: '645 Harbor View Rd, Chicago, IL 60605',
    propertyType: 'Homeowner',
    selectedSlot: 'Thu 9:00 AM',
    contactEmail: '',
    status: 'In-Progress',
    estimateTotal: 720,
    createdAt: '2026-04-10T13:20:00Z',
  },
  {
    id: 'sample-005',
    contractorName: 'Summit Peak Roofing',
    serviceType: 'Storm Damage',
    description: 'Hail damage assessment for insurance claim.',
    address: '2310 Northside Way, Chicago, IL 60625',
    propertyType: 'Homeowner',
    selectedSlot: 'Fri 10:00 AM',
    contactEmail: '',
    status: 'Completed',
    estimateTotal: 4850,
    createdAt: '2026-03-28T08:00:00Z',
  },
  {
    id: 'sample-006',
    contractorName: 'Cedar Ridge Exteriors',
    serviceType: 'Roof Repair',
    description: 'Requested out-of-area service.',
    address: '15 Country Ln, Naperville, IL 60540',
    propertyType: 'Homeowner',
    selectedSlot: '',
    contactEmail: '',
    status: 'Declined',
    estimateTotal: null,
    createdAt: '2026-04-05T15:00:00Z',
  },
]

export function requiresInspection(serviceType) {
  return ['Leak Inspection', 'Replacement Estimate', 'Storm Damage'].includes(serviceType)
}

function parseList(value, fallback = []) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || '').trim()).filter(Boolean)
  }

  if (!value) {
    return fallback
  }

  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function mapContractorDoc(data, id) {
  return {
    id,
    name: data.businessName || data.name || 'Contractor',
    rating: Number(data.rating || 4.5),
    reviews: Number(data.reviews || 0),
    services: parseList(data.services, ['Roof Repair']),
    availability: parseList(data.availability, ['Mon 9:00 AM']),
    pricingRange: data.pricingRange || 'Pricing on request',
    serviceAreas: parseList(data.serviceAreas, ['Local area']),
    photoHighlights: parseList(data.photoHighlights, ['Portfolio coming soon']),
    address: data.address || '',
    phone: data.phone || '',
    location: data.location || null,
    pricing: data.pricing || {},
    googleReviews: Array.isArray(data.googleReviews) ? data.googleReviews : [],
  }
}

export async function getContractorsDirectory() {
  try {
    const snap = await getDocs(collection(db, 'contractors'))
    const dynamicContractors = snap.docs.map((contractorDoc) => mapContractorDoc(contractorDoc.data(), contractorDoc.id))

    return [...dynamicContractors, ...CONTRACTORS]
  } catch {
    return CONTRACTORS
  }
}

export async function getJobs() {
  const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  const jobs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  if (!jobs.length) return SAMPLE_JOBS
  return jobs
}

export async function getJobById(jobId) {
  const snap = await getDoc(doc(db, 'jobs', jobId))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function createJobRequest(payload) {
  const docRef = await addDoc(collection(db, 'jobs'), {
    clientId: payload.clientId || null,
    customerName: payload.customerName || '',
    propertyType: payload.propertyType || '',
    serviceType: payload.serviceType || '',
    description: payload.description || '',
    priority: payload.priority || 'Medium',
    contactEmail: payload.contactEmail || '',
    contactPhone: payload.contactPhone || '',
    address: payload.address || '',
    roofType: payload.roofType || '',
    estimatedAreaSqft: Number(payload.estimatedAreaSqft || 0),
    status: 'Requested',
    createdAt: serverTimestamp(),
    estimatedAt: null,
    approvedAt: null,
    startedAt: null,
    completedAt: null,
    estimateTotal: null,
  })

  return docRef.id
}

export async function updateJobStatus(jobId, newStatus) {
  const updates = {
    status: newStatus,
  }

  if (newStatus === 'Estimated') updates.estimatedAt = serverTimestamp()
  if (newStatus === 'Approved') updates.approvedAt = serverTimestamp()
  if (newStatus === 'In-Progress') updates.startedAt = serverTimestamp()
  if (newStatus === 'Completed') updates.completedAt = serverTimestamp()

  await updateDoc(doc(db, 'jobs', jobId), updates)
}

export async function updateJob(jobId, payload) {
  await updateDoc(doc(db, 'jobs', jobId), {
    customerName: payload.customerName || '',
    propertyType: payload.propertyType || '',
    serviceType: payload.serviceType || '',
    description: payload.description || '',
    priority: payload.priority || 'Medium',
    contactEmail: payload.contactEmail || '',
    contactPhone: payload.contactPhone || '',
    address: payload.address || '',
    roofType: payload.roofType || '',
    estimatedAreaSqft: Number(payload.estimatedAreaSqft || 0),
    estimateTotal:
      payload.estimateTotal === null || payload.estimateTotal === ''
        ? null
        : Number(payload.estimateTotal),
  })
}

export async function deleteJob(jobId) {
  await deleteDoc(doc(db, 'jobs', jobId))
}