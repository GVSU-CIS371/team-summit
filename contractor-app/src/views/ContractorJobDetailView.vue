<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, RouterLink, useRouter } from 'vue-router'
import { useAuth } from '../auth/mockAuth'
import { getJobById, updateJobStatus, unarchiveJobToStatus, JOB_STATUSES } from '../data/jobs'

const route = useRoute()
const router = useRouter()
const job = ref(null)
const isLoading = ref(true)
const loadError = ref('')
const showMoveBackModal = ref(false)
const isProcessing = ref(false)

const auth = useAuth()

async function loadJob() {
  isLoading.value = true
  loadError.value = ''

  try {
    const fetched = await getJobById(route.params.id)

    // authorization: only selected contractor may view
    const contractorId = fetched?.contractorId || ''
    const currentContractorId = auth.currentUser?.uid || ''

    if (contractorId && contractorId !== currentContractorId) {
      job.value = null
      loadError.value = 'You are not authorized to view this job.'
      return
    }

    job.value = fetched
  } catch (error) {
    job.value = null
    loadError.value = error?.message || 'Failed to load job details.'
  } finally {
    isLoading.value = false
  }
}

const lifecycleRows = computed(() => {
  if (!job.value) {
    return []
  }

  const lifecycle = job.value.lifecycle || {}

  return [
    { label: 'Requested', date: lifecycle.requestedAt },
    { label: 'Matched', date: lifecycle.matchedAt },
    { label: 'Inspection Scheduled', date: lifecycle.inspectionScheduledAt },
    { label: 'Estimate Issued', date: lifecycle.estimateIssuedAt },
    { label: 'Approved', date: lifecycle.approvedAt },
    { label: 'In-Progress', date: lifecycle.workStartedAt },
    { label: 'Completed', date: lifecycle.completedAt },
    { label: 'Dispute Window', date: lifecycle.disputeOpenedAt },
    { label: 'Released', date: lifecycle.releasedAt },
  ]
})

const workflowRows = computed(() => {
  if (!job.value) {
    return []
  }

  const lifecycle = job.value.lifecycle || {}

  return [
    { label: 'Requested', field: 'requestedAt' },
    { label: 'Matched', field: 'matchedAt' },
    { label: 'Inspection Scheduled', field: 'inspectionScheduledAt' },
    { label: 'Estimate Issued', field: 'estimateIssuedAt' },
    { label: 'Approved', field: 'approvedAt' },
    { label: 'In-Progress', field: 'workStartedAt' },
    { label: 'Completed', field: 'completedAt' },
    { label: 'Dispute Window', field: 'disputeOpenedAt' },
    { label: 'Released', field: 'releasedAt' },
  ].map((row) => ({
    label: row.label,
    state: lifecycle[row.field] ? 'Recorded' : 'Waiting',
  }))
})

const summaryCards = computed(() => {
  if (!job.value) {
    return []
  }

  return [
    {
      label: 'Contractor',
      value: job.value.contractorName || 'Unassigned',
      note: job.value.contractorRating ? `${job.value.contractorRating.toFixed(1)} rating` : 'Waiting for matching',
    },
    {
      label: 'Schedule',
      value: job.value.selectedSlot || 'Pending',
      note: job.value.inspectionRequired ? 'Inspection may be required' : 'Simple job can be auto-accepted',
    },
    {
      label: 'Payment',
      value: job.value.paymentStatus || 'Held in escrow',
      note: `${job.value.disputeWindowHours || 72} hour dispute window`,
    },
    {
      label: 'Photos',
      value: `${job.value.uploadedPhotos?.length || 0} uploaded`,
      note: 'Images stay attached to the request',
    },
  ]
})

function formatDateTime(dateString) {
  if (!dateString) {
    return 'Not reached yet'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateString))
}

function formatCurrency(value) {
  if (!value) {
    return 'Pending'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

async function markAsCompleted() {
  if (!job.value || isProcessing.value) return
  
  isProcessing.value = true
  try {
    await updateJobStatus(job.value.id, 'Completed')
    // Reload the job to reflect the new status
    await loadJob()
  } catch (error) {
    loadError.value = 'Failed to mark job as completed.'
    console.error(error)
  } finally {
    isProcessing.value = false
  }
}

async function moveBackToStatus(status) {
  if (!job.value || isProcessing.value) return
  
  isProcessing.value = true
  try {
    await unarchiveJobToStatus(job.value.id, status)
    showMoveBackModal.value = false
    // Reload the job to reflect the new status
    await loadJob()
  } catch (error) {
    loadError.value = `Failed to move job back to ${status}.`
    console.error(error)
  } finally {
    isProcessing.value = false
  }
}

const activeStatuses = computed(() => {
  return JOB_STATUSES.filter(s => s !== 'Completed')
})

onMounted(loadJob)
watch(() => route.params.id, loadJob)
</script>

<template>
  <main class="container py-5" v-if="isLoading">
    <div class="text-secondary">Loading job details...</div>
  </main>

  <main class="container py-5" v-else-if="loadError">
    <div class="alert alert-danger" role="alert">{{ loadError }}</div>
    <RouterLink to="/contractor" class="back-dashboard-link">Return to dashboard</RouterLink>
  </main>

  <main class="container py-4" v-if="job">
    <header class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
      <div>
        <p class="text-secondary text-uppercase small mb-1">{{ job.id }}</p>
        <h1 class="h3 mb-1">{{ job.serviceType }}</h1>
        <p class="mb-0 text-secondary">
          {{ job.customerName }} · {{ job.propertyType }} · {{ job.address || 'No address on file' }}
        </p>
      </div>
      <div class="d-flex flex-wrap gap-2">
        <button 
          v-if="!job.isArchived && job.status !== 'Completed'" 
          class="btn btn-primary btn-sm" 
          @click="markAsCompleted"
          :disabled="isProcessing"
        >
          {{ isProcessing ? 'Processing...' : 'Mark as Completed' }}
        </button>
        <button 
          v-if="job.isArchived || job.status === 'Completed'" 
          class="btn btn-primary btn-sm" 
          @click="showMoveBackModal = true"
          :disabled="isProcessing"
        >
          Move Back to Active
        </button>
        <RouterLink to="/contractor" class="back-dashboard-link">Back to dashboard</RouterLink>
      </div>
    </header>

    <section class="row g-4 mb-4">
      <div v-for="card in summaryCards" :key="card.label" class="col-12 col-md-6 col-xl-3">
        <article class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <p class="small text-uppercase fw-semibold text-secondary mb-1">{{ card.label }}</p>
            <p class="h5 mb-1">{{ card.value }}</p>
            <p class="small text-secondary mb-0">{{ card.note }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="row g-4">
      <div class="col-12 col-lg-7">
        <article class="card shadow-sm border-0 h-100">
          <div class="card-body">
            <div class="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
              <div>
                <h2 class="h5 mb-1">Request Details</h2>
                <p class="text-secondary mb-0">Client description, selected contractor, and requested timing.</p>
              </div>
              <div class="d-flex flex-wrap gap-2">
                <span class="badge text-bg-light border">Status: {{ job.status }}</span>
                <span class="badge text-bg-light border">Priority: {{ job.priority }}</span>
                <span class="badge text-bg-light border">Estimate: {{ formatCurrency(job.estimateTotal) }}</span>
              </div>
            </div>

            <div class="row g-3 mb-3 small">
              <div class="col-12 col-md-6">
                <div class="detail-block">
                  <p class="text-uppercase text-secondary fw-semibold mb-1">Selected contractor</p>
                  <p class="mb-0 fw-semibold">{{ job.contractorName || 'Unassigned' }}</p>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="detail-block">
                  <p class="text-uppercase text-secondary fw-semibold mb-1">Preferred slot</p>
                  <p class="mb-0 fw-semibold">{{ job.selectedSlot || 'Pending scheduling' }}</p>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="detail-block">
                  <p class="text-uppercase text-secondary fw-semibold mb-1">Inspection requirement</p>
                  <p class="mb-0 fw-semibold">{{ job.inspectionRequired ? 'Inspection required before final estimate' : 'Simple job can be auto-accepted' }}</p>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="detail-block">
                  <p class="text-uppercase text-secondary fw-semibold mb-1">Payment state</p>
                  <p class="mb-0 fw-semibold">{{ job.paymentStatus || 'Held in escrow' }}</p>
                </div>
              </div>
            </div>

            <p class="mb-0">{{ job.description }}</p>

            <div v-if="job.uploadedPhotos?.length" class="mt-3">
              <p class="small text-uppercase fw-semibold text-secondary mb-2">Attached photos</p>
              <div class="d-flex flex-wrap gap-2">
                <span v-for="photo in job.uploadedPhotos" :key="photo" class="badge text-bg-light border">{{ photo }}</span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div class="col-12 col-lg-5">
        <article class="card shadow-sm border-0 h-100">
          <div class="card-body">
            <h2 class="h5 mb-3">Lifecycle Timeline</h2>
            <div class="timeline-grid">
              <div v-for="row in lifecycleRows" :key="row.label" class="timeline-row">
                <div>
                  <p class="mb-1 fw-semibold">{{ row.label }}</p>
                  <p class="text-secondary small mb-0">{{ formatDateTime(row.date) }}</p>
                </div>
                <span class="badge text-bg-light border">{{ row.date ? 'Recorded' : 'Pending' }}</span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="row g-4 mt-0">
      <div class="col-12 col-lg-6">
        <article class="card shadow-sm border-0 h-100 mt-4">
          <div class="card-body">
            <h2 class="h5 mb-3">Workflow path</h2>
            <ul class="list-group list-group-flush">
              <li v-for="row in workflowRows" :key="row.label" class="list-group-item d-flex justify-content-between px-0">
                <span>{{ row.label }}</span>
                <span class="text-secondary">{{ row.state }}</span>
              </li>
            </ul>
          </div>
        </article>
      </div>

      <div class="col-12 col-lg-6">
        <article class="card shadow-sm border-0 h-100 mt-4">
          <div class="card-body">
            <h2 class="h5 mb-3">Post-completion handling</h2>
            <ul class="list-group list-group-flush">
              <li class="list-group-item px-0 d-flex justify-content-between gap-3">
                <span>Client confirms the job</span>
                <span class="text-secondary">Payment releases immediately</span>
              </li>
              <li class="list-group-item px-0 d-flex justify-content-between gap-3">
                <span>Client does nothing</span>
                <span class="text-secondary">Auto-release after 48-72 hours</span>
              </li>
              <li class="list-group-item px-0 d-flex justify-content-between gap-3">
                <span>Client files a dispute</span>
                <span class="text-secondary">Platform reviews contractor response</span>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </section>
  </main>

  <main class="container py-5" v-else>
    <div class="alert alert-warning" role="alert">Job not found.</div>
    <RouterLink to="/contractor" class="back-dashboard-link">Return to dashboard</RouterLink>
  </main>

  <!-- Move Back Modal -->
  <div v-if="showMoveBackModal" class="modal-overlay" @click.self="showMoveBackModal = false">
    <div class="modal-card">
      <div class="modal-header">
        <h5 class="modal-title">Move Job Back to Active</h5>
        <button type="button" class="btn-close" @click="showMoveBackModal = false"></button>
      </div>
      <div class="modal-body">
        <p class="mb-3">Select a section to move this completed job back to:</p>
        <div class="d-grid gap-2">
          <button 
            v-for="status in activeStatuses" 
            :key="status"
            class="btn btn-outline-primary btn-sm text-start"
            @click="moveBackToStatus(status)"
            :disabled="isProcessing"
          >
            {{ status }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-block {
  padding: 0.9rem 1rem;
  border-radius: 0.9rem;
  background: #f8fafc;
  border: 1px solid rgba(28, 37, 48, 0.08);
}

.timeline-grid {
  display: grid;
  gap: 0.75rem;
}

.timeline-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 0;
  border-bottom: 1px solid rgba(28, 37, 48, 0.08);
}

.timeline-row:last-child {
  border-bottom: 0;
}

.back-dashboard-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  border: 1px solid #d7dfe7;
  background: #fff;
  color: #2b2f33;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  line-height: 1;
  transition: background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, color 0.18s ease, transform 0.18s ease;
}

.back-dashboard-link:hover {
  background: #f8fafc;
  border-color: #c9d2db;
  color: #111827;
  box-shadow: 0 2px 10px rgba(15, 18, 22, 0.08);
  transform: translateY(-1px);
}

.back-dashboard-link:active {
  transform: translateY(0);
  box-shadow: none;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-card {
  background: var(--app-surface);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--app-border);
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--app-text);
}

.modal-body {
  padding: 1.5rem;
  color: var(--app-text);
}

.btn-outline-primary {
  padding: 0.6rem 1rem;
  text-align: left;
}

</style>