<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { SERVICE_OPTIONS, createJobRequest, requiresInspection } from '../data/jobs'
import { useAuth } from '../auth/mockAuth'

const auth = useAuth()

const props = defineProps({
  contractor: { type: Object, default: null },
  initialService: { type: String, default: 'Roof Repair' },
  initialSlot: { type: String, default: '' },
})

const emit = defineEmits(['submitted', 'cancel'])

const form = reactive({
  customerName: auth.currentUser?.name || '',
  contactEmail: auth.currentUser?.email || '',
  contactPhone: auth.currentUser?.phone || '',
  location: '',
  city: '',
  state: '',
  zipCode: '',
  serviceType: props.initialService || 'Roof Repair',
  propertyType: 'Homeowner',
  description: '',
  notes: '',
  selectedSlot: props.initialSlot || (props.contractor?.availability?.[0] ?? ''),
  customRequestedTime: '',
  priority: 'Medium',
  agreeContacted: false,
  confirmAccurate: false,
})

const submitting = ref(false)
const error = ref('')

const slotOptions = computed(() => props.contractor?.availability || [])
const hasAvailability = computed(() => slotOptions.value.length > 0)
const inspectionRequired = computed(() => requiresInspection(form.serviceType))
const preferredTimeValue = computed(() => {
  if (hasAvailability.value) {
    return form.selectedSlot.trim()
  }

  return form.customRequestedTime.trim()
})
const canSubmit = computed(() => {
  return (
    form.customerName.trim() &&
    form.location.trim() &&
    preferredTimeValue.value &&
    form.agreeContacted &&
    form.confirmAccurate &&
    !submitting.value
  )
})

watch(
  () => auth.currentUser,
  (user) => {
    if (!user) return
    form.customerName = user.name || form.customerName
    form.contactEmail = user.email || form.contactEmail
    form.contactPhone = user.phone || form.contactPhone
  },
  { immediate: true }
)

async function submit() {
  if (!canSubmit.value || !props.contractor) {
    return
  }
  submitting.value = true
  error.value = ''
  try {
    const id = await createJobRequest({
      customerName: form.customerName,
      clientId: auth.currentUser?.uid,
      contactEmail: form.contactEmail || auth.currentUser?.email || '',
      contactPhone: form.contactPhone || auth.currentUser?.phone || '',
      propertyType: form.propertyType,
      serviceType: form.serviceType,
      description: form.description || form.notes || `${form.serviceType} requested`,
      priority: form.priority,
      address: [form.location, form.city, form.state, form.zipCode].filter(Boolean).join(', '),
      contractorId: props.contractor.id,
      contractorName: props.contractor.name,
      selectedSlot: preferredTimeValue.value,
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

    <div class="col-12">
      <div class="contact-summary">
        <p class="small text-uppercase fw-semibold text-secondary mb-1">Using your account details</p>
        <p class="mb-0 fw-semibold">{{ form.customerName || 'Customer' }}</p>
        <p class="small text-secondary mb-0">{{ form.contactEmail || 'No email on file' }}<span v-if="form.contactPhone"> · {{ form.contactPhone }}</span></p>
      </div>
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
      <label class="form-label small fw-semibold" for="srf-slot">
        {{ hasAvailability ? 'Preferred slot' : 'Requested meeting time' }}
      </label>
      <template v-if="hasAvailability">
        <select id="srf-slot" v-model="form.selectedSlot" class="form-select form-select-sm">
          <option v-for="slot in slotOptions" :key="slot" :value="slot">{{ slot }}</option>
        </select>
      </template>
      <template v-else>
        <input
          id="srf-slot"
          v-model="form.customRequestedTime"
          class="form-control form-control-sm"
          placeholder="Enter a time that works for you"
          required
        />
        <p class="small text-secondary mt-1 mb-0">This contractor has no listed availability, so you can propose a custom time.</p>
      </template>
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
      <button type="button" class="btn btn-sm account-btn" @click="emit('cancel')">Cancel</button>
      <button type="submit" class="btn btn-sm customer-btn px-3" :disabled="!canSubmit">
        <span v-if="submitting">Submitting…</span>
        <span v-else>Submit request</span>
      </button>
    </div>
  </form>
</template>

<style scoped>
.contact-summary {
  border: 1px solid #e4e9f0;
  border-radius: 14px;
  background: #f8fafc;
  padding: 0.85rem 1rem;
}
</style>
