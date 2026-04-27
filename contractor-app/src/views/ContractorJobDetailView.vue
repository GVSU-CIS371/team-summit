<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import {
  clientApproveEstimate,
  clientConfirmCompletion,
  confirmSchedule,
  contractorReviewRequest,
  contractorRespondToDispute,
  fileDispute,
  getJobById,
  JOB_STATUSES,
  releasePayment,
  resolveDispute,
  securePayment,
  submitCompletion,
  submitFinalEstimate,
} from '../data/jobs'

const route = useRoute()
const job = computed(() => getJobById(route.params.id))

const reviewForm = reactive({
  requiresInspection: false,
  estimateAmount: '',
  notes: '',
  inspectionTime: '',
})

const estimateForm = reactive({
  amount: '',
  notes: '',
})

const completionForm = reactive({
  completionNotes: '',
  completionPhotoNames: [],
  invoiceAmount: '',
})

const disputeReason = ref('')
const disputeResponse = ref('')
const disputeResolution = ref('')

const timelineRows = computed(() => {
  if (!job.value) {
    return []
  }

  return JOB_STATUSES.map((status) => ({
    status,
    date: job.value.timeline[status] || null,
  }))
})

const workflowRows = computed(() => {
  if (!job.value?.workflow?.stageTimeline) {
    return []
  }

  return Object.entries(job.value.workflow.stageTimeline)
    .map(([stage, date]) => ({ stage, date }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
})

function handleReviewSubmit() {
  if (!job.value) {
    return
  }

  contractorReviewRequest(job.value.id, {
    requiresInspection: reviewForm.requiresInspection,
    estimateAmount: reviewForm.estimateAmount,
    notes: reviewForm.notes,
    inspectionTime: reviewForm.inspectionTime,
  })

  reviewForm.estimateAmount = ''
  reviewForm.notes = ''
  reviewForm.inspectionTime = ''
}

function handleFinalEstimateSubmit() {
  if (!job.value || !estimateForm.amount) {
    return
  }

  submitFinalEstimate(job.value.id, {
    estimateAmount: estimateForm.amount,
    notes: estimateForm.notes,
  })

  estimateForm.amount = ''
  estimateForm.notes = ''
}

function handlePaymentSecure() {
  if (!job.value) {
    return
  }

  securePayment(job.value.id)
}

function handleSchedule() {
  if (!job.value) {
    return
  }

  confirmSchedule(job.value.id, job.value.workflow.preferredTimeSlot)
}

function handleCompletionPhotoChange(event) {
  const files = Array.from(event.target.files || [])
  completionForm.completionPhotoNames = files.map((file) => file.name)
}

function handleCompletionSubmit() {
  if (!job.value) {
    return
  }

  submitCompletion(job.value.id, {
    completionNotes: completionForm.completionNotes,
    completionPhotos: completionForm.completionPhotoNames,
    invoiceAmount: completionForm.invoiceAmount,
    disputeHours: 72,
  })

  completionForm.completionNotes = ''
  completionForm.completionPhotoNames = []
  completionForm.invoiceAmount = ''
}

function handleClientApproveEstimate() {
  if (!job.value) {
    return
  }

  clientApproveEstimate(job.value.id)
}

function handleClientConfirmCompletion() {
  if (!job.value) {
    return
  }

  clientConfirmCompletion(job.value.id)
}

function handleFileDispute() {
  if (!job.value || !disputeReason.value) {
    return
  }

  fileDispute(job.value.id, disputeReason.value)
  disputeReason.value = ''
}

function handleContractorDisputeResponse() {
  if (!job.value || !disputeResponse.value) {
    return
  }

  contractorRespondToDispute(job.value.id, disputeResponse.value)
  disputeResponse.value = ''
}

function handleResolveDispute() {
  if (!job.value || !disputeResolution.value) {
    return
  }

  resolveDispute(job.value.id, disputeResolution.value)
  disputeResolution.value = ''
}

function handleAutoRelease() {
  if (!job.value) {
    return
  }

  releasePayment(job.value.id)
}

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
</script>

<template>
  <main class="container py-4" v-if="job">
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
              <span class="badge text-bg-light border">Workflow: {{ job.workflow.stage }}</span>
              <span class="badge text-bg-light border">Payment: {{ job.workflow.paymentStatus }}</span>
              <span class="badge text-bg-light border">Dispute: {{ job.workflow.disputeStatus }}</span>
            </div>
            <hr />
            <p class="mb-2 small"><strong>Preferred time:</strong> {{ job.workflow.preferredTimeSlot || 'Not selected' }}</p>
            <p class="mb-2 small"><strong>Scheduled time:</strong> {{ job.workflow.scheduledTime || 'Not scheduled' }}</p>
            <p class="mb-2 small"><strong>Request photos:</strong> {{ job.workflow.requestPhotos?.join(', ') || 'None uploaded' }}</p>
            <p class="mb-0 small"><strong>Estimate notes:</strong> {{ job.workflow.estimateNotes || 'No notes yet' }}</p>
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

    <section class="card shadow-sm border-0 mt-4">
      <div class="card-body">
        <h2 class="h5 mb-3">Workflow Timeline</h2>
        <ul class="list-group list-group-flush">
          <li v-for="row in workflowRows" :key="row.stage" class="list-group-item d-flex justify-content-between px-0">
            <span>{{ row.stage }}</span>
            <span class="text-secondary">{{ formatDateTime(row.date) }}</span>
          </li>
        </ul>
      </div>
    </section>

    <section class="card shadow-sm border-0 mt-4">
      <div class="card-body">
        <h2 class="h5 mb-3">Contractor Review</h2>
        <form class="row g-3" @submit.prevent="handleReviewSubmit">
          <div class="col-12 form-check">
            <input id="requiresInspection" v-model="reviewForm.requiresInspection" type="checkbox" class="form-check-input" />
            <label class="form-check-label" for="requiresInspection">Inspection required before final estimate</label>
          </div>
          <div class="col-12 col-md-6" v-if="reviewForm.requiresInspection">
            <label class="form-label">Inspection time</label>
            <input v-model="reviewForm.inspectionTime" class="form-control" placeholder="2026-04-30 10:00 AM" />
          </div>
          <div class="col-12 col-md-6" v-else>
            <label class="form-label">Auto estimate amount</label>
            <input v-model="reviewForm.estimateAmount" type="number" min="0" class="form-control" placeholder="750" />
          </div>
          <div class="col-12">
            <label class="form-label">Review notes</label>
            <textarea v-model="reviewForm.notes" class="form-control" rows="2"></textarea>
          </div>
          <div class="col-12">
            <button class="btn btn-dark" type="submit">Submit contractor review</button>
          </div>
        </form>
      </div>
    </section>

    <section class="card shadow-sm border-0 mt-4">
      <div class="card-body">
        <h2 class="h5 mb-3">Final Estimate (Inspection Branch)</h2>
        <form class="row g-3" @submit.prevent="handleFinalEstimateSubmit">
          <div class="col-12 col-md-4">
            <label class="form-label">Final estimate</label>
            <input v-model="estimateForm.amount" type="number" min="0" class="form-control" required />
          </div>
          <div class="col-12 col-md-8">
            <label class="form-label">Estimate notes</label>
            <input v-model="estimateForm.notes" class="form-control" />
          </div>
          <div class="col-12 d-flex gap-2">
            <button class="btn btn-outline-dark" type="submit">Provide final estimate</button>
            <button class="btn btn-outline-primary" type="button" @click="handleClientApproveEstimate">Client approves estimate</button>
            <button class="btn btn-outline-success" type="button" @click="handlePaymentSecure">Secure payment</button>
            <button class="btn btn-outline-secondary" type="button" @click="handleSchedule">Confirm schedule</button>
          </div>
        </form>
      </div>
    </section>

    <section class="card shadow-sm border-0 mt-4">
      <div class="card-body">
        <h2 class="h5 mb-3">Completion and Invoice</h2>
        <form class="row g-3" @submit.prevent="handleCompletionSubmit">
          <div class="col-12 col-md-4">
            <label class="form-label">Invoice amount</label>
            <input v-model="completionForm.invoiceAmount" type="number" min="0" class="form-control" />
          </div>
          <div class="col-12 col-md-8">
            <label class="form-label">Completion notes</label>
            <input v-model="completionForm.completionNotes" class="form-control" placeholder="Work completed and site cleaned." />
          </div>
          <div class="col-12">
            <label class="form-label">Completion photos</label>
            <input type="file" class="form-control" multiple accept="image/*" @change="handleCompletionPhotoChange" />
            <p class="small text-secondary mb-0 mt-2" v-if="completionForm.completionPhotoNames.length">
              Selected: {{ completionForm.completionPhotoNames.join(', ') }}
            </p>
          </div>
          <div class="col-12 d-flex gap-2">
            <button class="btn btn-outline-dark" type="submit">Submit completion confirmation</button>
            <button class="btn btn-outline-success" type="button" @click="handleClientConfirmCompletion">Client confirms and release payment</button>
            <button class="btn btn-outline-secondary" type="button" @click="handleAutoRelease">Auto release payment</button>
          </div>
        </form>
      </div>
    </section>

    <section class="card shadow-sm border-0 mt-4 mb-5">
      <div class="card-body">
        <h2 class="h5 mb-3">Dispute Window (48-72 hours)</h2>
        <p class="small text-secondary">
          Deadline: {{ job.workflow.disputeDeadline ? formatDateTime(job.workflow.disputeDeadline) : 'No dispute window open' }}
        </p>
        <div class="row g-3">
          <div class="col-12 col-lg-4">
            <label class="form-label">Client dispute reason</label>
            <textarea v-model="disputeReason" class="form-control" rows="3"></textarea>
            <button class="btn btn-outline-danger mt-2" type="button" @click="handleFileDispute">File dispute</button>
          </div>
          <div class="col-12 col-lg-4">
            <label class="form-label">Contractor response</label>
            <textarea v-model="disputeResponse" class="form-control" rows="3"></textarea>
            <button class="btn btn-outline-dark mt-2" type="button" @click="handleContractorDisputeResponse">Submit response</button>
          </div>
          <div class="col-12 col-lg-4">
            <label class="form-label">Platform resolution</label>
            <textarea v-model="disputeResolution" class="form-control" rows="3"></textarea>
            <button class="btn btn-outline-primary mt-2" type="button" @click="handleResolveDispute">Resolve dispute</button>
          </div>
        </div>
      </div>
    </section>
  </main>

  <main class="container py-5" v-else>
    <div class="alert alert-warning" role="alert">Job not found.</div>
    <RouterLink to="/contractor" class="btn btn-outline-dark">Return to dashboard</RouterLink>
  </main>
</template>
