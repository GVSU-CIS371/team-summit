<script setup>
import { computed, ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { getJobs, JOB_STATUSES } from '../data/jobs'

const selectedStatus = ref('All')
const jobs = ref([])
const isLoading = ref(true)

async function loadJobs() {
  isLoading.value = true
  try {
    jobs.value = await getJobs()
  } finally {
    isLoading.value = false
  }
}

onMounted(loadJobs)

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

function formatDate(dateValue) {
  if (!dateValue) return '—'
  const date = dateValue?.toDate ? dateValue.toDate() : new Date(dateValue)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
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
  <main class="container py-4">
    <header class="mb-4">
      <h1 class="h3 mb-1">Contractor Dashboard</h1>
      <p class="text-secondary mb-0">Manage jobs by workflow status and open each request to continue the estimate process.</p>
    </header>

    <p v-if="isLoading">Loading jobs...</p>

    <template v-else>
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
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2 class="h5 mb-0">Jobs</h2>
            <select v-model="selectedStatus" class="form-select w-auto">
              <option v-for="status in statusOptions" :key="status">{{ status }}</option>
            </select>
          </div>

          <div v-if="filteredJobs.length === 0" class="text-secondary">No jobs found.</div>

          <div v-else class="list-group">
            <RouterLink
              v-for="job in filteredJobs"
              :key="job.id"
              :to="`/contractor/jobs/${job.id}`"
              class="list-group-item list-group-item-action"
            >
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{ job.customerName }}</h5>
                <small>{{ formatDate(job.createdAt) }}</small>
              </div>
              <p class="mb-1">{{ job.serviceType }}</p>
              <small>{{ job.status }} · {{ formatCurrency(job.estimateTotal) }}</small>
            </RouterLink>
          </div>
        </div>
      </section>
    </template>
  </main>
</template>