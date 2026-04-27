<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { getJobs, JOB_STATUSES, getJobsForContractor } from '../data/jobs'
import { useAuth } from '../auth/mockAuth'

const auth = useAuth()

const selectedStatus = ref('All')
const jobs = ref([])
const isLoading = ref(true)
const loadError = ref('')

const statusOptions = ['All', ...JOB_STATUSES]

const filteredJobs = computed(() => {
  if (selectedStatus.value === 'All') {
    return jobs.value
  }

  return jobs.value.filter((job) => job.status === selectedStatus.value)
})

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

onMounted(async () => {
  try {
    jobs.value = await getJobsForContractor(auth.currentUser.uid)
  } catch (error) {
    loadError.value = error?.message || 'Failed to load jobs.'
  } finally {
    isLoading.value = false
  }
})
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

        <div class="d-flex flex-wrap gap-2 align-items-center mb-3">
          <label for="statusFilter" class="form-label mb-0 fw-semibold">Filter by status</label>
          <select id="statusFilter" class="form-select filter-select" v-model="selectedStatus">
            <option v-for="status in statusOptions" :key="status" :value="status">{{ status }}</option>
          </select>
        </div>

        <div v-if="isLoading" class="text-secondary py-2">Loading jobs...</div>

        <div class="table-responsive">
          <table class="table align-middle mb-0">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Created</th>
                <th>Status</th>
                <th>Estimate</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="job in filteredJobs" :key="job.id">
                <td class="fw-semibold">{{ job.id }}</td>
                <td>{{ job.customerName }}</td>
                <td>{{ job.serviceType }}</td>
                <td>{{ formatDate(job.createdAt) }}</td>
                <td>
                  <span class="badge text-bg-light border">{{ job.status }}</span>
                </td>
                <td>{{ formatCurrency(job.estimateTotal) }}</td>
                <td class="text-end">
                  <RouterLink :to="`/contractor/jobs/${job.id}`" class="btn btn-sm btn-outline-dark">Open</RouterLink>
                </td>
              </tr>
              <tr v-if="filteredJobs.length === 0">
                <td colspan="7" class="text-center text-secondary py-4">No jobs found for this status.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.status-card {
  background: linear-gradient(145deg, #fffaf3, #ffffff);
}

.filter-select {
  width: 220px;
}
</style>
