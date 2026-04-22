import { reactive } from 'vue'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'

const authState = reactive({
  currentUser: null,
  ready: false,
})

export function useAuth() {
  return authState
}

export async function registerUser({ name, email, password, phone = '', role = 'client' }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)

  await setDoc(doc(db, 'users', cred.user.uid), {
    name,
    email,
    phone,
    role,
    createdAt: serverTimestamp(),
  })

  return cred.user
}

export async function loginUser(email, password) {
  await signInWithEmailAndPassword(auth, email, password)
}

export async function logout() {
  await signOut(auth)
}

export function initAuth() {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      authState.currentUser = null
      authState.ready = true
      return
    }

    const snap = await getDoc(doc(db, 'users', user.uid))
    const profile = snap.exists() ? snap.data() : {}

    authState.currentUser = {
      uid: user.uid,
      email: user.email,
      ...profile,
    }
    authState.ready = true
  })
}