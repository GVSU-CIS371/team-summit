<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  CONTRACTORS,
  SERVICE_OPTIONS,
  getContractorsDirectory,
} from '../data/jobs'
import SubmitRequestForm from '../components/SubmitRequestForm.vue'

const directory = ref([...CONTRACTORS])
const selectedService = ref('Roof Repair')
const minRating = ref(0)
const maxPrice = ref(0)
const sortBy = ref('rating')
const search = ref('')

const selectedContractor = ref(null)
const showRequestModal = ref(false)
const submittedJob = ref(null)

function priceForService(c, service) {
  return c?.pricing?.[service] || null
}
function priceLabel(c, service) {
  const p = priceForService(c, service)
  if (!p) return 'Quote on request'
  if (!p.min && !p.max) return 'Free estimate'
  if (p.min === p.max) return `$${p.min}`
  return `$${p.min}–$${p.max}`
}
function priceMidpoint(c, service) {
  const p = priceForService(c, service)
  if (!p) return Number.POSITIVE_INFINITY
  return (Number(p.min || 0) + Number(p.max || 0)) / 2 || Number.POSITIVE_INFINITY
}

const filteredContractors = computed(() => {
  const q = search.value.trim().toLowerCase()
  return directory.value
    .filter((c) => c.services?.includes(selectedService.value))
    .filter((c) => Number(c.rating || 0) >= minRating.value)
    .filter((c) => {
      if (!maxPrice.value) return true
      const p = priceForService(c, selectedService.value)
      if (!p) return true
      return (p.min || 0) <= maxPrice.value
    })
    .filter((c) => {
      if (!q) return true
      const blob = `${c.name} ${(c.serviceAreas || []).join(' ')} ${c.address || ''}`.toLowerCase()
      return blob.includes(q)
    })
    .map((c) => ({ ...c, _priceMid: priceMidpoint(c, selectedService.value) }))
    .sort((a, b) => {
      if (sortBy.value === 'rating') return (b.rating || 0) - (a.rating || 0)
      if (sortBy.value === 'reviews') return (b.reviews || 0) - (a.reviews || 0)
      if (sortBy.value === 'priceLow') return a._priceMid - b._priceMid
      if (sortBy.value === 'priceHigh') return b._priceMid - a._priceMid
      return 0
    })
})

const sortLabel = computed(() => ({
  rating: 'highest rated',
  reviews: 'most reviewed',
  priceLow: 'lowest price',
  priceHigh: 'highest price',
}[sortBy.value]))

function openRequestModal(c) {
  selectedContractor.value = c
  showRequestModal.value = true
}
function onSubmitted(payload) {
  showRequestModal.value = false
  submittedJob.value = payload
}
function resetFilters() {
  selectedService.value = 'Roof Repair'
  minRating.value = 0
  maxPrice.value = 0
  sortBy.value = 'rating'
  search.value = ''
}

onMounted(async () => {
  try {
    const dyn = await getContractorsDirectory()
    if (Array.isArray(dyn) && dyn.length) directory.value = dyn
  } catch {
    /* fallback to seed data */
  }
})

const ratingOptions = [0, 3, 3.5, 4, 4.5]
const priceOptions = [0, 250, 500, 1000, 2500, 5000]
</script>

<template>
  <main class="dashboard-shell">
    <aside class="dashboard-sidebar">
      <div class="sidebar-header">
        <h1 class="h5 mb-1">Find a roofer</h1>
        <p class="small text-secondary mb-0">Filter contractors and submit a request.</p>
      </div>

      <section class="filter-section">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <p class="filter-title mb-0">Filters</p>
          <button type="button" class="btn btn-link btn-sm p-0 text-decoration-none" @click="resetFilters">Reset</button>
        </div>

        <label class="form-label small fw-semibold mb-1" for="f-search">Search</label>
        <input id="f-search" v-model="search" type="search" class="form-control form-control-sm mb-3" placeholder="Name or area" />

        <label class="form-label small fw-semibold mb-1" for="f-service">Service</label>
        <select id="f-service" v-model="selectedService" class="form-select form-select-sm mb-3">
          <option v-for="s in SERVICE_OPTIONS" :key="s" :value="s">{{ s }}</option>
        </select>

        <label class="form-label small fw-semibold mb-1" for="f-rating">Minimum rating</label>
        <select id="f-rating" v-model.number="minRating" class="form-select form-select-sm mb-3">
          <option v-for="r in ratingOptions" :key="r" :value="r">{{ r === 0 ? 'Any rating' : `${r}+ stars` }}</option>
        </select>

        <label class="form-label small fw-semibold mb-1" for="f-price">Max starting price</label>
        <select id="f-price" v-model.number="maxPrice" class="form-select form-select-sm mb-3">
          <option v-for="p in priceOptions" :key="p" :value="p">{{ p === 0 ? 'No limit' : `Up to $${p.toLocaleString()}` }}</option>
        </select>

        <label class="form-label small fw-semibold mb-1" for="f-sort">Sort by</label>
        <select id="f-sort" v-model="sortBy" class="form-select form-select-sm">
          <option value="rating">Highest rated</option>
          <option value="reviews">Most reviewed</option>
          <option value="priceLow">Price: low to high</option>
          <option value="priceHigh">Price: high to low</option>
        </select>

        <p class="small text-secondary mt-3 mb-0">
          {{ filteredContractors.length }} contractor{{ filteredContractors.length === 1 ? '' : 's' }} match.
        </p>
      </section>

      <section v-if="submittedJob" class="alert alert-success small mb-0">
        <strong>Request sent.</strong> Tracking #{{ submittedJob.id }} with {{ submittedJob.contractor.name }}.
      </section>
    </aside>

    <section class="dashboard-content">
      <header class="content-header">
        <div>
          <h2 class="h4 mb-1">Contractors offering {{ selectedService }}</h2>
          <p class="small text-secondary mb-0">Sorted by {{ sortLabel }}.</p>
        </div>
      </header>

      <div v-if="!filteredContractors.length" class="empty-card">
        <p class="mb-2 fw-semibold">No contractors match your filters.</p>
        <button type="button" class="btn btn-sm btn-dark" @click="resetFilters">Reset filters</button>
      </div>

      <div v-else class="contractor-grid">
        <article v-for="c in filteredContractors" :key="c.id" class="contractor-card">
          <header class="card-head">
            <div>
              <h3 class="h6 mb-1">{{ c.name }}</h3>
              <p class="small text-secondary mb-0">{{ c.address || c.serviceAreas?.join(' · ') }}</p>
            </div>
            <span class="badge text-bg-dark rounded-pill">{{ c.rating }}★</span>
          </header>

          <div class="card-body-stats">
            <div>
              <p class="stat-label">Estimated price</p>
              <p class="stat-value">{{ priceLabel(c, selectedService) }}</p>
            </div>
            <div>
              <p class="stat-label">Reviews</p>
              <p class="stat-value">{{ c.reviews }}</p>
            </div>
            <div>
              <p class="stat-label">Next available</p>
              <p class="stat-value">{{ c.availability?.[0] || '—' }}</p>
            </div>
          </div>

          <div class="service-tags">
            <span v-for="s in c.services" :key="s" class="service-tag" :class="{ active: s === selectedService }">{{ s }}</span>
          </div>

          <footer class="card-foot">
            <p v-if="c.googleReviews?.length" class="review-quote">"{{ c.googleReviews[0].text }}"</p>
            <button type="button" class="btn btn-sm btn-dark" @click="openRequestModal(c)">Submit request</button>
          </footer>
        </article>
      </div>
    </section>

    <div v-if="showRequestModal" class="modal-backdrop-custom" @click.self="showRequestModal = false">
      <div class="modal-card">
        <header class="modal-card-header">
          <div>
            <p class="small text-secondary mb-1">Request a service</p>
            <h2 class="h5 mb-0">{{ selectedContractor?.name }}</h2>
          </div>
          <button type="button" class="btn-close" aria-label="Close" @click="showRequestModal = false"></button>
        </header>
        <div class="modal-card-body">
          <SubmitRequestForm
            v-if="selectedContractor"
            :contractor="selectedContractor"
            :initial-service="selectedService"
            @submitted="onSubmitted"
            @cancel="showRequestModal = false"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.dashboard-shell {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  align-items: start;
}

.dashboard-sidebar {
  position: sticky;
  top: 80px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar-header {
  background: #fff;
  border: 1px solid #eef0f3;
  border-radius: 14px;
  padding: 1rem 1.1rem;
}

.filter-section {
  background: #fff;
  border: 1px solid #eef0f3;
  border-radius: 14px;
  padding: 1rem 1.1rem;
  box-shadow: 0 1px 2px rgba(15, 18, 22, 0.03);
}

.filter-title {
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;
  color: #6c757d;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  padding: 0 0.25rem;
}

.contractor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
}

.contractor-card {
  background: #fff;
  border: 1px solid #eef0f3;
  border-radius: 14px;
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  box-shadow: 0 1px 3px rgba(15, 18, 22, 0.04);
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}
.contractor-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(15, 18, 22, 0.08);
  border-color: #d8dde3;
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
}

.card-body-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  padding: 0.65rem 0;
  border-top: 1px solid #f1f3f5;
  border-bottom: 1px solid #f1f3f5;
}

.stat-label {
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #6c757d;
  margin: 0 0 0.15rem;
  font-weight: 600;
}
.stat-value {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
  color: #212529;
}

.service-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}
.service-tag {
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: #f1f3f5;
  color: #495057;
  border: 1px solid transparent;
}
.service-tag.active {
  background: #212529;
  color: #fff;
}

.card-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
}
.review-quote {
  flex: 1;
  font-size: 0.78rem;
  color: #6c757d;
  font-style: italic;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.empty-card {
  background: #fff;
  border: 1px dashed #d8dde3;
  border-radius: 14px;
  padding: 3rem 1.5rem;
  text-align: center;
}

.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(15, 18, 22, 0.55);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.modal-card {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(15, 18, 22, 0.25);
  overflow: hidden;
}
.modal-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #eef0f3;
}
.modal-card-body {
  padding: 1rem 1.25rem 1.25rem;
  overflow-y: auto;
}

@media (max-width: 900px) {
  .dashboard-shell {
    grid-template-columns: 1fr;
  }
  .dashboard-sidebar {
    position: static;
  }
}
</style>
