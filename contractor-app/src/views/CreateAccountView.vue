<script setup>
import { reactive, ref } from 'vue'

const accountType = ref('customer')
const message = ref('')

const contractorForm = reactive({
  // 1 — Account
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',

  // 2 — Company
  legalName: '',
  dbaName: '',
  businessType: '',
  yearEstablished: '',
  numEmployees: '',
  website: '',
  shortDescription: '',
  longDescription: '',
  tagline: '',

  // 3 — Service Area
  primaryAddress: '',
  serviceCity: '',
  serviceZipCodes: '',
  serviceRadius: '',
  emergencyService: '',

  // 4 — Services
  servicesOffered: [],
  roofingTypes: [],
  certifications: [],

  // 5 — Licensing & Compliance
  licenseNumber: '',
  licenseState: '',
  licenseExpiry: '',
  hasLiability: '',
  hasWorkersComp: '',
  isBonded: '',
  financingOptions: '',
  warrantyYears: '',
  warrantyType: '',
  safetyCerts: '',
  facebook: '',
  instagram: '',
  linkedin: '',
  agreeTerms: false,
  agreePrivacy: false,
})

const customerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  preferredContactMethod: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  agreeTerms: false,
  agreePrivacy: false,
  smsConsent: false,
})

const servicesList = [
  'Roof Repair',
  'Roof Replacement',
  'Inspections',
  'Storm Damage Repair',
  'Commercial Roofing',
  'Residential Roofing',
]

const roofingTypesList = [
  'Asphalt Shingles',
  'Metal Roofing',
  'Tile',
  'Flat Roofs (TPO, EPDM)',
]

const certificationsList = [
  'GAF Certified',
  'Owens Corning Preferred Contractor',
]

function submitAccount() {
  if (accountType.value === 'contractor' && contractorForm.password !== contractorForm.confirmPassword) {
    message.value = 'Contractor passwords must match.'
    return
  }

  if (accountType.value === 'customer' && customerForm.password !== customerForm.confirmPassword) {
    message.value = 'Customer passwords must match.'
    return
  }

  message.value = `${accountType.value === 'contractor' ? 'Contractor' : 'Customer'} account request captured (demo only).`
}
</script>

<template>
  <main class="container py-4 py-lg-5">
    <section class="row justify-content-center">
      <div class="col-12 col-lg-10">

        <!-- Type selector -->
        <div class="d-flex gap-2 mb-4 flex-wrap">
          <button
            class="btn"
            :class="accountType === 'customer' ? 'btn-primary' : 'btn-outline-primary'"
            type="button"
            @click="accountType = 'customer'"
          >Customer</button>
          <button
            class="btn"
            :class="accountType === 'contractor' ? 'btn-dark' : 'btn-outline-dark'"
            type="button"
            @click="accountType = 'contractor'"
          >Contractor</button>
        </div>

        <div v-if="message" class="alert alert-success mb-4" role="alert">{{ message }}</div>

        <!-- ─── CONTRACTOR FORM ─── -->
        <form v-if="accountType === 'contractor'" @submit.prevent="submitAccount">

          <!-- Section 1: Account Info -->
          <div class="form-section card border-0 shadow-sm mb-4">
            <div class="card-header-section px-4 pt-4 pb-2">
              <span class="section-number">1</span>
              <div>
                <h2 class="h5 mb-0">Basic Account Information</h2>
                <p class="small text-secondary mb-0">Your login credentials</p>
              </div>
            </div>
            <div class="card-body p-4">
              <div class="row g-3">
                <div class="col-12 col-md-6">
                  <label class="form-label" for="firstName">First Name</label>
                  <input id="firstName" v-model="contractorForm.firstName" class="form-control" required />
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label" for="lastName">Last Name</label>
                  <input id="lastName" v-model="contractorForm.lastName" class="form-control" required />
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label" for="cEmail">Business Email</label>
                  <input id="cEmail" v-model="contractorForm.email" class="form-control" type="email" required />
                  <div class="form-text">Verification email will be sent.</div>
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label" for="cPhone">Phone Number</label>
                  <input id="cPhone" v-model="contractorForm.phone" class="form-control" required />
                  <div class="form-text">Used for SMS verification.</div>
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label" for="cPassword">Password</label>
                  <input id="cPassword" v-model="contractorForm.password" class="form-control" type="password" required />
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label" for="cConfirmPassword">Confirm Password</label>
                  <input id="cConfirmPassword" v-model="contractorForm.confirmPassword" class="form-control" type="password" required />
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: Company Info -->
          <div class="form-section card border-0 shadow-sm mb-4">
            <div class="card-header-section px-4 pt-4 pb-2">
              <span class="section-number">2</span>
              <div>
                <h2 class="h5 mb-0">Company Information</h2>
                <p class="small text-secondary mb-0">Your public-facing contractor profile</p>
              </div>
            </div>
            <div class="card-body p-4">
              <div class="row g-3">
                <div class="col-12 col-md-6">
                  <label class="form-label" for="legalName">Legal Business Name</label>
                  <input id="legalName" v-model="contractorForm.legalName" class="form-control" required />
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label" for="dbaName">DBA / Trade Name <span class="text-secondary fw-normal">(optional)</span></label>
                  <input id="dbaName" v-model="contractorForm.dbaName" class="form-control" />
                </div>
                <div class="col-12 col-md-4">
                  <label class="form-label" for="businessType">Business Type</label>
                  <select id="businessType" v-model="contractorForm.businessType" class="form-select" required>
                    <option value="" disabled>Select…</option>
                    <option>LLC</option>
                    <option>Sole Proprietor</option>
                    <option>Corporation</option>
                    <option>Partnership</option>
                    <option>S-Corp</option>
                  </select>
                </div>
                <div class="col-12 col-md-4">
                  <label class="form-label" for="yearEstablished">Year Established</label>
                  <input id="yearEstablished" v-model="contractorForm.yearEstablished" class="form-control" type="number" min="1900" :max="new Date().getFullYear()" required />
                </div>
                <div class="col-12 col-md-4">
                  <label class="form-label" for="numEmployees">Number of Employees</label>
                  <input id="numEmployees" v-model="contractorForm.numEmployees" class="form-control" type="number" min="1" required />
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label" for="website">Website URL <span class="text-secondary fw-normal">(optional)</span></label>
                  <input id="website" v-model="contractorForm.website" class="form-control" type="url" placeholder="https://" />
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label" for="tagline">Brand Tagline <span class="text-secondary fw-normal">(optional)</span></label>
                  <input id="tagline" v-model="contractorForm.tagline" class="form-control" placeholder="e.g. Your roof, our priority." />
                </div>
                <div class="col-12">
                  <label class="form-label" for="shortDesc">Short Business Description</label>
                  <input id="shortDesc" v-model="contractorForm.shortDescription" class="form-control" maxlength="160" placeholder="One sentence summary (max 160 chars)" required />
                </div>
                <div class="col-12">
                  <label class="form-label" for="longDesc">Full Business Description</label>
                  <textarea id="longDesc" v-model="contractorForm.longDescription" class="form-control" rows="4" placeholder="Tell customers what makes your company stand out." required></textarea>
                </div>
                <div class="col-12">
                  <label class="form-label" for="logoUpload">Company Logo <span class="text-secondary fw-normal">(optional)</span></label>
                  <input id="logoUpload" class="form-control" type="file" accept="image/*" />
                  <div class="form-text">PNG, JPG, or SVG recommended.</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 3: Service Area -->
          <div class="form-section card border-0 shadow-sm mb-4">
            <div class="card-header-section px-4 pt-4 pb-2">
              <span class="section-number">3</span>
              <div>
                <h2 class="h5 mb-0">Service Area &amp; Location</h2>
                <p class="small text-secondary mb-0">Where you operate — critical for customer matching</p>
              </div>
            </div>
            <div class="card-body p-4">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label" for="primaryAddress">Primary Business Address</label>
                  <input id="primaryAddress" v-model="contractorForm.primaryAddress" class="form-control" required />
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label" for="serviceCity">Service Cities</label>
                  <input id="serviceCity" v-model="contractorForm.serviceCity" class="form-control" placeholder="e.g. Austin, Round Rock, Cedar Park" />
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label" for="serviceZip">Service ZIP Codes</label>
                  <input id="serviceZip" v-model="contractorForm.serviceZipCodes" class="form-control" placeholder="e.g. 78701, 78750" />
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label" for="serviceRadius">Service Radius</label>
                  <select id="serviceRadius" v-model="contractorForm.serviceRadius" class="form-select">
                    <option value="">Select…</option>
                    <option>25 miles</option>
                    <option>50 miles</option>
                    <option>75 miles</option>
                    <option>100 miles</option>
                    <option>Statewide</option>
                  </select>
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label" for="emergency">Emergency Service Availability</label>
                  <select id="emergency" v-model="contractorForm.emergencyService" class="form-select" required>
                    <option value="">Select…</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 4: Services & Specialties -->
          <div class="form-section card border-0 shadow-sm mb-4">
            <div class="card-header-section px-4 pt-4 pb-2">
              <span class="section-number">4</span>
              <div>
                <h2 class="h5 mb-0">Services &amp; Specialties</h2>
                <p class="small text-secondary mb-0">How customers find you</p>
              </div>
            </div>
            <div class="card-body p-4">
              <div class="row g-4">
                <div class="col-12 col-md-4">
                  <p class="fw-semibold mb-2 small text-uppercase">Services Offered</p>
                  <div v-for="s in servicesList" :key="s" class="form-check mb-1">
                    <input
                      :id="`svc-${s}`"
                      v-model="contractorForm.servicesOffered"
                      class="form-check-input"
                      type="checkbox"
                      :value="s"
                    />
                    <label class="form-check-label" :for="`svc-${s}`">{{ s }}</label>
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <p class="fw-semibold mb-2 small text-uppercase">Roofing Types</p>
                  <div v-for="t in roofingTypesList" :key="t" class="form-check mb-1">
                    <input
                      :id="`rt-${t}`"
                      v-model="contractorForm.roofingTypes"
                      class="form-check-input"
                      type="checkbox"
                      :value="t"
                    />
                    <label class="form-check-label" :for="`rt-${t}`">{{ t }}</label>
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <p class="fw-semibold mb-2 small text-uppercase">Certifications / Brands</p>
                  <div v-for="c in certificationsList" :key="c" class="form-check mb-1">
                    <input
                      :id="`cert-${c}`"
                      v-model="contractorForm.certifications"
                      class="form-check-input"
                      type="checkbox"
                      :value="c"
                    />
                    <label class="form-check-label" :for="`cert-${c}`">{{ c }}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 5: Licensing & Compliance -->
          <div class="form-section card border-0 shadow-sm mb-4">
            <div class="card-header-section px-4 pt-4 pb-2">
              <span class="section-number">5</span>
              <div>
                <h2 class="h5 mb-0">Licensing, Insurance &amp; Compliance</h2>
                <p class="small text-secondary mb-0">Builds trust — required for platform approval</p>
              </div>
            </div>
            <div class="card-body p-4">
              <div class="row g-3">
                <!-- License -->
                <div class="col-12"><p class="fw-semibold small text-uppercase text-secondary mb-1">Licensing</p></div>
                <div class="col-12 col-md-4">
                  <label class="form-label" for="licenseNumber">Business License Number</label>
                  <input id="licenseNumber" v-model="contractorForm.licenseNumber" class="form-control" required />
                </div>
                <div class="col-12 col-md-4">
                  <label class="form-label" for="licenseState">License State</label>
                  <input id="licenseState" v-model="contractorForm.licenseState" class="form-control" maxlength="2" placeholder="TX" required />
                </div>
                <div class="col-12 col-md-4">
                  <label class="form-label" for="licenseExpiry">Expiration Date</label>
                  <input id="licenseExpiry" v-model="contractorForm.licenseExpiry" class="form-control" type="date" required />
                </div>
                <div class="col-12">
                  <label class="form-label" for="licenseFile">Upload License Document</label>
                  <input id="licenseFile" class="form-control" type="file" accept=".pdf,.jpg,.png" />
                </div>

                <!-- Insurance -->
                <div class="col-12 mt-2"><p class="fw-semibold small text-uppercase text-secondary mb-1">Insurance</p></div>
                <div class="col-12 col-md-4">
                  <label class="form-label" for="liability">General Liability Insurance</label>
                  <select id="liability" v-model="contractorForm.hasLiability" class="form-select" required>
                    <option value="">Select…</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
                <div class="col-12 col-md-4">
                  <label class="form-label" for="workersComp">Workers' Compensation</label>
                  <select id="workersComp" v-model="contractorForm.hasWorkersComp" class="form-select" required>
                    <option value="">Select…</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
                <div class="col-12 col-md-4">
                  <label class="form-label" for="bonded">Bonded?</label>
                  <select id="bonded" v-model="contractorForm.isBonded" class="form-select" required>
                    <option value="">Select…</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
                <div class="col-12">
                  <label class="form-label" for="insuranceFile">Upload Insurance Certificate</label>
                  <input id="insuranceFile" class="form-control" type="file" accept=".pdf,.jpg,.png" />
                </div>
                <div class="col-12">
                  <label class="form-label" for="identityFile">Identity / Business Verification Document</label>
                  <input id="identityFile" class="form-control" type="file" accept=".pdf,.jpg,.png" />
                </div>

                <!-- Extras -->
                <div class="col-12 mt-2"><p class="fw-semibold small text-uppercase text-secondary mb-1">Additional Details</p></div>
                <div class="col-12 col-md-6">
                  <label class="form-label" for="financing">Financing Options Offered</label>
                  <select id="financing" v-model="contractorForm.financingOptions" class="form-select">
                    <option value="">Select…</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
                <div class="col-12 col-md-3">
                  <label class="form-label" for="warrantyYears">Warranty Offered (years)</label>
                  <input id="warrantyYears" v-model="contractorForm.warrantyYears" class="form-control" type="number" min="0" placeholder="e.g. 10" />
                </div>
                <div class="col-12 col-md-3">
                  <label class="form-label" for="warrantyType">Warranty Type</label>
                  <input id="warrantyType" v-model="contractorForm.warrantyType" class="form-control" placeholder="e.g. Workmanship" />
                </div>
                <div class="col-12">
                  <label class="form-label" for="safetyCerts">Safety Certifications</label>
                  <input id="safetyCerts" v-model="contractorForm.safetyCerts" class="form-control" placeholder="e.g. OSHA 10, OSHA 30" />
                </div>

                <!-- Social Media -->
                <div class="col-12 mt-2"><p class="fw-semibold small text-uppercase text-secondary mb-1">Social Media <span class="fw-normal">(optional)</span></p></div>
                <div class="col-12 col-md-4">
                  <label class="form-label" for="facebook">Facebook</label>
                  <input id="facebook" v-model="contractorForm.facebook" class="form-control" type="url" placeholder="https://facebook.com/…" />
                </div>
                <div class="col-12 col-md-4">
                  <label class="form-label" for="instagram">Instagram</label>
                  <input id="instagram" v-model="contractorForm.instagram" class="form-control" type="url" placeholder="https://instagram.com/…" />
                </div>
                <div class="col-12 col-md-4">
                  <label class="form-label" for="linkedin">LinkedIn</label>
                  <input id="linkedin" v-model="contractorForm.linkedin" class="form-control" type="url" placeholder="https://linkedin.com/…" />
                </div>

                <!-- Agreements -->
                <div class="col-12 mt-2">
                  <div class="form-check mb-2">
                    <input id="agreeTerms" v-model="contractorForm.agreeTerms" class="form-check-input" type="checkbox" required />
                    <label class="form-check-label" for="agreeTerms">I agree to the Terms &amp; Conditions</label>
                  </div>
                  <div class="form-check">
                    <input id="agreePrivacy" v-model="contractorForm.agreePrivacy" class="form-check-input" type="checkbox" required />
                    <label class="form-check-label" for="agreePrivacy">I agree to the Privacy Policy</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-end mb-5">
            <button class="btn btn-dark px-5 py-2" type="submit">Create Contractor Account</button>
          </div>
        </form>

        <!-- ─── CUSTOMER FORM ─── -->
        <form v-else class="card border-0 shadow-sm" @submit.prevent="submitAccount">
          <div class="card-body p-4 p-lg-5">
            <h2 class="h5 mb-4">Customer Account Registration</h2>
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <label class="form-label" for="customerFirstName">First Name</label>
                <input id="customerFirstName" v-model="customerForm.firstName" class="form-control" required />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label" for="customerLastName">Last Name</label>
                <input id="customerLastName" v-model="customerForm.lastName" class="form-control" required />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label" for="customerEmail">Email Address</label>
                <input id="customerEmail" v-model="customerForm.email" class="form-control" type="email" required />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label" for="phoneNumber">Phone Number</label>
                <input id="phoneNumber" v-model="customerForm.phoneNumber" class="form-control" required />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label" for="customerPassword">Password</label>
                <input id="customerPassword" v-model="customerForm.password" class="form-control" type="password" required />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label" for="customerConfirmPassword">Confirm Password</label>
                <input id="customerConfirmPassword" v-model="customerForm.confirmPassword" class="form-control" type="password" required />
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label" for="preferredContactMethod">Preferred Contact Method</label>
                <select id="preferredContactMethod" v-model="customerForm.preferredContactMethod" class="form-select" required>
                  <option value="">Select…</option>
                  <option>Call</option>
                  <option>Text</option>
                  <option>Email</option>
                </select>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label" for="customerAddress">Address <span class="text-secondary fw-normal">(optional)</span></label>
                <input id="customerAddress" v-model="customerForm.address" class="form-control" />
              </div>
              <div class="col-12 col-md-4">
                <label class="form-label" for="customerCity">City</label>
                <input id="customerCity" v-model="customerForm.city" class="form-control" required />
              </div>
              <div class="col-12 col-md-4">
                <label class="form-label" for="customerState">State</label>
                <input id="customerState" v-model="customerForm.state" class="form-control" maxlength="2" required />
              </div>
              <div class="col-12 col-md-4">
                <label class="form-label" for="customerZip">ZIP Code</label>
                <input id="customerZip" v-model="customerForm.zipCode" class="form-control" required />
              </div>
              <div class="col-12">
                <div class="form-check mb-2">
                  <input id="customerTerms" v-model="customerForm.agreeTerms" class="form-check-input" type="checkbox" required />
                  <label class="form-check-label" for="customerTerms">Agree to Terms and Conditions</label>
                </div>
                <div class="form-check mb-2">
                  <input id="customerPrivacy" v-model="customerForm.agreePrivacy" class="form-check-input" type="checkbox" required />
                  <label class="form-check-label" for="customerPrivacy">Agree to Privacy Policy</label>
                </div>
                <div class="form-check">
                  <input id="customerSmsConsent" v-model="customerForm.smsConsent" class="form-check-input" type="checkbox" />
                  <label class="form-check-label" for="customerSmsConsent">SMS Consent <span class="text-secondary">(optional)</span></label>
                </div>
              </div>
              <div class="col-12 d-flex justify-content-end">
                <button class="btn btn-primary px-5 py-2" type="submit">Create Customer Account</button>
              </div>
            </div>
          </div>
        </form>

      </div>
    </section>
  </main>
</template>

<style scoped>
.card-header-section {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 1rem;
}

.section-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  min-width: 2rem;
  border-radius: 50%;
  background: #1c2530;
  color: #fff;
  font-weight: 600;
  font-size: 0.85rem;
  margin-top: 0.1rem;
}
</style>
