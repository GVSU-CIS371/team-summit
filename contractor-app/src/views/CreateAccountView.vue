<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser, useAuth } from '../auth/mockAuth'
import { SERVICE_OPTIONS } from '../data/jobs'

const router = useRouter()
const auth = useAuth()

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
]

const BUSINESS_TYPES = [
  'Sole Proprietorship',
  'Partnership',
  'LLC',
  'S-Corporation',
  'C-Corporation',
  'Other',
]

const form = reactive({
  accountType: 'customer',

  // Shared
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  phone: '',

  // Customer agreements
  acceptedTerms: false,
  acceptedPrivacyPolicy: false,
  marketingOptIn: false,
  ageConfirmed: false,

  // Contractor: business identity
  businessName: '',
  legalBusinessName: '',
  taxId: '',
  businessType: '',
  yearsInBusiness: '',
  websiteUrl: '',

  // Contractor: licensing & insurance
  licenseNumber: '',
  insuranceCarrier: '',
  insurancePolicyNumber: '',

  // Contractor: business address
  businessAddress: '',
  businessCity: '',
  businessState: '',
  businessZip: '',

  // Contractor: owner / authorized signer
  ownerName: '',
  ownerTitle: '',
  ownerEmail: '',
  ownerPhone: '',

  // Contractor: services
  services: ['Roof Repair'],
  serviceAreas: '',
  availability: '',
  pricingRange: '',

  // Contractor agreements
  authorizedRepresentative: false,
  contractorAcceptedTerms: false,
  contractorAcceptedPrivacy: false,
  w9OnFile: false,
})

const errorMessage = ref('')
const isLoading = ref(false)

const isContractor = computed(() => form.accountType === 'contractor')

function parseCommaList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

async function waitForRole() {
  for (let i = 0; i < 20; i += 1) {
    if (auth.currentUser?.role) return auth.currentUser.role
    await new Promise((resolve) => setTimeout(resolve, 150))
  }
  return null
}

function validate() {
  if (form.password.length < 6) {
    return 'Password must be at least 6 characters.'
  }
  if (form.password !== form.passwordConfirm) {
    return 'Passwords do not match.'
  }
  if (isContractor.value) {
    if (!form.contractorAcceptedTerms || !form.contractorAcceptedPrivacy) {
      return 'You must accept the Terms of Service and Privacy Policy.'
    }
    if (!form.authorizedRepresentative) {
      return 'You must confirm you are authorized to register this business.'
    }
  } else {
    if (!form.acceptedTerms || !form.acceptedPrivacyPolicy) {
      return 'You must accept the Terms of Service and Privacy Policy.'
    }
    if (!form.ageConfirmed) {
      return 'You must confirm you are at least 18 years old.'
    }
  }
  return ''
}

async function handleCreateAccount() {
  errorMessage.value = ''

  const validationError = validate()
  if (validationError) {
    errorMessage.value = validationError
    return
  }

  isLoading.value = true

  try {
    await registerUser({
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      role: isContractor.value ? 'contractor' : 'guest',

      // Customer
      acceptedTerms: !isContractor.value ? form.acceptedTerms : form.contractorAcceptedTerms,
      acceptedPrivacyPolicy: !isContractor.value ? form.acceptedPrivacyPolicy : form.contractorAcceptedPrivacy,
      marketingOptIn: form.marketingOptIn,

      // Contractor
      businessName: isContractor.value ? form.businessName : '',
      legalBusinessName: isContractor.value ? form.legalBusinessName : '',
      taxId: isContractor.value ? form.taxId : '',
      businessType: isContractor.value ? form.businessType : '',
      yearsInBusiness: isContractor.value ? form.yearsInBusiness : '',
      licenseNumber: isContractor.value ? form.licenseNumber : '',
      insuranceCarrier: isContractor.value ? form.insuranceCarrier : '',
      insurancePolicyNumber: isContractor.value ? form.insurancePolicyNumber : '',
      businessAddress: isContractor.value ? form.businessAddress : '',
      businessCity: isContractor.value ? form.businessCity : '',
      businessState: isContractor.value ? form.businessState : '',
      businessZip: isContractor.value ? form.businessZip : '',
      websiteUrl: isContractor.value ? form.websiteUrl : '',
      ownerName: isContractor.value ? form.ownerName : '',
      ownerTitle: isContractor.value ? form.ownerTitle : '',
      ownerEmail: isContractor.value ? form.ownerEmail : '',
      ownerPhone: isContractor.value ? form.ownerPhone : '',
      services: isContractor.value ? form.services : [],
      serviceAreas: isContractor.value ? parseCommaList(form.serviceAreas) : [],
      availability: isContractor.value ? parseCommaList(form.availability) : [],
      pricingRange: isContractor.value ? form.pricingRange : '',
    })

    const role = await waitForRole()
    router.push(role === 'contractor' ? '/contractor' : '/customer/home')
  } catch (error) {
    errorMessage.value = error?.message || 'Failed to create account.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12" :class="isContractor ? 'col-lg-9' : 'col-md-8 col-lg-6'">
        <article class="card shadow-sm border-0">
          <div class="card-body p-4 p-lg-5">
            <h1 class="h4 mb-1">Create Account</h1>
            <p class="text-secondary mb-4">
              {{ isContractor
                ? 'Register your roofing business with Team Summit.'
                : 'Sign up to request inspections and track your jobs.' }}
            </p>

            <div v-if="errorMessage" class="alert alert-danger" role="alert">
              {{ errorMessage }}
            </div>

            <form @submit.prevent="handleCreateAccount" novalidate>
              <!-- Account type -->
              <div class="mb-4">
                <label class="form-label fw-semibold" for="accountType">Account type</label>
                <select id="accountType" v-model="form.accountType" class="form-select">
                  <option value="customer">Customer</option>
                  <option value="contractor">Contractor business</option>
                </select>
              </div>

              <!-- ============== CUSTOMER ============== -->
              <template v-if="!isContractor">
                <h2 class="h6 text-uppercase text-secondary mb-3">Your information</h2>
                <div class="row g-3 mb-4">
                  <div class="col-12">
                    <label class="form-label">Full name</label>
                    <input v-model="form.name" class="form-control" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Email</label>
                    <input v-model="form.email" type="email" class="form-control" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Phone</label>
                    <input v-model="form.phone" class="form-control" placeholder="(555) 555-5555" />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Password</label>
                    <input v-model="form.password" type="password" class="form-control" required minlength="6" />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Confirm password</label>
                    <input v-model="form.passwordConfirm" type="password" class="form-control" required />
                  </div>
                </div>

                <h2 class="h6 text-uppercase text-secondary mb-3">Agreements</h2>
                <div class="agreement-box mb-3">
                  <div class="form-check mb-2">
                    <input id="cust-age" v-model="form.ageConfirmed" class="form-check-input" type="checkbox" />
                    <label class="form-check-label" for="cust-age">
                      I confirm I am at least 18 years old.
                    </label>
                  </div>
                  <div class="form-check mb-2">
                    <input id="cust-terms" v-model="form.acceptedTerms" class="form-check-input" type="checkbox" />
                    <label class="form-check-label" for="cust-terms">
                      I agree to the <a href="#" @click.prevent>Terms of Service</a>.
                    </label>
                  </div>
                  <div class="form-check mb-2">
                    <input id="cust-privacy" v-model="form.acceptedPrivacyPolicy" class="form-check-input" type="checkbox" />
                    <label class="form-check-label" for="cust-privacy">
                      I have read and accept the <a href="#" @click.prevent>Privacy Policy</a>.
                    </label>
                  </div>
                  <div class="form-check">
                    <input id="cust-marketing" v-model="form.marketingOptIn" class="form-check-input" type="checkbox" />
                    <label class="form-check-label" for="cust-marketing">
                      Send me occasional emails with seasonal tips and offers (optional).
                    </label>
                  </div>
                </div>
              </template>

              <!-- ============== CONTRACTOR ============== -->
              <template v-else>
                <h2 class="h6 text-uppercase text-secondary mb-3">Business identity</h2>
                <div class="row g-3 mb-4">
                  <div class="col-md-6">
                    <label class="form-label">Doing-business-as (DBA) name</label>
                    <input v-model="form.businessName" class="form-control" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Legal business name</label>
                    <input v-model="form.legalBusinessName" class="form-control" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Business type / entity</label>
                    <select v-model="form.businessType" class="form-select" required>
                      <option value="" disabled>Select…</option>
                      <option v-for="t in BUSINESS_TYPES" :key="t" :value="t">{{ t }}</option>
                    </select>
                  </div>
                  <div class="col-md-3">
                    <label class="form-label">Tax ID (EIN)</label>
                    <input v-model="form.taxId" class="form-control" placeholder="12-3456789" required />
                  </div>
                  <div class="col-md-3">
                    <label class="form-label">Years in business</label>
                    <input v-model="form.yearsInBusiness" type="number" min="0" class="form-control" />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Website</label>
                    <input v-model="form.websiteUrl" type="url" class="form-control" placeholder="https://" />
                  </div>
                </div>

                <h2 class="h6 text-uppercase text-secondary mb-3">Licensing &amp; insurance</h2>
                <div class="row g-3 mb-4">
                  <div class="col-md-4">
                    <label class="form-label">Contractor license #</label>
                    <input v-model="form.licenseNumber" class="form-control" required />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Insurance carrier</label>
                    <input v-model="form.insuranceCarrier" class="form-control" required />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Insurance policy #</label>
                    <input v-model="form.insurancePolicyNumber" class="form-control" required />
                  </div>
                </div>

                <h2 class="h6 text-uppercase text-secondary mb-3">Business address</h2>
                <div class="row g-3 mb-4">
                  <div class="col-12">
                    <label class="form-label">Street address</label>
                    <input v-model="form.businessAddress" class="form-control" required />
                  </div>
                  <div class="col-md-5">
                    <label class="form-label">City</label>
                    <input v-model="form.businessCity" class="form-control" required />
                  </div>
                  <div class="col-md-3">
                    <label class="form-label">State</label>
                    <select v-model="form.businessState" class="form-select" required>
                      <option value="" disabled>Select…</option>
                      <option v-for="s in US_STATES" :key="s" :value="s">{{ s }}</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">ZIP code</label>
                    <input v-model="form.businessZip" class="form-control" required />
                  </div>
                </div>

                <h2 class="h6 text-uppercase text-secondary mb-3">Authorized representative</h2>
                <div class="row g-3 mb-4">
                  <div class="col-md-6">
                    <label class="form-label">Full name</label>
                    <input v-model="form.ownerName" class="form-control" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Title</label>
                    <input v-model="form.ownerTitle" class="form-control" placeholder="Owner, CEO, Operations Manager…" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Work email</label>
                    <input v-model="form.ownerEmail" type="email" class="form-control" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Direct phone</label>
                    <input v-model="form.ownerPhone" class="form-control" required />
                  </div>
                </div>

                <h2 class="h6 text-uppercase text-secondary mb-3">Login &amp; primary contact</h2>
                <div class="row g-3 mb-4">
                  <div class="col-md-6">
                    <label class="form-label">Account contact name</label>
                    <input v-model="form.name" class="form-control" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Account phone</label>
                    <input v-model="form.phone" class="form-control" />
                  </div>
                  <div class="col-md-12">
                    <label class="form-label">Account email (used for login)</label>
                    <input v-model="form.email" type="email" class="form-control" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Password</label>
                    <input v-model="form.password" type="password" class="form-control" required minlength="6" />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Confirm password</label>
                    <input v-model="form.passwordConfirm" type="password" class="form-control" required />
                  </div>
                </div>

                <h2 class="h6 text-uppercase text-secondary mb-3">Services offered</h2>
                <div class="row g-3 mb-4">
                  <div class="col-md-6">
                    <label class="form-label">Services</label>
                    <select v-model="form.services" class="form-select" multiple required>
                      <option v-for="service in SERVICE_OPTIONS" :key="service" :value="service">{{ service }}</option>
                    </select>
                    <p class="small text-secondary mt-1 mb-0">Hold Ctrl / Cmd to select multiple.</p>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Service areas</label>
                    <input v-model="form.serviceAreas" class="form-control" placeholder="Downtown, Northside, West End" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Availability slots</label>
                    <input v-model="form.availability" class="form-control" placeholder="Mon 9:00 AM, Tue 1:30 PM" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Pricing range</label>
                    <input v-model="form.pricingRange" class="form-control" placeholder="$200-$500 inspection" required />
                  </div>
                </div>

                <h2 class="h6 text-uppercase text-secondary mb-3">Agreements</h2>
                <div class="agreement-box mb-3">
                  <div class="form-check mb-2">
                    <input id="con-auth" v-model="form.authorizedRepresentative" class="form-check-input" type="checkbox" />
                    <label class="form-check-label" for="con-auth">
                      I am authorized to register this business and certify the information above is accurate.
                    </label>
                  </div>
                  <div class="form-check mb-2">
                    <input id="con-w9" v-model="form.w9OnFile" class="form-check-input" type="checkbox" />
                    <label class="form-check-label" for="con-w9">
                      I understand a completed W-9 will be required before payouts (optional now).
                    </label>
                  </div>
                  <div class="form-check mb-2">
                    <input id="con-terms" v-model="form.contractorAcceptedTerms" class="form-check-input" type="checkbox" />
                    <label class="form-check-label" for="con-terms">
                      I agree to the <a href="#" @click.prevent>Contractor Terms of Service</a>.
                    </label>
                  </div>
                  <div class="form-check">
                    <input id="con-privacy" v-model="form.contractorAcceptedPrivacy" class="form-check-input" type="checkbox" />
                    <label class="form-check-label" for="con-privacy">
                      I have read and accept the <a href="#" @click.prevent>Privacy Policy</a>.
                    </label>
                  </div>
                </div>
              </template>

              <button class="btn btn-dark w-100 mt-3" type="submit" :disabled="isLoading">
                {{ isLoading
                  ? 'Creating…'
                  : isContractor
                    ? 'Register Business'
                    : 'Create Account' }}
              </button>
            </form>
          </div>
        </article>
      </div>
    </div>
  </main>
</template>

<style scoped>
.agreement-box {
  background: #f8f9fb;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 1rem 1.25rem;
}

.agreement-box a {
  color: #0f3057;
  text-decoration: underline;
}

h2.h6 {
  letter-spacing: 0.06em;
  font-size: 0.78rem;
}
</style>
