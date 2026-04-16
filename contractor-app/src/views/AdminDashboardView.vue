<script setup>
import { computed, ref, reactive } from 'vue'
import { useAuth } from '../auth/mockAuth'
import { getJobs, JOB_STATUSES, updateJobStatus, deleteJob, createJobRequest, updateJob } from '../data/jobs'

const auth = useAuth()
const jobs = ref(getJobs())
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

function onDrop(e, status) {
  e.preventDefault()
  if (draggedJobId.value) {
    updateJobStatus(draggedJobId.value, status)
    jobs.value = getJobs()
    draggedJobId.value = null
  }
}

function handleDeleteJob(jobId) {
  if (confirm('Are you sure you want to delete this job?')) {
    deleteJob(jobId)
    jobs.value = getJobs()
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
  editForm.estimateTotal = job.estimateTotal === null || job.estimateTotal === undefined ? '' : String(job.estimateTotal)
  showEditModal.value = true
}

function handleUpdateJob() {
  if (!editForm.customerName || !editForm.serviceType) {
    alert('Please fill in customer name and service type')
    return
  }

  const parsedEstimate = editForm.estimateTotal === '' ? null : Number(editForm.estimateTotal)

  if (parsedEstimate !== null && Number.isNaN(parsedEstimate)) {
    alert('Estimate must be a valid number')
    return
  }

  const updated = updateJob(editingJobId.value, {
    customerName: editForm.customerName,
    propertyType: editForm.propertyType,
    serviceType: editForm.serviceType,
    description: editForm.description,
    priority: editForm.priority,
    contactEmail: editForm.contactEmail,
    contactPhone: editForm.contactPhone,
    address: editForm.address,
    status: editForm.status,
    estimateTotal: parsedEstimate,
  })

  if (updated) {
    jobs.value = getJobs()
    showEditModal.value = false
  }
}

function handleCreateJob() {
  if (!form.customerName || !form.serviceType) {
    alert('Please fill in customer name and service type')
    return
  }

  const newJob = createJobRequest({
    customerName: form.customerName,
    propertyType: form.propertyType,
    serviceType: form.serviceType,
    description: form.description,
    priority: form.priority,
    contactEmail: form.contactEmail,
    contactPhone: form.contactPhone,
    address: form.address,
  })

  if (newJob) {
    jobs.value = getJobs()
    resetForm()
    showCreateModal.value = false
  }
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

function formatDate(dateString) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
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
</script>

<template>
  <main class="container-fluid py-4">
    <header class="mb-4">
      <div class="d-flex flex-wrap justify-content-between align-items-start gap-3">
        <div>
          <h1 class="h3 mb-1">Welcome, {{ auth.currentUser?.name }}</h1>
          <p class="text-secondary mb-0">Manage all job requests, estimates, and progress across your contractors.</p>
        </div>
        <div>
          <button class="btn btn-primary" @click="showCreateModal = true">+ Create New Job</button>
        </div>
      </div>
    </header>

    <section class="kanban-wrapper">
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
                    <button class="btn btn-sm btn-link text-danger p-0" @click="handleDeleteJob(job.id)" title="Delete job">X</button>
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

            <div v-if="jobsByStatus[status].length === 0" class="text-center py-5">
              <p class="text-secondary small">No jobs in this stage</p>
            </div>
          </div>
        </article>
      </div>
    </section>

    <div v-if="showCreateModal" class="modal d-block" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create New Job Request</h5>
            <button type="button" class="btn-close" @click="showCreateModal = false"></button>
          </div>
          <form @submit.prevent="handleCreateJob">
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-12 col-md-6">
                  <label class="form-label">Customer Name *</label>
                  <input v-model="form.customerName" type="text" class="form-control" required />
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label">Property Type</label>
                  <select v-model="form.propertyType" class="form-select">
                    <option>Homeowner</option>
                    <option>Business</option>
                  </select>
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label">Service Type *</label>
                  <input v-model="form.serviceType" type="text" class="form-control" required />
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label">Priority</label>
                  <select v-model="form.priority" class="form-select">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <div class="col-12">
                  <label class="form-label">Description</label>
                  <textarea v-model="form.description" class="form-control" rows="3"></textarea>
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label">Email</label>
                  <input v-model="form.contactEmail" type="email" class="form-control" />
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label">Phone</label>
                  <input v-model="form.contactPhone" type="tel" class="form-control" />
                </div>

                <div class="col-12">
                  <label class="form-label">Address</label>
                  <input v-model="form.address" type="text" class="form-control" />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showCreateModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary">Create Job</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="showEditModal" class="modal d-block" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Job {{ editingJobId }}</h5>
            <button type="button" class="btn-close" @click="showEditModal = false"></button>
          </div>
          <form @submit.prevent="handleUpdateJob">
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-12 col-md-6">
                  <label class="form-label">Customer Name *</label>
                  <input v-model="editForm.customerName" type="text" class="form-control" required />
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label">Property Type</label>
                  <select v-model="editForm.propertyType" class="form-select">
                    <option>Homeowner</option>
                    <option>Business</option>
                  </select>
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label">Service Type *</label>
                  <input v-model="editForm.serviceType" type="text" class="form-control" required />
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label">Priority</label>
                  <select v-model="editForm.priority" class="form-select">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label">Status</label>
                  <select v-model="editForm.status" class="form-select">
                    <option v-for="status in JOB_STATUSES" :key="status" :value="status">{{ status }}</option>
                  </select>
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label">Estimate Total ($)</label>
                  <input v-model="editForm.estimateTotal" type="number" min="0" class="form-control" />
                </div>

                <div class="col-12">
                  <label class="form-label">Description</label>
                  <textarea v-model="editForm.description" class="form-control" rows="3"></textarea>
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label">Email</label>
                  <input v-model="editForm.contactEmail" type="email" class="form-control" />
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label">Phone</label>
                  <input v-model="editForm.contactPhone" type="tel" class="form-control" />
                </div>

                <div class="col-12">
                  <label class="form-label">Address</label>
                  <input v-model="editForm.address" type="text" class="form-control" />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showEditModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.kanban-wrapper {
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.kanban-row {
  display: flex;
  gap: 1rem;
  min-width: max-content;
}

.kanban-column {
  width: 320px;
  min-height: 650px;
  cursor: default;
}

.kanban-column:hover {
  transition: box-shadow 0.2s;
}

.job-card {
  cursor: grab;
  transition: transform 0.1s, box-shadow 0.1s;
}

.job-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.job-card:active {
  cursor: grabbing;
}

.kanban-body {
  max-height: 580px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
}

.kanban-body::-webkit-scrollbar {
  width: 6px;
}

.kanban-body::-webkit-scrollbar-track {
  background: transparent;
}

.kanban-body::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.kanban-body::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
