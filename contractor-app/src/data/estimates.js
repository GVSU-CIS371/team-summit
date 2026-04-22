import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebase'

export function calculateEstimate({ areaSqft, materialRate, laborRate, taxRate }) {
  const materialsCost = Number(areaSqft) * Number(materialRate)
  const laborCost = Number(areaSqft) * Number(laborRate)
  const subtotal = materialsCost + laborCost
  const tax = subtotal * Number(taxRate)
  const totalCost = subtotal + tax

  return {
    materialsCost,
    laborCost,
    tax,
    totalCost,
  }
}

export async function saveEstimate(jobId, estimate) {
  const created = await addDoc(collection(db, 'estimates'), {
    jobId,
    ...estimate,
    approved: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  await updateDoc(doc(db, 'jobs', jobId), {
    status: 'Estimated',
    estimatedAt: serverTimestamp(),
    estimateTotal: estimate.totalCost,
  })

  return created.id
}

export async function getEstimateByJobId(jobId) {
  const q = query(collection(db, 'estimates'), where('jobId', '==', jobId))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const first = snap.docs[0]
  return { id: first.id, ...first.data() }
}