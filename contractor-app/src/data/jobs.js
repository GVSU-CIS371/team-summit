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
  },
]

function normalizeText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
}

function matchesLocation(contractor, locationText) {
  const normalizedLocation = normalizeText(locationText)
  if (!normalizedLocation) {
    return true
  }

  return contractor.serviceAreas.some((area) => normalizeText(area).includes(normalizedLocation) || normalizedLocation.includes(normalizeText(area)))
}

export function requiresInspection(serviceType) {
  return ['Leak Inspection', 'Replacement Estimate', 'Storm Damage'].includes(serviceType)
}

export function getContractorById(contractorId) {
  return CONTRACTORS.find((contractor) => contractor.id === contractorId)
}

export function getNearbyContractors(serviceType, locationText = '') {
  const normalizedService = normalizeText(serviceType)

  return CONTRACTORS.filter((contractor) => {
    const serviceMatch = contractor.services.some((service) => normalizeText(service) === normalizedService)
    return serviceMatch && matchesLocation(contractor, locationText)
  }).sort((left, right) => right.rating - left.rating)
}

export async function getJobs() {
  const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
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