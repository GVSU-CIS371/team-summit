export const JOB_STATUSES = [
  'Requested',
  'Estimated',
  'Approved',
  'In-Progress',
  'Completed',
]

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
    timeline: {
      Requested: '2026-03-15T09:24:00Z',
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
    timeline: {
      Requested: '2026-03-11T13:10:00Z',
      Estimated: '2026-03-12T16:02:00Z',
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
    timeline: {
      Requested: '2026-03-08T17:48:00Z',
      Estimated: '2026-03-09T10:15:00Z',
      Approved: '2026-03-10T14:10:00Z',
      'In-Progress': '2026-03-13T08:45:00Z',
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
    timeline: {
      Requested: '2026-02-27T11:30:00Z',
      Estimated: '2026-03-01T09:10:00Z',
      Approved: '2026-03-02T15:40:00Z',
      'In-Progress': '2026-03-04T07:55:00Z',
      Completed: '2026-03-06T16:25:00Z',
    },
  },
]

export function getJobs() {
  return [...jobs]
}

export function getJobById(jobId) {
  return jobs.find((job) => job.id === jobId)
}
