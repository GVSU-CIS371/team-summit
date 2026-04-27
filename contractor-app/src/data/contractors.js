const contractors = [
  {
    id: 'CTR-201',
    name: 'Summit Peak Roofing',
    rating: 4.9,
    reviewCount: 124,
    serviceArea: ['Nashville', 'Franklin', 'Brentwood', '37067', '37211'],
    services: ['Roof Repair', 'Leak Inspection', 'Storm Damage', 'Gutter Work'],
    availability: 'Next-day inspection available',
    pricingRange: '$450 - $6,500',
    photos: [
      'https://images.unsplash.com/photo-1621905252472-e8f3ec9f7660?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    ],
    nextSlots: ['2026-04-28 9:00 AM', '2026-04-28 1:00 PM', '2026-04-29 10:30 AM'],
    autoAcceptServices: ['Leak Inspection', 'Gutter Work'],
  },
  {
    id: 'CTR-202',
    name: 'Blue Ridge Exterior Group',
    rating: 4.7,
    reviewCount: 88,
    serviceArea: ['Nashville', 'Mt Juliet', 'Hermitage', '37076', '37122'],
    services: ['Roof Replacement', 'Replacement Estimate', 'Storm Damage', 'Flashing Repair'],
    availability: 'Open this week',
    pricingRange: '$1,200 - $18,000',
    photos: [
      'https://images.unsplash.com/photo-1605146768851-eda79da39897?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
    ],
    nextSlots: ['2026-04-29 8:30 AM', '2026-04-30 2:00 PM', '2026-05-01 11:00 AM'],
    autoAcceptServices: ['Replacement Estimate'],
  },
  {
    id: 'CTR-203',
    name: 'Heritage Roof & Gutter',
    rating: 4.8,
    reviewCount: 156,
    serviceArea: ['Nashville', 'Murfreesboro', 'Smyrna', '37013', '37129'],
    services: ['Roof Repair', 'Leak Inspection', 'Roof Inspection', 'Gutter Work', 'Storm Damage'],
    availability: 'Same-week appointments',
    pricingRange: '$350 - $9,200',
    photos: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
    ],
    nextSlots: ['2026-04-27 3:30 PM', '2026-04-28 11:30 AM', '2026-04-30 9:30 AM'],
    autoAcceptServices: ['Roof Inspection', 'Leak Inspection'],
  },
]

function normalize(value) {
  return String(value || '').trim().toLowerCase()
}

function isNearby(contractor, location) {
  if (!location) {
    return true
  }

  const value = normalize(location)
  return contractor.serviceArea.some((area) => normalize(area).includes(value) || value.includes(normalize(area)))
}

export function getContractors() {
  return [...contractors]
}

export function getContractorById(contractorId) {
  return contractors.find((contractor) => contractor.id === contractorId) || null
}

export function getNearbyContractors(location, serviceType) {
  return contractors
    .filter((contractor) => isNearby(contractor, location))
    .filter((contractor) => !serviceType || contractor.services.includes(serviceType))
    .sort((a, b) => b.rating - a.rating)
}

export function getContractorSlots(contractorId) {
  const contractor = getContractorById(contractorId)
  if (!contractor) {
    return []
  }

  return [...contractor.nextSlots]
}

export function contractorAutoAccepts(contractorId, serviceType) {
  const contractor = getContractorById(contractorId)
  if (!contractor) {
    return false
  }

  return contractor.autoAcceptServices.includes(serviceType)
}
