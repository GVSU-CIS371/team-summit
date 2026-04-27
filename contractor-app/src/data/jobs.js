export const JOB_STATUSES = [
  'Requested',
  'Estimated',
  'Approved',
  'In-Progress',
  'Completed',
]

export const SERVICE_OPTIONS = [
  'Roof Repair',
  'Leak Inspection',
  'Replacement Estimate',
  'Storm Damage',
  'Gutter Work',
]

export const WORKFLOW_STAGES = [
  'Requested',
  'Matched',
  'Inspection Scheduled',
  'Estimate Issued',
  'Approved',
  'In-Progress',
  'Completed',
  'Dispute Window',
  'Released',
]

export const CONTRACTORS = [
  {
    id: 'con-1001',
    name: 'Summit Peak Roofing',
    rating: 4.9,
    reviews: 184,
    services: ['Roof Repair', 'Leak Inspection', 'Replacement Estimate', 'Storm Damage'],
    availability: ['Mon 9:00 AM', 'Mon 1:30 PM', 'Tue 10:00 AM'],
    pricingRange: '$250-$550 inspection',
    serviceAreas: ['Downtown', 'Northside', 'West End'],
    photoHighlights: ['Leak patch', 'Storm restoration', 'Slate repair'],
  },
  {
    id: 'con-1002',
    name: 'Cedar Ridge Exteriors',
    rating: 4.8,
    reviews: 142,
    services: ['Roof Repair', 'Leak Inspection', 'Gutter Work'],
    availability: ['Tue 8:30 AM', 'Wed 11:00 AM', 'Thu 2:00 PM'],
    pricingRange: '$180-$420 service call',
    serviceAreas: ['Northside', 'East Market', 'South Hill'],
    photoHighlights: ['Gutter replacement', 'Flashing repair', 'Wind damage'],
  },
  {
    id: 'con-1003',
    name: 'Atlas Roofing Co.',
    rating: 4.7,
    reviews: 96,
    services: ['Replacement Estimate', 'Storm Damage', 'Roof Repair'],
    availability: ['Mon 3:00 PM', 'Wed 9:30 AM', 'Fri 10:00 AM'],
    pricingRange: '$400-$750 estimate',
    serviceAreas: ['Downtown', 'Riverside', 'Airport District'],
    photoHighlights: ['Full replacement', 'Decking repair', 'Project staging'],
  },
  {
    id: 'con-1004',
    name: 'Harborline Roofing',
    rating: 4.6,
    reviews: 88,
    services: ['Gutter Work', 'Roof Repair', 'Leak Inspection'],
    availability: ['Tue 1:00 PM', 'Thu 9:00 AM', 'Fri 1:30 PM'],
    pricingRange: '$150-$390 service call',
    serviceAreas: ['West End', 'Harbor District', 'South Hill'],
    photoHighlights: ['Gutter guards', 'Roof tune-up', 'Water intrusion'],
  },
]

function normalizeText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
}

function matchesLocation(contractor, locationText) {
  const normalizedLocation = normalizeText(locationText)
  if (!normalizedLocation) {
    return true
  }

  return contractor.serviceAreas.some((area) => normalizeText(area).includes(normalizedLocation) || normalizedLocation.includes(normalizeText(area)))
}

export function requiresInspection(serviceType) {
  return ['Leak Inspection', 'Replacement Estimate', 'Storm Damage'].includes(serviceType)
}

export function getContractorById(contractorId) {
  return CONTRACTORS.find((contractor) => contractor.id === contractorId)
}

export function getNearbyContractors(serviceType, locationText = '') {
  const normalizedService = normalizeText(serviceType)

  return CONTRACTORS.filter((contractor) => {
    const serviceMatch = contractor.services.some((service) => normalizeText(service) === normalizedService)
    return serviceMatch && matchesLocation(contractor, locationText)
  }).sort((left, right) => right.rating - left.rating)
}

function buildLifecycleFromTimeline(timeline = {}) {
  return {
    requestedAt: timeline.Requested || null,
    matchedAt: timeline.Matched || null,
    inspectionScheduledAt: timeline['Inspection Scheduled'] || null,
    estimateIssuedAt: timeline.Estimated || timeline['Estimate Issued'] || null,
    approvedAt: timeline.Approved || null,
    workStartedAt: timeline['In-Progress'] || null,
    completedAt: timeline.Completed || null,
    disputeOpenedAt: timeline['Dispute Window'] || null,
    releasedAt: timeline.Released || null,
  }
}

const jobs = [
  {
    id: 'JOB-1001',
    customerName: 'Maplewood Family Dental',
    propertyType: 'Business',
    serviceType: 'Replacement Estimate',
    description: 'Repeated leaks over exam rooms after heavy rain.',
    createdAt: '2026-03-15T09:24:00Z',
    status: 'Requested',
    priority: 'High',
    estimateTotal: null,
    contractorId: 'con-1003',
    contractorName: 'Atlas Roofing Co.',
    selectedSlot: 'Tue 1:30 PM',
    address: '418 Maplewood Ave',
    city: 'Downtown',
    state: 'IL',
    zipCode: '60601',
    inspectionRequired: true,
    paymentStatus: 'Held in escrow',
    disputeWindowHours: 72,
    timeline: {
      Requested: '2026-03-15T09:24:00Z',
      Matched: '2026-03-15T09:40:00Z',
    },
  },
  {
    id: 'JOB-1002',
    customerName: 'Eli Turner',
    propertyType: 'Homeowner',
    serviceType: 'Storm Damage',
    description: 'Missing shingles and damaged flashing near chimney.',
    createdAt: '2026-03-11T13:10:00Z',
    status: 'Estimated',
    priority: 'Medium',
    estimateTotal: 3800,
    contractorId: 'con-1001',
    contractorName: 'Summit Peak Roofing',
    selectedSlot: 'Wed 10:00 AM',
    address: '23 Birch Lane',
    city: 'Northside',
    state: 'IL',
    zipCode: '60614',
    inspectionRequired: true,
    paymentStatus: 'Held in escrow',
    disputeWindowHours: 72,
    timeline: {
      Requested: '2026-03-11T13:10:00Z',
      Matched: '2026-03-11T13:35:00Z',
      'Inspection Scheduled': '2026-03-11T16:02:00Z',
      Estimated: '2026-03-12T16:02:00Z',
    },
  },
  {
    id: 'JOB-1003',
    customerName: 'Mina Patel',
    propertyType: 'Homeowner',
    serviceType: 'Leak Inspection',
    description: 'Inspection needed for insurance renewal documents.',
    createdAt: '2026-03-08T17:48:00Z',
    status: 'In-Progress',
    priority: 'Low',
    estimateTotal: 450,
    contractorId: 'con-1002',
    contractorName: 'Cedar Ridge Exteriors',
    selectedSlot: 'Thu 2:00 PM',
    address: '82 Harbor Road',
    city: 'South Hill',
    state: 'IL',
    zipCode: '60611',
    inspectionRequired: true,
    paymentStatus: 'Held in escrow',
    disputeWindowHours: 72,
    timeline: {
      Requested: '2026-03-08T17:48:00Z',
      Matched: '2026-03-08T18:10:00Z',
      'Inspection Scheduled': '2026-03-09T09:45:00Z',
      Estimated: '2026-03-09T10:15:00Z',
      Approved: '2026-03-10T14:10:00Z',
      'In-Progress': '2026-03-13T08:45:00Z',
    },
  },
  {
    id: 'JOB-1004',
    customerName: 'Northside Retail Center',
    propertyType: 'Business',
    serviceType: 'Gutter Work',
    description: 'Preventive coating before summer heat wave.',
    createdAt: '2026-02-27T11:30:00Z',
    status: 'Completed',
    priority: 'Medium',
    estimateTotal: 9200,
    contractorId: 'con-1004',
    contractorName: 'Harborline Roofing',
    selectedSlot: 'Fri 1:30 PM',
    address: '700 Market Plaza',
    city: 'Harbor District',
    state: 'IL',
    zipCode: '60605',
    inspectionRequired: false,
    paymentStatus: 'Released',
    disputeWindowHours: 72,
    timeline: {
      Requested: '2026-02-27T11:30:00Z',
      Matched: '2026-02-27T12:00:00Z',
      Estimated: '2026-03-01T09:10:00Z',
      Approved: '2026-03-02T15:40:00Z',
      'In-Progress': '2026-03-04T07:55:00Z',
      Completed: '2026-03-06T16:25:00Z',
      Released: '2026-03-09T16:25:00Z',
    },
  },
]

jobs.forEach((job) => {
  job.lifecycle = buildLifecycleFromTimeline(job.timeline)
  job.paymentStatus = job.paymentStatus || 'Held in escrow'
  job.disputeWindowHours = job.disputeWindowHours || 72
  job.inspectionRequired = job.inspectionRequired ?? requiresInspection(job.serviceType)
})

let nextJobNumber = 1005

function touchLifecycle(job, stage, now) {
  if (!job.lifecycle) {
    job.lifecycle = buildLifecycleFromTimeline(job.timeline)
  }

  switch (stage) {
    case 'Requested':
      job.lifecycle.requestedAt = now
      break
    case 'Matched':
      job.lifecycle.matchedAt = now
      break
    case 'Inspection Scheduled':
      job.lifecycle.inspectionScheduledAt = now
      break
    case 'Estimated':
    case 'Estimate Issued':
      job.lifecycle.estimateIssuedAt = now
      break
    case 'Approved':
      job.lifecycle.approvedAt = now
      break
    case 'In-Progress':
      job.lifecycle.workStartedAt = now
      break
    case 'Completed':
      job.lifecycle.completedAt = now
      break
    case 'Dispute Window':
      job.lifecycle.disputeOpenedAt = now
      break
    case 'Released':
      job.lifecycle.releasedAt = now
      break
    default:
      break
  }
}

export function getJobs() {
  return [...jobs]
}

export function getJobById(jobId) {
  return jobs.find((job) => job.id === jobId)
}

export function createJobRequest(payload) {
  const now = new Date().toISOString()
  const contractor = payload.contractorId ? getContractorById(payload.contractorId) : null
  const inspectionRequired = payload.inspectionRequired ?? requiresInspection(payload.serviceType || payload.projectType)
  const selectedContractorName = payload.contractorName || contractor?.name || ''
  const selectedSlot = payload.selectedSlot || ''
  const uploadedPhotos = Array.isArray(payload.uploadedPhotos) ? payload.uploadedPhotos : []

  const newJob = {
    id: `JOB-${nextJobNumber++}`,
    customerName: payload.customerName || 'Roofing Client',
    propertyType: payload.propertyType || 'Homeowner',
    serviceType: payload.serviceType || payload.projectType || 'Roof Repair',
    description: payload.description || '',
    createdAt: now,
    status: 'Requested',
    priority: payload.priority || 'Medium',
    estimateTotal: payload.estimateTotal === undefined ? null : Number(payload.estimateTotal),
    contactEmail: payload.contactEmail || '',
    contactPhone: payload.contactPhone || '',
    address: payload.address || payload.propertyAddress || '',
    city: payload.city || '',
    state: payload.state || '',
    zipCode: payload.zipCode || '',
    contractorId: contractor?.id || payload.contractorId || '',
    contractorName: selectedContractorName,
    contractorRating: contractor?.rating || null,
    contractorServices: contractor?.services || [],
    contractorPricingRange: contractor?.pricingRange || '',
    selectedSlot,
    uploadedPhotos,
    inspectionRequired,
    paymentStatus: inspectionRequired ? 'Held in escrow' : 'Held in escrow',
    disputeWindowHours: 72,
    timeline: {
      Requested: now,
      ...(selectedContractorName ? { Matched: now } : {}),
      ...(selectedSlot ? { Scheduled: now } : {}),
    },
  }

  newJob.lifecycle = buildLifecycleFromTimeline(newJob.timeline)
  jobs.unshift(newJob)
  return newJob
}

export function updateJobStatus(jobId, newStatus) {
  const job = jobs.find((item) => item.id === jobId)
  if (job) {
    job.status = newStatus
    const now = new Date().toISOString()
    job.timeline[newStatus] = now
    touchLifecycle(job, newStatus, now)

    if (newStatus === 'Completed') {
      job.paymentStatus = 'Released'
      job.lifecycle.releasedAt = job.lifecycle.releasedAt || now
    }
  }

  return job
}

export function updateJob(jobId, payload) {
  const job = jobs.find((item) => item.id === jobId)
  if (!job) {
    return null
  }

  const previousStatus = job.status

  job.customerName = payload.customerName ?? job.customerName
  job.propertyType = payload.propertyType ?? job.propertyType
  job.serviceType = payload.serviceType ?? job.serviceType
  job.description = payload.description ?? job.description
  job.priority = payload.priority ?? job.priority
  job.contactEmail = payload.contactEmail ?? job.contactEmail
  job.contactPhone = payload.contactPhone ?? job.contactPhone
  job.address = payload.address ?? job.address
  job.city = payload.city ?? job.city
  job.state = payload.state ?? job.state
  job.zipCode = payload.zipCode ?? job.zipCode
  job.contractorId = payload.contractorId ?? job.contractorId
  job.contractorName = payload.contractorName ?? job.contractorName
  job.selectedSlot = payload.selectedSlot ?? job.selectedSlot
  job.uploadedPhotos = payload.uploadedPhotos ?? job.uploadedPhotos
  job.inspectionRequired = payload.inspectionRequired ?? job.inspectionRequired
  job.paymentStatus = payload.paymentStatus ?? job.paymentStatus
  job.disputeWindowHours = payload.disputeWindowHours ?? job.disputeWindowHours
  job.status = payload.status ?? job.status
  job.estimateTotal = payload.estimateTotal === null ? null : payload.estimateTotal === undefined ? job.estimateTotal : Number(payload.estimateTotal)

  if (job.contractorId) {
    const contractor = getContractorById(job.contractorId)
    job.contractorName = contractor?.name || job.contractorName
    job.contractorRating = contractor?.rating || job.contractorRating || null
    job.contractorServices = contractor?.services || job.contractorServices || []
    job.contractorPricingRange = contractor?.pricingRange || job.contractorPricingRange || ''
  }

  if (payload.status && payload.status !== previousStatus) {
    const now = new Date().toISOString()
    job.timeline[payload.status] = now
    touchLifecycle(job, payload.status, now)
  }

  job.lifecycle = buildLifecycleFromTimeline(job.timeline)

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
