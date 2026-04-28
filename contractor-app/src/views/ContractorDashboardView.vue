<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { JOB_STATUSES, getJobsForContractor, updateJobStatus, getArchivedJobsForContractor } from '../data/jobs'
import { useAuth } from '../auth/mockAuth'

const auth = useAuth()
const jobs = ref([])
const archived = ref([])
const viewMode = ref('board')
const isLoading = ref(true)
const loadError = ref('')


async function fetchJobsForCurrentContractor() {
  isLoading.value = true
  loadError.value = ''

  try {
    const contractorId = auth.currentUser?.uid
    if (!contractorId) {
      jobs.value = []
      archived.value = []
      return
    }

    jobs.value = await getJobsForContractor(contractorId)
    // load archived/completed separately (best-effort — avoid failing main view if index missing)
    try {
      archived.value = await getArchivedJobsForContractor(contractorId)
    } catch (err) {
      archived.value = []
      // surface friendly message so developer can create the required Firestore index
      loadError.value = err?.message || 'Failed to load archived jobs.'
    }
  } catch (error) {
    loadError.value = error?.message || 'Failed to load jobs.'
  } finally {
    isLoading.value = false
  }
}

const filteredJobs = computed(() => jobs.value)

const statusCounts = computed(() => {
  return JOB_STATUSES.map((status) => ({
    status,
    count: jobs.value.filter((job) => job.status === status).length,
  }))
})

function formatDate(value) {
  if (!value) return '—'
  const d = value?.toDate ? value.toDate() : new Date(value)
  if (Number.isNaN(d.getTime())) return '—'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
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

function onDragStart(e, jobId) {
  e.dataTransfer?.setData('text/plain', jobId)
}

function onDragOver(e) {
  e.preventDefault()
}

async function onDrop(e, targetColumn) {
  e.preventDefault()
  const jobId = e.dataTransfer?.getData('text/plain')
  if (!jobId) return

  // map target column to a job status
  let newStatus = targetColumn
  if (targetColumn === 'Estimated/Approved') newStatus = 'Estimated'
  if (targetColumn === 'Completed') newStatus = 'Completed'

  await updateJobStatus(jobId, newStatus)
  await fetchJobsForCurrentContractor()
}
watch(
  () => auth.ready,
  (val) => {
    if (val) fetchJobsForCurrentContractor()
  },
  { immediate: true }
)
</script>

<template>
  <main class="container py-4">
    <header class="mb-4">
      <h1 class="h3 mb-1">Contractor Dashboard</h1>
      <p class="text-secondary mb-0">Manage jobs by workflow status and open each request to continue the estimate process.</p>
    </header>

    <section class="row g-3 mb-4">
      <div v-for="item in statusCounts" :key="item.status" class="col-6 col-lg-2">
        <article class="card h-100 shadow-sm border-0 status-card">
          <div class="card-body">
            <p class="small text-uppercase fw-semibold text-secondary mb-1">{{ item.status }}</p>
            <p class="display-6 mb-0">{{ item.count }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="card shadow-sm border-0">
      <div class="card-body">
        <div v-if="loadError" class="alert alert-danger" role="alert">
          {{ loadError }}
        </div>

        <div v-if="isLoading" class="text-secondary py-2">Loading jobs...</div>

        <div class="d-flex align-items-center justify-content-between mb-3">
          <div>
            <button class="btn btn-sm" :class="{ 'btn-primary': viewMode === 'board' }" @click="viewMode = 'board'">Board</button>
            <button class="btn btn-sm ms-2" :class="{ 'btn-primary': viewMode === 'completed' }" @click="viewMode = 'completed'">Completed</button>
          </div>
        </div>

        <div v-if="viewMode === 'board'" class="kanban-board">
          <div class="kanban-column" @dragover.prevent="onDragOver" @drop="(e) => onDrop(e, 'Requested')">
            <h3 class="column-title">Requested</h3>
            <div v-for="job in filteredJobs.filter(j => j.status === 'Requested')" :key="job.id" class="kanban-card" draggable="true" @dragstart="(e) => onDragStart(e, job.id)">
              <div>
                <p class="mb-0 fw-semibold">{{ job.serviceType }} <small class="text-muted">#{{ job.id?.slice(0,8) }}</small></p>
                <p class="small text-secondary mb-0">{{ job.customerName }} · {{ formatDate(job.createdAt) }}</p>
              </div>
              <div class="card-actions">
                <RouterLink :to="`/contractor/jobs/${job.id}`" class="open-job-link">Open</RouterLink>
              </div>
            </div>
          </div>

          <div class="kanban-column" @dragover.prevent="onDragOver" @drop="(e) => onDrop(e, 'Estimated')">
            <h3 class="column-title">Estimated</h3>
            <div v-for="job in filteredJobs.filter(j => j.status === 'Estimated')" :key="job.id" class="kanban-card" draggable="true" @dragstart="(e) => onDragStart(e, job.id)">
              <div>
                <p class="mb-0 fw-semibold">{{ job.serviceType }} <small class="text-muted">#{{ job.id?.slice(0,8) }}</small></p>
                <p class="small text-secondary mb-0">{{ job.customerName }} · {{ formatDate(job.createdAt) }}</p>
              </div>
              <div class="card-actions">
                <RouterLink :to="`/contractor/jobs/${job.id}`" class="open-job-link">Open</RouterLink>
              </div>
            </div>
          </div>

          <div class="kanban-column" @dragover.prevent="onDragOver" @drop="(e) => onDrop(e, 'Approved')">
            <h3 class="column-title">Approved</h3>
            <div v-for="job in filteredJobs.filter(j => j.status === 'Approved')" :key="job.id" class="kanban-card" draggable="true" @dragstart="(e) => onDragStart(e, job.id)">
              <div>
                <p class="mb-0 fw-semibold">{{ job.serviceType }} <small class="text-muted">#{{ job.id?.slice(0,8) }}</small></p>
                <p class="small text-secondary mb-0">{{ job.customerName }} · {{ formatDate(job.createdAt) }}</p>
              </div>
              <div class="card-actions">
                <RouterLink :to="`/contractor/jobs/${job.id}`" class="open-job-link">Open</RouterLink>
              </div>
            </div>
          </div>

          <div class="kanban-column" @dragover.prevent="onDragOver" @drop="(e) => onDrop(e, 'In-Progress')">
            <h3 class="column-title">In-Progress</h3>
            <div v-for="job in filteredJobs.filter(j => j.status === 'In-Progress')" :key="job.id" class="kanban-card" draggable="true" @dragstart="(e) => onDragStart(e, job.id)">
              <div>
                <p class="mb-0 fw-semibold">{{ job.serviceType }} <small class="text-muted">#{{ job.id?.slice(0,8) }}</small></p>
                <p class="small text-secondary mb-0">{{ job.customerName }} · {{ formatDate(job.createdAt) }}</p>
              </div>
              <div class="card-actions">
                <RouterLink :to="`/contractor/jobs/${job.id}`" class="open-job-link">Open</RouterLink>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="archived-list">
          <h4 class="mb-3">Completed jobs</h4>
          <div v-if="!archived.length" class="text-secondary">No completed jobs available.</div>
          <div class="row g-3">
            <div v-for="job in archived" :key="job.id" class="col-12 col-md-6">
              <article class="card p-3">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <p class="small text-secondary mb-1">#{{ job.id?.slice(0,8) }} · Completed {{ formatDate(job.completedAt || job.archivedAt) }}</p>
                    <h5 class="mb-0">{{ job.serviceType }}</h5>
                    <p class="small text-secondary mb-0">{{ job.customerName }} · {{ job.address || job.propertyType }}</p>
                  </div>
                  <div>
                    <RouterLink :to="`/contractor/jobs/${job.id}`" class="open-job-link">Open</RouterLink>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.status-card {
  background: linear-gradient(145deg, #fffaf3, #ffffff);
}

.kanban-board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
.kanban-column {
  background: #fff;
  border: 1px solid #eef0f3;
  border-radius: 12px;
  padding: 0.75rem;
  min-height: 160px;
}
.column-title {
  font-size: 0.85rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}
.kanban-card {
  background: #fafbfd;
  border-radius: 8px;
  padding: 0.6rem;
  margin-bottom: 0.5rem;
  border: 1px solid #eef2f6;
  cursor: grab;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
}
.kanban-card:hover {
  border-color: #d6dde6;
  box-shadow: 0 4px 14px rgba(15, 18, 22, 0.06);
}
.kanban-card:active {
  cursor: grabbing;
}
.kanban-card.archived { opacity: 0.8; background: #f8f9fb }
.card-actions { margin-top: 0.5rem; display:flex; justify-content:flex-end }

.open-job-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  border: 1px solid #d6dde6;
  background: #fff;
  color: #2b2f33;
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
  line-height: 1;
  transition: background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, color 0.18s ease, transform 0.18s ease;
}

.open-job-link:hover {
  background: #f8fafc;
  border-color: #c7d0da;
  color: #111827;
  box-shadow: 0 2px 8px rgba(15, 18, 22, 0.08);
  transform: translateY(-1px);
}

.open-job-link:active {
  transform: translateY(0);
  box-shadow: none;
}

@media (max-width: 900px) {
  .kanban-board { grid-template-columns: 1fr }
}
</style>
