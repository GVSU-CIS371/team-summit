<script setup>
import { computed, ref, reactive } from 'vue'
import { useAuth } from '../auth/mockAuth'
import { getJobs, JOB_STATUSES, updateJobStatus, deleteJob, createJobRequest, updateJob } from '../data/jobs'

const auth = useAuth()
const jobs = ref([])
const isLoading = ref(true)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const draggedJobId = ref(null)
const editingJobId = ref('')

const form = reactive({
  customerName: '',
  propertyType: 'Homeowner',
  serviceType: 'Roof Replacement',
  description: '',
  priority: 'Medium',
  contactEmail: '',
  contactPhone: '',
  address: '',
})

const editForm = reactive({
  customerName: '',
  propertyType: 'Homeowner',
  serviceType: 'Roof Replacement',
  description: '',
  priority: 'Medium',
  contactEmail: '',
  contactPhone: '',
  address: '',
  status: 'Requested',
  estimateTotal: '',
})

async function loadJobs() {
  isLoading.value = true
  try {
    jobs.value = await getJobs()
  } finally {
    isLoading.value = false
  }
}

onMounted(loadJobs)

const jobsByStatus = computed(() => {
  const grouped = {}
  JOB_STATUSES.forEach((status) => {
    grouped[status] = jobs.value.filter((job) => job.status === status)
  })
  return grouped
})

function onDragStart(e, jobId) {
  draggedJobId.value = jobId
  e.dataTransfer.effectAllowed = 'move'
}

function onDragOver(e) {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'move'
}

async function onDrop(e, status) {
  e.preventDefault()
  if (draggedJobId.value) {
    await updateJobStatus(draggedJobId.value, status)
    await loadJobs()
    draggedJobId.value = null
  }
}

async function handleDeleteJob(jobId) {
  if (confirm('Are you sure you want to delete this job?')) {
    await deleteJob(jobId)
    await loadJobs()
  }
}

function openEditModal(job) {
  editingJobId.value = job.id
  editForm.customerName = job.customerName || ''
  editForm.propertyType = job.propertyType || 'Homeowner'
  editForm.serviceType = job.serviceType || ''
  editForm.description = job.description || ''
  editForm.priority = job.priority || 'Medium'
  editForm.contactEmail = job.contactEmail || ''
  editForm.contactPhone = job.contactPhone || ''
  editForm.address = job.address || ''
  editForm.status = job.status || 'Requested'
  editForm.estimateTotal = job.estimateTotal == null ? '' : String(job.estimateTotal)
  showEditModal.value = true
}

async function handleUpdateJob() {
  const parsedEstimate = editForm.estimateTotal === '' ? null : Number(editForm.estimateTotal)

  await updateJob(editingJobId.value, {
    customerName: editForm.customerName,
    propertyType: editForm.propertyType,
    serviceType: editForm.serviceType,
    description: editForm.description,
    priority: editForm.priority,
    contactEmail: editForm.contactEmail,
    contactPhone: editForm.contactPhone,
    address: editForm.address,
    estimateTotal: parsedEstimate,
  })

  if (editForm.status) {
    await updateJobStatus(editingJobId.value, editForm.status)
  }

  showEditModal.value = false
  await loadJobs()
}


async function handleCreateJob() {
  await createJobRequest({
    customerName: form.customerName,
    propertyType: form.propertyType,
    serviceType: form.serviceType,
    description: form.description,
    priority: form.priority,
    contactEmail: form.contactEmail,
    contactPhone: form.contactPhone,
    address: form.address,
  })

  resetForm()
  showCreateModal.value = false
  await loadJobs()
}

function resetForm() {
  form.customerName = ''
  form.propertyType = 'Homeowner'
  form.serviceType = 'Roof Replacement'
  form.description = ''
  form.priority = 'Medium'
  form.contactEmail = ''
  form.contactPhone = ''
  form.address = ''
}

function formatDate(dateValue) {
  if (!dateValue) return '—'
  const date = dateValue?.toDate ? dateValue.toDate() : new Date(dateValue)
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
}

function formatCurrency(value) {
  if (!value) return 'Pending'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}
</script>

<template>
  <main class="container-fluid py-4">
    <header class="mb-4 d-flex justify-content-between align-items-start gap-3">
      <div>
        <h1 class="h3 mb-1">Welcome, {{ auth.currentUser?.name }}</h1>
        <p class="text-secondary mb-0">Manage all job requests, estimates, and progress.</p>
      </div>
      <button class="btn btn-primary" @click="showCreateModal = true">+ Create New Job</button>
    </header>

    <p v-if="isLoading">Loading jobs...</p>

    <section v-else class="kanban-wrapper">
      <div class="kanban-row">
        <article
          v-for="status in JOB_STATUSES"
          :key="status"
          class="card shadow-sm border-0 kanban-column"
          @dragover="onDragOver"
          @drop="onDrop($event, status)"
        >
          <div class="card-header bg-light">
            <h5 class="mb-0">{{ status }}</h5>
            <small class="text-secondary">{{ jobsByStatus[status].length }} job(s)</small>
          </div>

          <div class="card-body p-2 kanban-body">
            <div
              v-for="job in jobsByStatus[status]"
              :key="job.id"
              class="card mb-2 shadow-sm border-0 job-card"
              draggable="true"
              @dragstart="onDragStart($event, job.id)"
            >
              <div class="card-body p-3">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 class="mb-1 fw-semibold">{{ job.id }}</h6>
                    <p class="small mb-1">{{ job.customerName }}</p>
                  </div>
                  <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-dark py-0 px-2" @click="openEditModal(job)">Edit</button>
                    <button class="btn btn-sm btn-link text-danger p-0" @click="handleDeleteJob(job.id)">X</button>
                  </div>
                </div>

                <p class="small text-secondary mb-2">{{ job.serviceType }}</p>

                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="badge" :class="`text-bg-${job.priority === 'High' ? 'danger' : job.priority === 'Medium' ? 'warning' : 'info'}`">
                    {{ job.priority }}
                  </span>
                  <small class="text-secondary">{{ formatDate(job.createdAt) }}</small>
                </div>

                <p class="small fw-semibold text-primary mb-0">{{ formatCurrency(job.estimateTotal) }}</p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>