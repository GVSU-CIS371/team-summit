import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { storage, db } from '../firebase'

export async function uploadJobPhoto(jobId, file, uploadedBy = 'client', photoType = 'damage') {
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