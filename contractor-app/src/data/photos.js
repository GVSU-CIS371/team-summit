import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage } from '../firebase'

export async function uploadJobPhoto(
  jobId,
  file,
  uploadedBy = 'guest',
  photoType = 'damage'
) {
  const filePath = `jobs/${jobId}/${Date.now()}-${file.name}`
  const storageRef = ref(storage, filePath)

  await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(storageRef)

  await addDoc(collection(db, 'jobs', jobId, 'photos'), {
    uploadedBy,
    photoType,
    storagePath: filePath,
    storageUrl: downloadURL,
    createdAt: serverTimestamp(),
  })

  return downloadURL
}

export async function getJobPhotos(jobId) {
  const snap = await getDocs(collection(db, 'jobs', jobId, 'photos'))

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }))
}