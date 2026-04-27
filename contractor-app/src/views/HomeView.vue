<script setup>
import { computed, reactive, ref } from 'vue'
import { createJobRequest } from '../data/jobs'
import { getNearbyContractors, getContractorSlots } from '../data/contractors'
import { SERVICE_TYPES } from '../data/services'

const search = reactive({
  location: '',
  serviceType: SERVICE_TYPES[0],
})

const selectedContractorId = ref('')
const selectedSlot = ref('')
const submittedJob = ref(null)

const requestForm = reactive({
  customerName: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  propertyType: 'Homeowner',
  description: '',
  photoNames: [],
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
  if (!canSubmit.value) {
    return
  }

  const createdJob = createJobRequest({
    customerName: requestForm.customerName,
    contactEmail: requestForm.contactEmail,
    contactPhone: requestForm.contactPhone,
    address: requestForm.address,
    propertyType: requestForm.propertyType,
    serviceType: search.serviceType,
    description: requestForm.description,
    contractorId: selectedContractor.value.id,
    preferredTimeSlot: selectedSlot.value,
    requestPhotos: requestForm.photoNames,
  })

  submittedJob.value = {
    id: createdJob.id,
    contractorName: selectedContractor.value.name,
    stage: createdJob.workflow.stage,
  }

  requestForm.customerName = ''
  requestForm.contactEmail = ''
  requestForm.contactPhone = ''
  requestForm.address = ''
  requestForm.propertyType = 'Homeowner'
  requestForm.description = ''
  requestForm.photoNames = []
  selectedContractorId.value = ''
  selectedSlot.value = ''
}
</script>

<template>
  <main class="container py-4 py-lg-5">
    <section class="row g-4 mb-4">
      <div class="col-12">
        <article class="card border-0 shadow-sm flow-hero">
          <div class="card-body p-4 p-lg-5">
            <p class="text-uppercase small fw-semibold mb-2">Roofing Booking Flow</p>
            <h1 class="display-6 fw-semibold mb-3">Find a roofing contractor and submit your request in one flow.</h1>
            <p class="text-secondary mb-0">
              Enter your location, choose a service, compare nearby contractors, select a time slot, and submit photos with your request details.
            </p>
          </div>
        </article>
      </div>
    </section>

    <section class="card border-0 shadow-sm mb-4">
      <div class="card-body p-4">
        <h2 class="h5 mb-3">1. Location and service</h2>
        <div class="row g-3">
          <div class="col-12 col-lg-6">
            <label class="form-label" for="location">Address, city, or ZIP</label>
            <input id="location" v-model="search.location" class="form-control" placeholder="Nashville or 37211" required />
          </div>
          <div class="col-12 col-lg-6">
            <label class="form-label" for="serviceType">Service needed</label>
            <select id="serviceType" v-model="search.serviceType" class="form-select">
              <option v-for="service in SERVICE_TYPES" :key="service" :value="service">{{ service }}</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <section class="card border-0 shadow-sm mb-4">
      <div class="card-body p-4">
        <h2 class="h5 mb-3">2. Nearby contractors</h2>
        <div class="row g-3">
          <div v-for="contractor in nearbyContractors" :key="contractor.id" class="col-12 col-xl-4">
            <article class="card border h-100 contractor-card" :class="{ selected: selectedContractorId === contractor.id }">
              <img :src="contractor.photos[0]" class="card-img-top contractor-image" :alt="contractor.name" />
              <div class="card-body">
                <div class="d-flex justify-content-between gap-2 mb-2">
                  <h3 class="h6 mb-0">{{ contractor.name }}</h3>
                  <span class="badge text-bg-light border">{{ contractor.rating }} ({{ contractor.reviewCount }})</span>
                </div>
                <p class="small text-secondary mb-1">Availability: {{ contractor.availability }}</p>
                <p class="small text-secondary mb-2">Pricing range: {{ contractor.pricingRange }}</p>
                <p class="small mb-2">
                  <strong>Services:</strong> {{ contractor.services.join(', ') }}
                </p>
                <div class="d-flex gap-2">
                  <button class="btn btn-sm btn-outline-dark" @click="chooseContractor(contractor.id)">
                    {{ selectedContractorId === contractor.id ? 'Selected' : 'Choose contractor' }}
                  </button>
                </div>
              </div>
            </article>
          </div>

          <div v-if="nearbyContractors.length === 0" class="col-12">
            <p class="text-secondary mb-0">No nearby contractors match your service yet. Try a nearby city or ZIP code.</p>
          </div>
        </div>
      </div>
    </section>

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

    <section class="card border-0 shadow-sm">
      <div class="card-body p-4 p-lg-5">
        <h2 class="h5 mb-3">4. Submit request details</h2>

        <div v-if="submittedJob" class="alert alert-success" role="alert">
          Request <strong>{{ submittedJob.id }}</strong> submitted to {{ submittedJob.contractorName }}.
          Initial stage: <strong>{{ submittedJob.stage }}</strong>.
        </div>

        <form class="row g-3" @submit.prevent="submitRequest">
          <div class="col-12 col-md-6">
            <label class="form-label" for="customerName">Full name</label>
            <input id="customerName" v-model="requestForm.customerName" class="form-control" required />
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label" for="contactPhone">Phone</label>
            <input id="contactPhone" v-model="requestForm.contactPhone" class="form-control" required />
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label" for="contactEmail">Email</label>
            <input id="contactEmail" v-model="requestForm.contactEmail" class="form-control" type="email" required />
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label" for="propertyType">Property type</label>
            <select id="propertyType" v-model="requestForm.propertyType" class="form-select">
              <option>Homeowner</option>
              <option>Business</option>
            </select>
          </div>

          <div class="col-12">
            <label class="form-label" for="address">Service address</label>
            <input id="address" v-model="requestForm.address" class="form-control" required />
          </div>

          <div class="col-12">
            <label class="form-label" for="description">Request description</label>
            <textarea id="description" v-model="requestForm.description" class="form-control" rows="4" required></textarea>
          </div>

          <div class="col-12">
            <label class="form-label" for="photos">Photos</label>
            <input id="photos" type="file" class="form-control" multiple accept="image/*" @change="handlePhotoChange" />
            <p class="small text-secondary mb-0 mt-2" v-if="requestForm.photoNames.length">
              Selected: {{ requestForm.photoNames.join(', ') }}
            </p>
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

.contractor-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.contractor-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.09);
}

.contractor-card.selected {
  border-color: #212529 !important;
  box-shadow: 0 0 0 2px rgba(33, 37, 41, 0.15);
}

.contractor-image {
  height: 170px;
  object-fit: cover;
}
</style>
