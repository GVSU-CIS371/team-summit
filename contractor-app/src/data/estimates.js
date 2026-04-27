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

export function calculateEstimate({
  areaSqft,
  materialRate,
  laborRate,
  taxRate,
}) {
  const materialsCost = Number(areaSqft || 0) * Number(materialRate || 0)
  const laborCost = Number(areaSqft || 0) * Number(laborRate || 0)
  const subtotal = materialsCost + laborCost
  const tax = subtotal * Number(taxRate || 0)
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
    materialsCost: Number(estimate.materialsCost || 0),
    laborCost: Number(estimate.laborCost || 0),
    tax: Number(estimate.tax || 0),
    totalCost: Number(estimate.totalCost || 0),
    notes: estimate.notes || '',
    approved: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  await updateDoc(doc(db, 'jobs', jobId), {
    status: 'Estimated',
    estimatedAt: serverTimestamp(),
    estimateTotal: Number(estimate.totalCost || 0),
  })

  return created.id
}

export async function getEstimateByJobId(jobId) {
  const q = query(collection(db, 'estimates'), where('jobId', '==', jobId))
  const snap = await getDocs(q)

  if (snap.empty) return null

  const first = snap.docs[0]
  return {
    id: first.id,
    ...first.data(),
  }
}