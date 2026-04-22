<script setup>
import { ref, computed, onMounted  } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getJobById, JOB_STATUSES } from '../data/jobs'

const route = useRoute()
const job = ref(null)
const isLoading = ref(true)

async function loadJob() {
  isLoading.value = true
  try {
    job.value = await getJobById(route.params.id)
  } finally {
    isLoading.value = false
  }
}

onMounted(loadJob)

const timelineRows = computed(() => {
  if (!job.value) {
    return []
  }

  return [
    { status: 'Requested', date: job.value.createdAt || null },
    { status: 'Estimated', date: job.value.estimatedAt || null },
    { status: 'Approved', date: job.value.approvedAt || null },
    { status: 'In-Progress', date: job.value.startedAt || null },
    { status: 'Completed', date: job.value.completedAt || null },
  ]
})

function formatDateTime(dateString) {
  if (!dateString) {
    return 'Not reached yet'
  }
  
  const date = dateValue?.toDate ? dateValue.toDate() : new Date(dateValue)

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
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
  <main v-if="isLoading" class="container py-5">
    <p>Loading job...</p>
  </main>

  <main class="container py-4" v-else-if="job">
    <header class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
      <div>
        <p class="text-secondary text-uppercase small mb-1">{{ job.id }}</p>
        <h1 class="h3 mb-1">{{ job.serviceType }}</h1>
        <p class="mb-0 text-secondary">{{ job.customerName }} ({{ job.propertyType }})</p>
      </div>
      <RouterLink to="/contractor" class="btn btn-outline-dark">Back to dashboard</RouterLink>
    </header>

    <section class="row g-4">
      <div class="col-12 col-lg-7">
        <article class="card shadow-sm border-0 h-100">
          <div class="card-body">
            <h2 class="h5 mb-3">Request Details</h2>
            <p class="mb-3">{{ job.description }}</p>
            <div class="d-flex flex-wrap gap-2">
              <span class="badge text-bg-light border">Status: {{ job.status }}</span>
              <span class="badge text-bg-light border">Priority: {{ job.priority }}</span>
              <span class="badge text-bg-light border">Estimate: {{ formatCurrency(job.estimateTotal) }}</span>
            </div>
          </div>
        </article>
      </div>

      <div class="col-12 col-lg-5">
        <article class="card shadow-sm border-0 h-100">
          <div class="card-body">
            <h2 class="h5 mb-3">Status Timeline</h2>
            <ul class="list-group list-group-flush">
              <li v-for="row in timelineRows" :key="row.status" class="list-group-item d-flex justify-content-between px-0">
                <span>{{ row.status }}</span>
                <span class="text-secondary">{{ formatDateTime(row.date) }}</span>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </section>
  </main>

  <main class="container py-5" v-else>
    <div class="alert alert-warning" role="alert">Job not found.</div>
    <RouterLink to="/contractor" class="btn btn-outline-dark">Return to dashboard</RouterLink>
  </main>
</template>