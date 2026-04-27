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

export async function registerUser({
  name,
  email,
  password,
  phone = '',
  role = 'guest',
  businessName = '',
  serviceAreas = [],
  services = [],
  availability = [],
  pricingRange = '',
  // Customer extras
  acceptedPrivacyPolicy = false,
  acceptedTerms = false,
  marketingOptIn = false,
  // Contractor business extras
  legalBusinessName = '',
  taxId = '',
  businessType = '',
  yearsInBusiness = '',
  licenseNumber = '',
  insuranceCarrier = '',
  insurancePolicyNumber = '',
  businessAddress = '',
  businessCity = '',
  businessState = '',
  businessZip = '',
  websiteUrl = '',
  ownerName = '',
  ownerTitle = '',
  ownerEmail = '',
  ownerPhone = '',
}) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)

  await setDoc(doc(db, 'users', cred.user.uid), {
    name,
    email,
    phone,
    role,
    businessName,
    acceptedPrivacyPolicy,
    acceptedTerms,
    marketingOptIn,
    createdAt: serverTimestamp(),
  })

  if (role === 'contractor') {
    await setDoc(doc(db, 'contractors', cred.user.uid), {
      userId: cred.user.uid,
      businessName: businessName || name,
      legalBusinessName,
      taxId,
      businessType,
      yearsInBusiness,
      licenseNumber,
      insuranceCarrier,
      insurancePolicyNumber,
      businessAddress,
      businessCity,
      businessState,
      businessZip,
      websiteUrl,
      ownerName: ownerName || name,
      ownerTitle,
      ownerEmail: ownerEmail || email,
      ownerPhone: ownerPhone || phone,
      contactName: name,
      email,
      phone,
      serviceAreas,
      services,
      availability,
      pricingRange,
      rating: 4.5,
      reviews: 0,
      photoHighlights: ['New contractor profile'],
      createdAt: serverTimestamp(),
    })
  }

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