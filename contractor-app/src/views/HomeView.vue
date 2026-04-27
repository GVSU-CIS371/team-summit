<script setup>
import { computed, reactive, ref } from 'vue'
import { createJobRequest } from '../data/jobs'
import { getNearbyContractors, getContractorSlots } from '../data/contractors'
import { SERVICE_TYPES } from '../data/services'

const form = reactive({
  propertyAddress: '',
  city: '',
  state: '',
  zipCode: '',
  propertyType: 'Single-family',
  ownershipStatus: 'Owner',
  projectType: 'Repair',
  urgency: 'Within a week',
  roofType: 'Unknown',
  roofAge: '',
  stories: '',
  squareFootage: '',
  problemDescription: '',
  budgetRange: '',
  insuranceClaimStatus: 'No',
  preferredContactTime: 'Morning',
  availableDates: '',
  flexibleScheduling: 'Yes',
  additionalNotes: '',
  agreeContacted: false,
  confirmAccurate: false,
})

const nearbyContractors = computed(() => getNearbyContractors(search.location, search.serviceType))

const selectedContractor = computed(() => nearbyContractors.value.find((contractor) => contractor.id === selectedContractorId.value) || null)

const contractorSlots = computed(() => {
  if (!selectedContractorId.value) {
    return []
  }

  return getContractorSlots(selectedContractorId.value)
})

const canSubmit = computed(() => {
  return (
    selectedContractor.value &&
    selectedSlot.value &&
    requestForm.customerName &&
    requestForm.contactEmail &&
    requestForm.contactPhone &&
    requestForm.address &&
    requestForm.description
  )
})

function handlePhotoChange(event) {
  const files = Array.from(event.target.files || [])
  requestForm.photoNames = files.map((file) => file.name)
}

function chooseContractor(contractorId) {
  selectedContractorId.value = contractorId
  selectedSlot.value = ''
}

function submitRequest() {
  const createdJob = createJobRequest({ ...form })
  submittedJobId.value = createdJob.id

  form.propertyAddress = ''
  form.city = ''
  form.state = ''
  form.zipCode = ''
  form.propertyType = 'Single-family'
  form.ownershipStatus = 'Owner'
  form.projectType = 'Repair'
  form.urgency = 'Within a week'
  form.roofType = 'Unknown'
  form.roofAge = ''
  form.stories = ''
  form.squareFootage = ''
  form.problemDescription = ''
  form.budgetRange = ''
  form.insuranceClaimStatus = 'No'
  form.preferredContactTime = 'Morning'
  form.availableDates = ''
  form.flexibleScheduling = 'Yes'
  form.additionalNotes = ''
  form.agreeContacted = false
  form.confirmAccurate = false
}
</script>

<template>
  <main class="container py-4 py-lg-5">
    <section class="row g-4 align-items-stretch">
      <div class="col-12 col-lg-5">
        <article class="home-hero card border-0 shadow-sm h-100">
          <div class="card-body p-4 p-lg-5">
            <p class="text-uppercase small fw-semibold mb-2">Roofing Service Requests</p>
            <h1 class="display-6 fw-semibold mb-3">Tell us what your roof needs.</h1>
            <p class="text-secondary mb-4">
              Submit your request and our contractor team will review damage details, create an estimate, and move your job through the full workflow.
            </p>
            <div class="next-steps-block">
              <p class="mb-1 fw-semibold">What happens next</p>
              <ol class="small text-secondary mb-0">
                <li>Requested: your form is received.</li>
                <li>Estimated: contractor prepares pricing.</li>
                <li>Approved to Completed: crew schedules and finishes work.</li>
              </ol>
            </div>
          </div>
        </article>
      </div>
    </section>

      <div class="col-12 col-lg-7">
        <article class="card border-0 shadow-sm">
          <div class="card-body p-4 p-lg-5">
            <h2 class="h4 mb-3">Submit Job Request Form</h2>

    <section v-if="selectedContractor" class="card border-0 shadow-sm mb-4">
      <div class="card-body p-4">
        <h2 class="h5 mb-3">3. Profile and available time slots</h2>
        <div class="row g-4 align-items-start">
          <div class="col-12 col-lg-7">
            <h3 class="h6 mb-2">{{ selectedContractor.name }}</h3>
            <p class="mb-2 text-secondary">{{ selectedContractor.rating }} stars from {{ selectedContractor.reviewCount }} reviews</p>
            <p class="mb-2"><strong>Services:</strong> {{ selectedContractor.services.join(', ') }}</p>
            <p class="mb-0"><strong>Pricing:</strong> {{ selectedContractor.pricingRange }}</p>
          </div>
          <div class="col-12 col-lg-5">
            <label class="form-label">Select preferred time</label>
            <div class="d-grid gap-2">
              <button
                v-for="slot in contractorSlots"
                :key="slot"
                class="btn btn-sm"
                :class="selectedSlot === slot ? 'btn-dark' : 'btn-outline-dark'"
                @click="selectedSlot = slot"
                type="button"
              >
                {{ slot }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

            <form class="row g-3" @submit.prevent="submitRequest">
              <div class="col-12">
                <label class="form-label" for="propertyAddress">Property Address</label>
                <input id="propertyAddress" v-model="form.propertyAddress" class="form-control" required />
              </div>

              <div class="col-12 col-md-4">
                <label class="form-label" for="city">City</label>
                <input id="city" v-model="form.city" class="form-control" required />
              </div>

              <div class="col-12 col-md-4">
                <label class="form-label" for="state">State</label>
                <input id="state" v-model="form.state" class="form-control" maxlength="2" required />
              </div>

              <div class="col-12 col-md-4">
                <label class="form-label" for="zipCode">ZIP Code</label>
                <input id="zipCode" v-model="form.zipCode" class="form-control" required />
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label" for="propertyType">Property Type</label>
                <select id="propertyType" v-model="form.propertyType" class="form-select">
                  <option>Single-family</option>
                  <option>Multi-family</option>
                  <option>Commercial</option>
                </select>
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label" for="ownershipStatus">Ownership Status</label>
                <select id="ownershipStatus" v-model="form.ownershipStatus" class="form-select">
                  <option>Owner</option>
                  <option>Property Manager</option>
                  <option>Tenant</option>
                </select>
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label" for="projectType">Project Type</label>
                <select id="projectType" v-model="form.projectType" class="form-select">
                  <option>Repair</option>
                  <option>Replacement</option>
                  <option>Inspection</option>
                  <option>Leak</option>
                  <option>Storm Damage</option>
                </select>
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label" for="urgency">Urgency</label>
                <select id="urgency" v-model="form.urgency" class="form-select">
                  <option>Emergency</option>
                  <option>Within a week</option>
                  <option>1-3 months</option>
                  <option>Just researching</option>
                </select>
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label" for="roofType">Roof Type</label>
                <select id="roofType" v-model="form.roofType" class="form-select">
                  <option>Asphalt shingles</option>
                  <option>Metal</option>
                  <option>Tile</option>
                  <option>Flat</option>
                  <option>Unknown</option>
                </select>
              </div>

              <div class="col-12 col-md-3">
                <label class="form-label" for="roofAge">Approximate Roof Age</label>
                <input id="roofAge" v-model="form.roofAge" class="form-control" placeholder="Years" required />
              </div>

              <div class="col-12 col-md-3">
                <label class="form-label" for="stories">Number of Stories</label>
                <input id="stories" v-model="form.stories" class="form-control" required />
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label" for="squareFootage">Approximate Square Footage <span class="text-secondary fw-normal">(optional)</span></label>
                <input id="squareFootage" v-model="form.squareFootage" class="form-control" />
              </div>

              <div class="col-12">
                <label class="form-label" for="problemDescription">Problem Description</label>
                <textarea id="problemDescription" v-model="form.problemDescription" class="form-control" rows="5" required></textarea>
              </div>

              <div class="col-12">
                <label class="form-label" for="photos">Upload Photos</label>
                <input id="photos" class="form-control" type="file" multiple accept="image/*" />
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label" for="budgetRange">Budget Range <span class="text-secondary fw-normal">(optional)</span></label>
                <input id="budgetRange" v-model="form.budgetRange" class="form-control" placeholder="e.g. $5,000 - $8,000" />
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label" for="insuranceClaimStatus">Insurance Claim Status</label>
                <select id="insuranceClaimStatus" v-model="form.insuranceClaimStatus" class="form-select">
                  <option>Yes filed</option>
                  <option>Planning to file</option>
                  <option>No</option>
                </select>
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label" for="preferredContactTime">Preferred Contact Time</label>
                <select id="preferredContactTime" v-model="form.preferredContactTime" class="form-select">
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                </select>
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label" for="availableDates">Available Dates for Inspection <span class="text-secondary fw-normal">(optional)</span></label>
                <input id="availableDates" v-model="form.availableDates" class="form-control" placeholder="e.g. Tue/Thu next week" />
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label" for="flexibleScheduling">Flexible Scheduling</label>
                <select id="flexibleScheduling" v-model="form.flexibleScheduling" class="form-select">
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>

              <div class="col-12">
                <label class="form-label" for="additionalNotes">Additional Notes <span class="text-secondary fw-normal">(optional)</span></label>
                <textarea id="additionalNotes" v-model="form.additionalNotes" class="form-control" rows="3"></textarea>
              </div>

              <div class="col-12">
                <div class="form-check mb-2">
                  <input id="agreeContacted" v-model="form.agreeContacted" class="form-check-input" type="checkbox" required />
                  <label class="form-check-label" for="agreeContacted">Agree to be contacted by contractors</label>
                </div>
                <div class="form-check">
                  <input id="confirmAccurate" v-model="form.confirmAccurate" class="form-check-input" type="checkbox" required />
                  <label class="form-check-label" for="confirmAccurate">Confirm information is accurate</label>
                </div>
              </div>

          <div class="col-12 d-flex flex-wrap gap-2 align-items-center">
            <button class="btn btn-primary px-4" type="submit" :disabled="!canSubmit">Submit Request</button>
            <span class="small text-secondary" v-if="!selectedContractor">Choose a contractor first.</span>
            <span class="small text-secondary" v-else-if="!selectedSlot">Select a preferred time slot.</span>
          </div>
        </form>
      </div>
    </section>
  </main>
</template>

<style scoped>
.flow-hero {
  background: linear-gradient(155deg, #fdf3df, #ffffff);
}

.next-steps-block {
  margin-top: 1rem;
  padding: 0.9rem 1rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(28, 37, 48, 0.12);
}
</style>
