<script setup>
import { computed, reactive, ref } from 'vue'
import { SERVICE_OPTIONS, createJobRequest, requiresInspection } from '../data/jobs'

const props = defineProps({
  contractor: { type: Object, default: null },
  initialService: { type: String, default: 'Roof Repair' },
  initialSlot: { type: String, default: '' },
})

const emit = defineEmits(['submitted', 'cancel'])

const form = reactive({
  customerName: '',
  contactEmail: '',
  contactPhone: '',
  location: '',
  city: '',
  state: '',
  zipCode: '',
  serviceType: props.initialService || 'Roof Repair',
  propertyType: 'Homeowner',
  preferredTime: 'Morning',
  description: '',
  notes: '',
  selectedSlot: props.initialSlot || (props.contractor?.availability?.[0] ?? ''),
  priority: 'Medium',
  agreeContacted: false,
  confirmAccurate: false,
})

const submitting = ref(false)
const error = ref('')

const slotOptions = computed(() => props.contractor?.availability || [])
const inspectionRequired = computed(() => requiresInspection(form.serviceType))
const canSubmit = computed(() => {
  return (
    form.customerName.trim() &&
    form.contactEmail.trim() &&
    form.location.trim() &&
    form.agreeContacted &&
    form.confirmAccurate &&
    !submitting.value
  )
})

async function submit() {
  if (!canSubmit.value || !props.contractor) {
    return
  }
  submitting.value = true
  error.value = ''
  try {
    const id = await createJobRequest({
      customerName: form.customerName,
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone,
      propertyType: form.propertyType,
      serviceType: form.serviceType,
      description: form.description || form.notes || `${form.serviceType} requested`,
      priority: form.priority,
      address: [form.location, form.city, form.state, form.zipCode].filter(Boolean).join(', '),
      contractorId: props.contractor.id,
      contractorName: props.contractor.name,
      selectedSlot: form.selectedSlot,
      inspectionRequired: inspectionRequired.value,
    })
    emit('submitted', { id, contractor: props.contractor })
  } catch (err) {
    error.value = err?.message || 'Could not submit request. Try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <form class="row g-3" @submit.prevent="submit">
    <div v-if="error" class="col-12">
      <div class="alert alert-danger py-2 mb-0 small">{{ error }}</div>
    </div>

    <div class="col-12 col-md-6">
      <label class="form-label small fw-semibold" for="srf-name">Your name</label>
      <input id="srf-name" v-model="form.customerName" class="form-control form-control-sm" placeholder="Alex Morgan" required />
    </div>
    <div class="col-12 col-md-6">
      <label class="form-label small fw-semibold" for="srf-property">Property type</label>
      <select id="srf-property" v-model="form.propertyType" class="form-select form-select-sm">
        <option>Homeowner</option>
        <option>Business</option>
        <option>Property Manager</option>
      </select>
    </div>

    <div class="col-12 col-md-6">
      <label class="form-label small fw-semibold" for="srf-email">Email</label>
      <input id="srf-email" v-model="form.contactEmail" type="email" class="form-control form-control-sm" placeholder="you@example.com" required />
    </div>
    <div class="col-12 col-md-6">
      <label class="form-label small fw-semibold" for="srf-phone">Phone</label>
      <input id="srf-phone" v-model="form.contactPhone" class="form-control form-control-sm" placeholder="(555) 555-1234" />
    </div>

    <div class="col-12">
      <label class="form-label small fw-semibold" for="srf-location">Property address</label>
      <input id="srf-location" v-model="form.location" class="form-control form-control-sm" placeholder="123 Main St" required />
    </div>
    <div class="col-5">
      <label class="form-label small fw-semibold" for="srf-city">City</label>
      <input id="srf-city" v-model="form.city" class="form-control form-control-sm" />
    </div>
    <div class="col-3">
      <label class="form-label small fw-semibold" for="srf-state">State</label>
      <input id="srf-state" v-model="form.state" maxlength="2" class="form-control form-control-sm" />
    </div>
    <div class="col-4">
      <label class="form-label small fw-semibold" for="srf-zip">ZIP</label>
      <input id="srf-zip" v-model="form.zipCode" class="form-control form-control-sm" />
    </div>

    <div class="col-12 col-md-6">
      <label class="form-label small fw-semibold" for="srf-service">Service</label>
      <select id="srf-service" v-model="form.serviceType" class="form-select form-select-sm">
        <option v-for="service in SERVICE_OPTIONS" :key="service" :value="service">{{ service }}</option>
      </select>
    </div>
    <div class="col-12 col-md-6">
      <label class="form-label small fw-semibold" for="srf-slot">Preferred slot</label>
      <select id="srf-slot" v-model="form.selectedSlot" class="form-select form-select-sm">
        <option v-for="slot in slotOptions" :key="slot" :value="slot">{{ slot }}</option>
        <option v-if="!slotOptions.length" value="">No availability listed</option>
      </select>
    </div>

    <div class="col-12">
      <label class="form-label small fw-semibold" for="srf-desc">Describe the issue</label>
      <textarea id="srf-desc" v-model="form.description" class="form-control form-control-sm" rows="3" placeholder="Leaks near chimney, missing shingles, etc." />
    </div>

    <div class="col-12">
      <div class="form-check small">
        <input id="srf-contact-ok" v-model="form.agreeContacted" type="checkbox" class="form-check-input" required />
        <label class="form-check-label" for="srf-contact-ok">I agree to be contacted by the contractor.</label>
      </div>
      <div class="form-check small">
        <input id="srf-accurate" v-model="form.confirmAccurate" type="checkbox" class="form-check-input" required />
        <label class="form-check-label" for="srf-accurate">I confirm the information above is accurate.</label>
      </div>
    </div>

    <div class="col-12 d-flex justify-content-end gap-2 pt-2">
      <button type="button" class="btn btn-sm btn-outline-secondary" @click="emit('cancel')">Cancel</button>
      <button type="submit" class="btn btn-sm btn-dark px-3" :disabled="!canSubmit">
        <span v-if="submitting">Submitting…</span>
        <span v-else>Submit request</span>
      </button>
    </div>
  </form>
</template>
