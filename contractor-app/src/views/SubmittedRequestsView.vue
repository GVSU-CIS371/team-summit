<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuth } from '../auth/mockAuth'
import { getJobs, getArchivedJobs } from '../data/jobs'

const auth = useAuth()
const allJobs = ref([])
const loading = ref(true)
const errorMsg = ref('')
const filterStatus = ref('All')

async function loadJobs() {
  loading.value = true
  errorMsg.value = ''
  try {
    const jobsActive = await getJobs()
    let jobsArchived = []

    try {
      jobsArchived = await getArchivedJobs()
    } catch (archivedError) {
      console.error('Failed to load archived jobs', archivedError)
    }

    allJobs.value = [...jobsActive, ...jobsArchived].sort((a, b) => {
      const aDate = a.createdAt?.toDate?.() || a.archivedAt?.toDate?.() || new Date(0)
      const bDate = b.createdAt?.toDate?.() || b.archivedAt?.toDate?.() || new Date(0)
      return bDate - aDate
    })
  } catch (err) {
    errorMsg.value = err?.message || 'Could not load your requests.'
  } finally {
    loading.value = false
  }
}

const myJobs = computed(() => {
  const customerId = auth.currentUser?.uid
  const email = auth.currentUser?.email?.toLowerCase()
  if (!customerId && !email) return allJobs.value

  return allJobs.value.filter((j) => {
    if (customerId && j.clientId === customerId) return true
    const jobEmail = (j.contactEmail || '').toLowerCase()
    return (!!email && jobEmail === email) || (!jobEmail && !email)
  })
})

const filteredJobs = computed(() => {
  if (filterStatus.value === 'All') return myJobs.value
  return myJobs.value.filter((j) => mapDisplayStatus(j) === filterStatus.value)
})

const statusCounts = computed(() => {
  const counts = { All: myJobs.value.length, Pending: 0, Estimated: 0, Approved: 0, 'In-Progress': 0, Completed: 0, Declined: 0 }
  myJobs.value.forEach((j) => {
    const s = mapDisplayStatus(j)
    if (counts[s] != null) counts[s] += 1
  })
  return counts
})

function mapDisplayStatus(job) {
  if (job.status === 'Declined' || job.status === 'Cancelled') return 'Declined'
  if (job.status === 'Requested') return 'Pending'
  return job.status || 'Pending'
}

function statusBadgeClass(status) {
  return {
    Pending: 'bg-warning-subtle text-warning-emphasis',
    Estimated: 'bg-info-subtle text-info-emphasis',
    Approved: 'bg-primary-subtle text-primary-emphasis',
    'In-Progress': 'bg-secondary-subtle text-secondary-emphasis',
    Completed: 'bg-success-subtle text-success-emphasis',
    Declined: 'bg-danger-subtle text-danger-emphasis',
  }[status] || 'bg-light text-secondary'
}

function formatDate(value) {
  if (!value) return '—'
  const d = value?.toDate ? value.toDate() : new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(d)
}

function formatCurrency(value) {
  if (value == null || value === '') return 'Pending'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(value))
}

const tabs = ['All', 'Pending', 'Estimated', 'Approved', 'In-Progress', 'Completed', 'Declined']

onMounted(loadJobs)
</script>

<template>
  <main class="submitted-shell">
    <header class="submitted-header">
      <div>
        <h1 class="h4 mb-1">Submitted requests</h1>
        <p class="small text-secondary mb-0">Track the status of every request you've sent to a contractor.</p>
      </div>
      <button type="button" class="btn btn-sm btn-outline-secondary" @click="loadJobs" :disabled="loading">
        {{ loading ? 'Refreshing…' : 'Refresh' }}
      </button>
    </header>

    <nav class="status-tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        type="button"
        class="status-tab"
        :class="{ active: filterStatus === tab }"
        @click="filterStatus = tab"
      >
        {{ tab }}
        <span class="status-tab-count">{{ statusCounts[tab] ?? 0 }}</span>
      </button>
    </nav>

    <section v-if="errorMsg" class="alert alert-danger small">{{ errorMsg }}</section>

    <section v-if="loading && !filteredJobs.length" class="empty-card">Loading…</section>

    <section v-else-if="!filteredJobs.length" class="empty-card">
      <p class="fw-semibold mb-1">No requests {{ filterStatus === 'All' ? 'yet' : `in “${filterStatus}”` }}.</p>
      <p class="small text-secondary mb-0">Submit one from the Find a Roofer page.</p>
    </section>

    <section v-else class="request-grid">
      <article v-for="job in filteredJobs" :key="job.id" class="request-card">
        <header class="request-card-head">
          <div>
            <p class="small text-secondary mb-1">#{{ job.id?.slice(0, 8) || '—' }} · Submitted {{ formatDate(job.createdAt) }}</p>
            <h2 class="h6 mb-0">{{ job.serviceType || 'Service request' }}</h2>
          </div>
          <span class="badge rounded-pill" :class="statusBadgeClass(mapDisplayStatus(job))">
            {{ mapDisplayStatus(job) }}
          </span>
        </header>

        <dl class="request-meta">
          <div>
            <dt>Contractor</dt>
            <dd>{{ job.contractorName || '—' }}</dd>
          </div>
          <div>
            <dt>Property</dt>
            <dd>{{ job.address || job.propertyType || '—' }}</dd>
          </div>
          <div>
            <dt>Slot</dt>
            <dd>{{ job.selectedSlot || '—' }}</dd>
          </div>
          <div>
            <dt>Estimate</dt>
            <dd class="fw-semibold">{{ formatCurrency(job.estimateTotal) }}</dd>
          </div>
        </dl>

        <p v-if="job.description" class="small text-secondary mb-0 description">{{ job.description }}</p>
      </article>
    </section>
  </main>
</template>

<style scoped>
.submitted-shell {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.submitted-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
}

.status-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.status-tab {
  background: #fff;
  border: 1px solid #eef0f3;
  border-radius: 999px;
  padding: 0.4rem 0.9rem;
  font-size: 0.82rem;
  font-weight: 500;
  color: #495057;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.15s ease;
}
.status-tab:hover { border-color: #c9ced4; }
.status-tab.active {
  background: #212529;
  color: #fff;
  border-color: #212529;
}
.status-tab-count {
  background: rgba(0,0,0,0.08);
  border-radius: 999px;
  padding: 0 0.45rem;
  font-size: 0.7rem;
  min-width: 1.4rem;
  text-align: center;
}
.status-tab.active .status-tab-count {
  background: rgba(255,255,255,0.18);
}

.empty-card {
  background: #fff;
  border: 1px dashed #d8dde3;
  border-radius: 14px;
  padding: 3rem 1.5rem;
  text-align: center;
}

.request-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
}

.request-card {
  background: #fff;
  border: 1px solid #eef0f3;
  border-radius: 14px;
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  box-shadow: 0 1px 3px rgba(15, 18, 22, 0.04);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.request-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(15, 18, 22, 0.08);
}

.request-card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
}

.request-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem 0.75rem;
  margin: 0;
  padding: 0.65rem 0;
  border-top: 1px solid #f1f3f5;
  border-bottom: 1px solid #f1f3f5;
}
.request-meta dt {
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #6c757d;
  font-weight: 600;
  margin: 0 0 0.1rem;
}
.request-meta dd {
  margin: 0;
  font-size: 0.85rem;
  color: #212529;
}

.description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
