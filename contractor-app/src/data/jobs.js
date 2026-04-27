export const JOB_STATUSES = [
  'Requested',
  'Estimated',
  'Approved',
  'In-Progress',
  'Completed',
]

export const WORKFLOW_STAGES = [
  'Requested',
  'Contractor Review',
  'Inspection Scheduled',
  'Final Estimate Provided',
  'Client Approved Estimate',
  'Payment Secured',
  'Scheduled',
  'Work Completed',
  'Dispute Window',
  'Payment Released',
  'Disputed',
]

export const PAYMENT_STATUSES = ['Pending', 'Secured', 'HeldForDispute', 'Released']
export const DISPUTE_STATUSES = ['None', 'WindowOpen', 'Filed', 'UnderReview', 'Resolved']

function nowIso() {
  return new Date().toISOString()
}

function addHours(dateString, hours) {
  const date = new Date(dateString)
  date.setHours(date.getHours() + hours)
  return date.toISOString()
}

function toNumberOrNull(value) {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

function createInitialWorkflow(now) {
  return {
    stage: 'Requested',
    requiresInspection: false,
    preferredTimeSlot: null,
    scheduledTime: null,
    requestPhotos: [],
    completionPhotos: [],
    estimateNotes: '',
    completionNotes: '',
    invoiceAmount: null,
    finalEstimateAmount: null,
    paymentStatus: 'Pending',
    paymentHoldReason: '',
    disputeStatus: 'None',
    disputeDeadline: null,
    disputeReason: '',
    contractorResponse: '',
    disputeResolution: '',
    stageTimeline: {
      Requested: now,
    },
  }
}

const jobs = [
  {
    id: 'JOB-1001',
    customerName: 'Maplewood Family Dental',
    propertyType: 'Business',
    serviceType: 'Roof Replacement',
    description: 'Repeated leaks over exam rooms after heavy rain.',
    createdAt: '2026-03-15T09:24:00Z',
    status: 'Requested',
    priority: 'High',
    estimateTotal: null,
    contractorId: null,
    timeline: {
      Requested: '2026-03-15T09:24:00Z',
    },
    workflow: {
      ...createInitialWorkflow('2026-03-15T09:24:00Z'),
      requestPhotos: ['ceiling-leak.jpg'],
      preferredTimeSlot: '2026-04-28 9:00 AM',
      stage: 'Contractor Review',
      stageTimeline: {
        Requested: '2026-03-15T09:24:00Z',
        'Contractor Review': '2026-03-15T10:10:00Z',
      },
    },
  },
  {
    id: 'JOB-1002',
    customerName: 'Eli Turner',
    propertyType: 'Homeowner',
    serviceType: 'Storm Damage Repair',
    description: 'Missing shingles and damaged flashing near chimney.',
    createdAt: '2026-03-11T13:10:00Z',
    status: 'Estimated',
    priority: 'Medium',
    estimateTotal: 3800,
    contractorId: 'CTR-203',
    timeline: {
      Requested: '2026-03-11T13:10:00Z',
      Estimated: '2026-03-12T16:02:00Z',
    },
    workflow: {
      ...createInitialWorkflow('2026-03-11T13:10:00Z'),
      stage: 'Final Estimate Provided',
      finalEstimateAmount: 3800,
      estimateNotes: 'Replace 12 shingles and reseal flashing around chimney.',
      preferredTimeSlot: '2026-04-28 11:30 AM',
      stageTimeline: {
        Requested: '2026-03-11T13:10:00Z',
        'Contractor Review': '2026-03-11T14:05:00Z',
        'Final Estimate Provided': '2026-03-12T16:02:00Z',
      },
    },
  },
  {
    id: 'JOB-1003',
    customerName: 'Mina Patel',
    propertyType: 'Homeowner',
    serviceType: 'Roof Inspection',
    description: 'Inspection needed for insurance renewal documents.',
    createdAt: '2026-03-08T17:48:00Z',
    status: 'In-Progress',
    priority: 'Low',
    estimateTotal: 450,
    contractorId: 'CTR-201',
    timeline: {
      Requested: '2026-03-08T17:48:00Z',
      Estimated: '2026-03-09T10:15:00Z',
      Approved: '2026-03-10T14:10:00Z',
      'In-Progress': '2026-03-13T08:45:00Z',
    },
    workflow: {
      ...createInitialWorkflow('2026-03-08T17:48:00Z'),
      stage: 'Scheduled',
      finalEstimateAmount: 450,
      estimateNotes: 'Inspection and report package.',
      paymentStatus: 'Secured',
      preferredTimeSlot: '2026-04-27 3:30 PM',
      scheduledTime: '2026-04-27 3:30 PM',
      stageTimeline: {
        Requested: '2026-03-08T17:48:00Z',
        'Contractor Review': '2026-03-09T08:20:00Z',
        'Final Estimate Provided': '2026-03-09T10:15:00Z',
        'Client Approved Estimate': '2026-03-10T14:10:00Z',
        'Payment Secured': '2026-03-10T14:15:00Z',
        Scheduled: '2026-03-12T12:20:00Z',
      },
    },
  },
  {
    id: 'JOB-1004',
    customerName: 'Northside Retail Center',
    propertyType: 'Business',
    serviceType: 'Flat Roof Coating',
    description: 'Preventive coating before summer heat wave.',
    createdAt: '2026-02-27T11:30:00Z',
    status: 'Completed',
    priority: 'Medium',
    estimateTotal: 9200,
    contractorId: 'CTR-202',
    timeline: {
      Requested: '2026-02-27T11:30:00Z',
      Estimated: '2026-03-01T09:10:00Z',
      Approved: '2026-03-02T15:40:00Z',
      'In-Progress': '2026-03-04T07:55:00Z',
      Completed: '2026-03-06T16:25:00Z',
    },
    workflow: {
      ...createInitialWorkflow('2026-02-27T11:30:00Z'),
      stage: 'Payment Released',
      finalEstimateAmount: 9200,
      estimateNotes: 'Coating with 10-year product warranty.',
      paymentStatus: 'Released',
      disputeStatus: 'Resolved',
      completionPhotos: ['before-after-1.jpg', 'before-after-2.jpg'],
      completionNotes: 'Final walkthrough completed with facilities manager.',
      invoiceAmount: 9200,
      stageTimeline: {
        Requested: '2026-02-27T11:30:00Z',
        'Contractor Review': '2026-02-27T12:10:00Z',
        'Final Estimate Provided': '2026-03-01T09:10:00Z',
        'Client Approved Estimate': '2026-03-02T15:40:00Z',
        'Payment Secured': '2026-03-02T16:00:00Z',
        Scheduled: '2026-03-03T10:30:00Z',
        'Work Completed': '2026-03-06T16:25:00Z',
        'Dispute Window': '2026-03-06T16:30:00Z',
        'Payment Released': '2026-03-09T16:30:00Z',
      },
    },
  },
]

let nextJobNumber = 1005

export function getJobs() {
  return [...jobs]
}

export function getJobById(jobId) {
  return jobs.find((job) => job.id === jobId)
}

export function createJobRequest(payload) {
  const now = nowIso()
  const newJob = {
    id: `JOB-${nextJobNumber++}`,
    customerName: payload.customerName,
    propertyType: payload.propertyType,
    serviceType: payload.serviceType,
    description: payload.description,
    createdAt: now,
    status: 'Requested',
    priority: payload.priority || 'Medium',
    estimateTotal: null,
    contractorId: payload.contractorId || null,
    contactEmail: payload.contactEmail,
    contactPhone: payload.contactPhone,
    address: payload.address,
    timeline: {
      Requested: now,
    },
    workflow: {
      ...createInitialWorkflow(now),
      requestPhotos: payload.requestPhotos || [],
      preferredTimeSlot: payload.preferredTimeSlot || null,
    },
  }

  if (newJob.contractorId) {
    newJob.workflow.stage = 'Contractor Review'
    newJob.workflow.stageTimeline['Contractor Review'] = now
  }

  jobs.unshift(newJob)
  return newJob
}

export function updateJobStatus(jobId, newStatus) {
  const job = jobs.find((job) => job.id === jobId)
  if (job) {
    job.status = newStatus
    const now = nowIso()
    job.timeline[newStatus] = now

    if (newStatus === 'Estimated') {
      setWorkflowStage(job, 'Final Estimate Provided', now)
    }

    if (newStatus === 'Approved') {
      setWorkflowStage(job, 'Client Approved Estimate', now)
    }

    if (newStatus === 'In-Progress') {
      setWorkflowStage(job, 'Scheduled', now)
    }

    if (newStatus === 'Completed') {
      setWorkflowStage(job, 'Work Completed', now)
      openDisputeWindow(jobId, 72)
    }
  }
  return job
}

function setWorkflowStage(job, stage, timestamp) {
  if (!job.workflow) {
    job.workflow = createInitialWorkflow(timestamp)
  }

  job.workflow.stage = stage
  job.workflow.stageTimeline[stage] = timestamp
}

export function updateJob(jobId, payload) {
  const job = jobs.find((job) => job.id === jobId)
  if (!job) {
    return null
  }

  const previousStatus = job.status

  job.customerName = payload.customerName
  job.propertyType = payload.propertyType
  job.serviceType = payload.serviceType
  job.description = payload.description
  job.priority = payload.priority
  job.contactEmail = payload.contactEmail
  job.contactPhone = payload.contactPhone
  job.address = payload.address
  job.status = payload.status
  job.estimateTotal = toNumberOrNull(payload.estimateTotal)

  if (payload.status !== previousStatus) {
    job.timeline[payload.status] = nowIso()
  }

  if (payload.contractorId !== undefined) {
    job.contractorId = payload.contractorId
  }

  return job
}

export function deleteJob(jobId) {
  const index = jobs.findIndex((job) => job.id === jobId)
  if (index > -1) {
    jobs.splice(index, 1)
    return true
  }
  return false
}

export function assignContractor(jobId, contractorId) {
  const job = getJobById(jobId)
  if (!job) {
    return null
  }

  const now = nowIso()
  job.contractorId = contractorId
  setWorkflowStage(job, 'Contractor Review', now)
  return job
}

export function contractorReviewRequest(jobId, payload) {
  const job = getJobById(jobId)
  if (!job) {
    return null
  }

  const now = nowIso()
  const requiresInspection = Boolean(payload.requiresInspection)
  job.workflow.requiresInspection = requiresInspection

  if (requiresInspection) {
    setWorkflowStage(job, 'Inspection Scheduled', now)
    job.workflow.scheduledTime = payload.inspectionTime || job.workflow.scheduledTime
    job.workflow.estimateNotes = payload.notes || ''
    return job
  }

  const estimate = toNumberOrNull(payload.estimateAmount)
  job.estimateTotal = estimate
  job.workflow.finalEstimateAmount = estimate
  job.workflow.estimateNotes = payload.notes || ''
  setWorkflowStage(job, 'Final Estimate Provided', now)
  job.status = 'Estimated'
  job.timeline.Estimated = now
  return job
}

export function submitFinalEstimate(jobId, payload) {
  const job = getJobById(jobId)
  if (!job) {
    return null
  }

  const now = nowIso()
  const estimate = toNumberOrNull(payload.estimateAmount)
  job.estimateTotal = estimate
  job.workflow.finalEstimateAmount = estimate
  job.workflow.estimateNotes = payload.notes || job.workflow.estimateNotes
  setWorkflowStage(job, 'Final Estimate Provided', now)
  job.status = 'Estimated'
  job.timeline.Estimated = now
  return job
}

export function clientApproveEstimate(jobId) {
  const job = getJobById(jobId)
  if (!job) {
    return null
  }

  const now = nowIso()
  setWorkflowStage(job, 'Client Approved Estimate', now)
  job.status = 'Approved'
  job.timeline.Approved = now
  return job
}

export function securePayment(jobId) {
  const job = getJobById(jobId)
  if (!job) {
    return null
  }

  const now = nowIso()
  job.workflow.paymentStatus = 'Secured'
  job.workflow.paymentHoldReason = 'Held in escrow until dispute window closes.'
  setWorkflowStage(job, 'Payment Secured', now)
  return job
}

export function confirmSchedule(jobId, scheduledTime) {
  const job = getJobById(jobId)
  if (!job) {
    return null
  }

  const now = nowIso()
  job.workflow.scheduledTime = scheduledTime || job.workflow.preferredTimeSlot || null
  setWorkflowStage(job, 'Scheduled', now)
  job.status = 'In-Progress'
  job.timeline['In-Progress'] = now
  return job
}

export function submitCompletion(jobId, payload) {
  const job = getJobById(jobId)
  if (!job) {
    return null
  }

  const now = nowIso()
  job.workflow.completionPhotos = payload.completionPhotos || []
  job.workflow.completionNotes = payload.completionNotes || ''
  job.workflow.invoiceAmount = toNumberOrNull(payload.invoiceAmount)
  setWorkflowStage(job, 'Work Completed', now)
  job.status = 'Completed'
  job.timeline.Completed = now
  openDisputeWindow(jobId, payload.disputeHours || 72)
  return job
}

export function openDisputeWindow(jobId, hours = 72) {
  const job = getJobById(jobId)
  if (!job) {
    return null
  }

  const now = nowIso()
  job.workflow.paymentStatus = 'HeldForDispute'
  job.workflow.disputeStatus = 'WindowOpen'
  job.workflow.disputeDeadline = addHours(now, hours)
  setWorkflowStage(job, 'Dispute Window', now)
  return job
}

export function clientConfirmCompletion(jobId) {
  const job = getJobById(jobId)
  if (!job) {
    return null
  }

  return releasePayment(jobId, 'Client confirmed completion.')
}

export function releasePayment(jobId, reason = 'Automatic release after dispute window.') {
  const job = getJobById(jobId)
  if (!job) {
    return null
  }

  const now = nowIso()
  job.workflow.paymentStatus = 'Released'
  job.workflow.paymentHoldReason = reason
  job.workflow.disputeStatus = job.workflow.disputeStatus === 'Resolved' ? 'Resolved' : 'None'
  setWorkflowStage(job, 'Payment Released', now)
  return job
}

export function fileDispute(jobId, reason) {
  const job = getJobById(jobId)
  if (!job) {
    return null
  }

  const now = nowIso()
  job.workflow.disputeStatus = 'Filed'
  job.workflow.disputeReason = reason
  job.workflow.paymentStatus = 'HeldForDispute'
  setWorkflowStage(job, 'Disputed', now)
  return job
}

export function contractorRespondToDispute(jobId, response) {
  const job = getJobById(jobId)
  if (!job) {
    return null
  }

  job.workflow.contractorResponse = response
  job.workflow.disputeStatus = 'UnderReview'
  return job
}

export function resolveDispute(jobId, resolution) {
  const job = getJobById(jobId)
  if (!job) {
    return null
  }

  job.workflow.disputeResolution = resolution
  job.workflow.disputeStatus = 'Resolved'
  return releasePayment(jobId, `Platform resolution: ${resolution}`)
}

export function autoReleaseEligiblePayments(referenceDate = new Date()) {
  const released = []

  jobs.forEach((job) => {
    if (
      job.workflow &&
      job.workflow.disputeStatus === 'WindowOpen' &&
      job.workflow.disputeDeadline &&
      new Date(job.workflow.disputeDeadline) <= referenceDate
    ) {
      released.push(releasePayment(job.id))
    }
  })

  return released.filter(Boolean)
}
