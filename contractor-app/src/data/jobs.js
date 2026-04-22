import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../firebase'

export const JOB_STATUSES = [
  'Requested',
  'Estimated',
  'Approved',
  'In-Progress',
  'Completed',
]

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
    customerName: payload.customerName,
    propertyType: payload.propertyType,
    serviceType: payload.serviceType,
    description: payload.description,
    priority: payload.priority || 'Medium',
    contactEmail: payload.contactEmail,
    contactPhone: payload.contactPhone,
    address: payload.address,
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
  const updates = { status: newStatus }

  if (newStatus === 'Estimated') updates.estimatedAt = serverTimestamp()
  if (newStatus === 'Approved') updates.approvedAt = serverTimestamp()
  if (newStatus === 'In-Progress') updates.startedAt = serverTimestamp()
  if (newStatus === 'Completed') updates.completedAt = serverTimestamp()

  await updateDoc(doc(db, 'jobs', jobId), updates)
}

export async function updateJob(jobId, payload) {
  await updateDoc(doc(db, 'jobs', jobId), {
    customerName: payload.customerName,
    propertyType: payload.propertyType,
    serviceType: payload.serviceType,
    description: payload.description,
    priority: payload.priority,
    contactEmail: payload.contactEmail,
    contactPhone: payload.contactPhone,
    address: payload.address,
    estimateTotal: payload.estimateTotal === null ? null : Number(payload.estimateTotal),
  })
}

export async function deleteJob(jobId) {
  await deleteDoc(doc(db, 'jobs', jobId))
}