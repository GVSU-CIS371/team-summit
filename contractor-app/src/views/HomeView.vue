<script setup>
import { computed, reactive, ref, watch } from 'vue'
import {
  SERVICE_OPTIONS,
  createJobRequest,
  getNearbyContractors,
  requiresInspection,
} from '../data/jobs'

const form = reactive({
  customerName: '',
  location: '',
  city: '',
  state: '',
  zipCode: '',
  serviceType: 'Roof Repair',
  propertyType: 'Homeowner',
  preferredTime: 'Morning',
  description: '',
  notes: '',
  selectedContractorId: '',
  selectedSlot: '',
  priority: 'Medium',
})

const uploadedPhotos = ref([])
const submittedJob = ref(null)

const locationLabel = computed(() => {
  const parts = [form.city, form.state, form.zipCode].filter(Boolean)
  if (form.location) {
    return parts.length ? `${form.location}, ${parts.join(', ')}` : form.location
  }

  return parts.length ? parts.join(', ') : 'your area'
})

const nearbyContractors = computed(() => {
  const locationQuery = [form.location, form.city, form.state, form.zipCode].filter(Boolean).join(' ')
  const matchedByLocation = getNearbyContractors(form.serviceType, locationQuery)
  if (matchedByLocation.length) {
    return matchedByLocation
  }

  return getNearbyContractors(form.serviceType)
})

const selectedContractor = computed(() => {
  return nearbyContractors.value.find((contractor) => contractor.id === form.selectedContractorId) || nearbyContractors.value[0] || null
})

const selectedSlotOptions = computed(() => selectedContractor.value?.availability || [])

const serviceNeedsInspection = computed(() => requiresInspection(form.serviceType))

watch(
  nearbyContractors,
  (contractors) => {
    if (!contractors.length) {
      form.selectedContractorId = ''
      form.selectedSlot = ''
      return
    }

    const currentSelection = contractors.find((contractor) => contractor.id === form.selectedContractorId)
    if (!currentSelection) {
      form.selectedContractorId = contractors[0].id
    }
  },
  { immediate: true },
)

watch(
  selectedContractor,
  (contractor) => {
    if (!contractor) {
      form.selectedSlot = ''
      return
    }

    if (!contractor.availability.includes(form.selectedSlot)) {
      form.selectedSlot = contractor.availability[0] || ''
    }
  },
  { immediate: true },
)

function chooseContractor(contractorId) {
  form.selectedContractorId = contractorId
}

function onPhotoUpload(event) {
  uploadedPhotos.value = Array.from(event.target.files || []).map((file) => file.name)
}

function resetForm() {
  form.customerName = ''
  form.location = ''
  form.city = ''
  form.state = ''
  form.zipCode = ''
  form.serviceType = 'Roof Repair'
  form.propertyType = 'Homeowner'
  form.preferredTime = 'Morning'
  form.description = ''
  form.notes = ''
  form.selectedContractorId = ''
  form.selectedSlot = ''
  form.priority = 'Medium'
  uploadedPhotos.value = []
}

function submitRequest() {
  if (!selectedContractor.value) {
    return
  }

  const createdJob = createJobRequest({
    customerName: form.customerName || `${form.propertyType} request`,
    propertyType: form.propertyType,
    serviceType: form.serviceType,
    description: form.description || form.notes || `${form.serviceType} requested for ${locationLabel.value}`,
    priority: form.priority,
    address: form.location,
    city: form.city,
    state: form.state,
    zipCode: form.zipCode,
    contractorId: selectedContractor.value.id,
    contractorName: selectedContractor.value.name,
    selectedSlot: form.selectedSlot || selectedSlotOptions.value[0] || '',
    inspectionRequired: serviceNeedsInspection.value,
    uploadedPhotos: uploadedPhotos.value,
  })

  submittedJob.value = createdJob
  resetForm()
}
</script>

<template>
  <main class="container py-4 py-lg-5 booking-page">
    <section class="row g-4 align-items-stretch mb-4">
      <div class="col-12 col-lg-5">
        <article class="card border-0 shadow-sm booking-hero h-100">
          <div class="card-body p-4 p-lg-5 d-flex flex-column justify-content-between h-100">
            <div>
              <p class="text-uppercase small fw-semibold mb-2 hero-kicker">Roofing request flow</p>
              <h1 class="display-6 fw-semibold mb-3">Submit the job once, then let the workflow carry it.</h1>
              <p class="text-secondary mb-4">
                Enter the property location, choose the roofing service, compare nearby contractors, and reserve a time slot before the request goes out.
              </p>
            </div>

            <div class="workflow-stack">
              <div class="workflow-step">
                <span class="workflow-number">1</span>
                <div>
                  <p class="fw-semibold mb-1">Request intake</p>
                  <p class="small text-secondary mb-0">Client enters the address, roof issue, photos, and preferred timing.</p>
                </div>
              </div>
              <div class="workflow-step">
                <span class="workflow-number">2</span>
                <div>
                  <p class="fw-semibold mb-1">Contractor review</p>
                  <p class="small text-secondary mb-0">Simple jobs are accepted automatically; larger ones move to inspection and estimate.</p>
                </div>
              </div>
              <div class="workflow-step">
                <span class="workflow-number">3</span>
                <div>
                  <p class="fw-semibold mb-1">Escrow and closeout</p>
                  <p class="small text-secondary mb-0">Payment is held, work is confirmed, and the dispute window opens before release.</p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div class="col-12 col-lg-7">
        <article class="card border-0 shadow-sm">
          <div class="card-body p-4 p-lg-5">
            <div class="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
              <div>
                <h2 class="h4 mb-1">Build your request</h2>
                <p class="text-secondary mb-0">Find roofing contractors that offer the exact service you need.</p>
              </div>
              <span class="badge rounded-pill text-bg-light border request-badge">Live booking flow</span>
            </div>

            <div v-if="submittedJob" class="alert alert-success border-0 shadow-sm" role="alert">
              <strong>Request submitted.</strong> Tracking ID {{ submittedJob.id }} is now in the contractor queue.
              <div class="small mt-1">
                {{ submittedJob.contractorName }} will review the request, schedule inspection if needed, and hold payment in escrow until closeout.
              </div>
            </div>

            <form class="row g-3" @submit.prevent="submitRequest">
              <div class="col-12 col-md-6">
                <label class="form-label" for="customerName">Client name</label>
                <input id="customerName" v-model="form.customerName" class="form-control" placeholder="Alex Morgan" />
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label" for="propertyType">Property type</label>
                <select id="propertyType" v-model="form.propertyType" class="form-select">
                  <option>Homeowner</option>
                  <option>Business</option>
                  <option>Property Manager</option>
                </select>
              </div>

              <div class="col-12">
                <label class="form-label" for="location">Address or location</label>
                <input id="location" v-model="form.location" class="form-control" placeholder="123 Main St or Northside" required />
              </div>

              <div class="col-12 col-md-4">
                <label class="form-label" for="city">City</label>
                <input id="city" v-model="form.city" class="form-control" placeholder="Chicago" />
              </div>

              <div class="col-12 col-md-4">
                <label class="form-label" for="state">State</label>
                <input id="state" v-model="form.state" class="form-control" maxlength="2" placeholder="IL" />
              </div>

              <div class="col-12 col-md-4">
                <label class="form-label" for="zipCode">ZIP code</label>
                <input id="zipCode" v-model="form.zipCode" class="form-control" placeholder="60601" />
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label" for="serviceType">Service needed</label>
                <select id="serviceType" v-model="form.serviceType" class="form-select">
                  <option v-for="service in SERVICE_OPTIONS" :key="service" :value="service">{{ service }}</option>
                </select>
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label" for="preferredTime">Preferred time</label>
                <select id="preferredTime" v-model="form.preferredTime" class="form-select">
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                </select>
              </div>

              <div class="col-12">
                <label class="form-label">Nearby contractors for {{ form.serviceType }}</label>
                <div class="row g-3">
                  <div v-for="contractor in nearbyContractors" :key="contractor.id" class="col-12 col-xl-6">
                    <article class="card contractor-card h-100" :class="{ selected: contractor.id === form.selectedContractorId }">
                      <div class="card-body p-3 p-xl-4 d-flex flex-column h-100">
                        <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
                          <div>
                            <h3 class="h5 mb-1">{{ contractor.name }}</h3>
                            <p class="text-secondary small mb-0">{{ contractor.serviceAreas.join(' · ') }}</p>
                          </div>
                          <span class="badge text-bg-dark rounded-pill">{{ contractor.rating.toFixed(1) }} / 5</span>
                        </div>

                        <div class="d-flex flex-wrap gap-2 mb-3">
                          <span class="badge text-bg-light border">{{ contractor.reviews }} reviews</span>
                          <span class="badge text-bg-light border">{{ contractor.pricingRange }}</span>
                        </div>

                        <div class="service-tag-list mb-3">
                          <span v-for="service in contractor.services" :key="service" class="service-tag">{{ service }}</span>
                        </div>

                        <div class="photo-strip mb-3">
                          <div v-for="photo in contractor.photoHighlights" :key="photo" class="photo-tile">
                            {{ photo }}
                          </div>
                        </div>

                        <div class="mb-3">
                          <p class="small fw-semibold text-uppercase text-secondary mb-2">Availability</p>
                          <div class="d-flex flex-wrap gap-2">
                            <button
                              v-for="slot in contractor.availability"
                              :key="slot"
                              type="button"
                              class="btn btn-sm slot-pill"
                              :class="contractor.id === form.selectedContractorId && form.selectedSlot === slot ? 'btn-dark' : 'btn-outline-dark'"
                              @click="chooseContractor(contractor.id); form.selectedSlot = slot"
                            >
                              {{ slot }}
                            </button>
                          </div>
                        </div>

                        <div class="mt-auto d-flex flex-wrap justify-content-between align-items-center gap-3">
                          <p class="small mb-0 text-secondary">{{ contractor.services.length }} matching services</p>
                          <button type="button" class="btn btn-sm btn-outline-primary" @click="chooseContractor(contractor.id)">Choose contractor</button>
                        </div>
                      </div>
                    </article>
                  </div>

                  <div v-if="nearbyContractors.length === 0" class="col-12">
                    <div class="alert alert-warning mb-0 border-0">
                      No exact contractor match yet for this location. Try entering a nearby neighborhood or another service.
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-12 col-lg-6">
                <label class="form-label" for="selectedSlot">Selected time slot</label>
                <select id="selectedSlot" v-model="form.selectedSlot" class="form-select" :disabled="!selectedSlotOptions.length">
                  <option v-for="slot in selectedSlotOptions" :key="slot" :value="slot">{{ slot }}</option>
                </select>
              </div>

              <div class="col-12 col-lg-6">
                <label class="form-label" for="priority">Priority</label>
                <select id="priority" v-model="form.priority" class="form-select">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div class="col-12">
                <label class="form-label" for="description">Project description</label>
                <textarea id="description" v-model="form.description" class="form-control" rows="4" placeholder="Describe the roof issue, damage, or estimate needs." required></textarea>
              </div>

              <div class="col-12 col-lg-6">
                <label class="form-label" for="photos">Upload photos</label>
                <input id="photos" class="form-control" type="file" multiple accept="image/*" @change="onPhotoUpload" />
                <p class="small text-secondary mt-2 mb-0">{{ uploadedPhotos.length ? uploadedPhotos.join(', ') : 'No photos selected yet.' }}</p>
              </div>

              <div class="col-12 col-lg-6">
                <label class="form-label" for="notes">Preferred contact notes</label>
                <textarea id="notes" v-model="form.notes" class="form-control" rows="3" placeholder="Gate code, pet notes, inspection access, or schedule flexibility."></textarea>
              </div>

              <div class="col-12">
                <div class="request-summary card border-0">
                  <div class="card-body d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <div>
                      <p class="small text-uppercase fw-semibold text-secondary mb-1">Request summary</p>
                      <p class="mb-0 fw-semibold">
                        {{ selectedContractor ? selectedContractor.name : 'No contractor selected yet' }}
                        <span class="text-secondary fw-normal">· {{ locationLabel }}</span>
                      </p>
                    </div>
                    <div class="d-flex flex-wrap gap-2">
                      <span class="badge text-bg-light border">{{ serviceNeedsInspection ? 'Inspection likely required' : 'Simple job, auto-accept possible' }}</span>
                      <span class="badge text-bg-light border">Payment held in escrow</span>
                      <span class="badge text-bg-light border">48-72 hour dispute window</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-12 d-flex flex-wrap gap-2">
                <button class="btn btn-primary px-4" type="submit" :disabled="!selectedContractor">Submit request</button>
                <span class="small text-secondary align-self-center">The contractor will review the request, schedule inspection if required, and release payment after closeout.</span>
              </div>
            </form>
          </div>
        </article>
      </div>
    </section>

    <section v-if="submittedJob" class="row g-4">
      <div class="col-12 col-lg-6">
        <article class="card border-0 shadow-sm h-100">
          <div class="card-body p-4">
            <h2 class="h5 mb-3">Submitted request</h2>
            <dl class="row mb-0 small">
              <dt class="col-5 text-secondary">Tracking ID</dt>
              <dd class="col-7 fw-semibold">{{ submittedJob.id }}</dd>

              <dt class="col-5 text-secondary">Contractor</dt>
              <dd class="col-7">{{ submittedJob.contractorName }}</dd>

              <dt class="col-5 text-secondary">Service</dt>
              <dd class="col-7">{{ submittedJob.serviceType }}</dd>

              <dt class="col-5 text-secondary">Scheduled slot</dt>
              <dd class="col-7">{{ submittedJob.selectedSlot || 'Pending assignment' }}</dd>

              <dt class="col-5 text-secondary">Inspection</dt>
              <dd class="col-7">{{ submittedJob.inspectionRequired ? 'Required before final estimate' : 'Optional for a simple job' }}</dd>

              <dt class="col-5 text-secondary">Photos attached</dt>
              <dd class="col-7">{{ submittedJob.uploadedPhotos.length }}</dd>
            </dl>
          </div>
        </article>
      </div>

      <div class="col-12 col-lg-6">
        <article class="card border-0 shadow-sm h-100">
          <div class="card-body p-4">
            <h2 class="h5 mb-3">What happens next</h2>
            <ul class="timeline-list mb-0">
              <li>Contractor reviews the request and can auto-accept a simple repair.</li>
              <li>If inspection is required, the contractor schedules a visit and sends the final estimate.</li>
              <li>Client approves the estimate, payment stays held by the platform, and the job is confirmed.</li>
              <li>After completion, the dispute window opens for 48-72 hours before payment is released.</li>
            </ul>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.booking-page {
  position: relative;
}

.booking-hero,
.request-summary {
  background: linear-gradient(155deg, #fff3df, #ffffff 68%);
}

.hero-kicker {
  letter-spacing: 0.08em;
}

.workflow-stack {
  display: grid;
  gap: 0.9rem;
}

.workflow-step {
  display: flex;
  gap: 0.9rem;
  align-items: flex-start;
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(28, 37, 48, 0.08);
}

.workflow-number {
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #1c2530;
  color: #fff;
  flex: 0 0 auto;
  font-weight: 700;
}

.request-badge {
  letter-spacing: 0.04em;
}

.contractor-card {
  border: 1px solid rgba(28, 37, 48, 0.1);
  border-radius: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.contractor-card.selected {
  border-color: rgba(28, 37, 48, 0.42);
  box-shadow: 0 0.75rem 2rem rgba(28, 37, 48, 0.08);
  transform: translateY(-1px);
}

.service-tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.service-tag {
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  background: #eef2f7;
  font-size: 0.82rem;
}

.photo-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
}

.photo-tile {
  min-height: 4.5rem;
  padding: 0.65rem;
  border-radius: 0.75rem;
  background:
    linear-gradient(145deg, rgba(12, 24, 38, 0.85), rgba(12, 24, 38, 0.62)),
    linear-gradient(145deg, #c8d8e8, #f5f7fb);
  color: #fff;
  display: flex;
  align-items: flex-end;
  font-size: 0.72rem;
}

.slot-pill {
  border-radius: 999px;
}

.timeline-list {
  padding-left: 1.15rem;
  display: grid;
  gap: 0.75rem;
}

@media (max-width: 576px) {
  .photo-strip {
    grid-template-columns: 1fr;
  }
}
</style>