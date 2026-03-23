<script setup>
import { reactive, ref } from 'vue'
import { createJobRequest } from '../data/jobs'

const form = reactive({
  customerName: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  propertyType: 'Homeowner',
  serviceType: 'Roof Repair',
  description: '',
})

const submittedJobId = ref('')

function submitRequest() {
  const createdJob = createJobRequest({ ...form })
  submittedJobId.value = createdJob.id

  form.customerName = ''
  form.contactEmail = ''
  form.contactPhone = ''
  form.address = ''
  form.propertyType = 'Homeowner'
  form.serviceType = 'Roof Repair'
  form.description = ''
}
</script>

<template>
  <main class="container py-4 py-lg-5">
    <section class="row g-4 align-items-stretch">
      <div class="col-12 col-lg-5">
        <article class="home-hero card border-0 shadow-sm h-100">
          <div class="card-body p-4 p-lg-5 d-flex flex-column">
            <p class="text-uppercase small fw-semibold mb-2">Roofing Service Requests</p>
            <h1 class="display-6 fw-semibold mb-3">Tell us what your roof needs.</h1>
            <p class="text-secondary mb-4">
              Submit your request and our contractor team will review damage details, create an estimate, and move your job through the full workflow.
            </p>
            <div class="mt-auto">
              <p class="mb-1 fw-semibold">What happens next</p>
              <ol class="small text-secondary mb-0">
                <li>Requested: your form is received.</li>
                <li>Estimated: contractor prepares pricing.</li>
                <li>Approved to Completed: crew schedules and finishes work.</li>
              </ol>
            </div>
          </div>
        </article>
      </div>

      <div class="col-12 col-lg-7">
        <article class="card border-0 shadow-sm">
          <div class="card-body p-4 p-lg-5">
            <h2 class="h4 mb-3">Request Form</h2>

            <div v-if="submittedJobId" class="alert alert-success" role="alert">
              Request submitted successfully. Your tracking ID is <strong>{{ submittedJobId }}</strong>.
            </div>

            <form class="row g-3" @submit.prevent="submitRequest">
              <div class="col-12 col-md-6">
                <label class="form-label" for="customerName">Full name</label>
                <input id="customerName" v-model="form.customerName" class="form-control" required />
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label" for="contactPhone">Phone</label>
                <input id="contactPhone" v-model="form.contactPhone" class="form-control" required />
              </div>

              <div class="col-12">
                <label class="form-label" for="contactEmail">Email</label>
                <input id="contactEmail" v-model="form.contactEmail" class="form-control" type="email" required />
              </div>

              <div class="col-12">
                <label class="form-label" for="address">Property address</label>
                <input id="address" v-model="form.address" class="form-control" required />
              </div>

              <div class="col-12 col-md-4">
                <label class="form-label" for="propertyType">Property type</label>
                <select id="propertyType" v-model="form.propertyType" class="form-select">
                  <option>Homeowner</option>
                  <option>Business</option>
                </select>
              </div>

              <div class="col-12 col-md-8">
                <label class="form-label" for="serviceType">Service needed</label>
                <select id="serviceType" v-model="form.serviceType" class="form-select">
                  <option>Roof Repair</option>
                  <option>Roof Replacement</option>
                  <option>Storm Damage Repair</option>
                  <option>Roof Inspection</option>
                </select>
              </div>

              <div class="col-12">
                <label class="form-label" for="description">Describe damage or request</label>
                <textarea
                  id="description"
                  v-model="form.description"
                  class="form-control"
                  rows="5"
                  required
                ></textarea>
              </div>

              <div class="col-12">
                <button class="btn btn-primary px-4" type="submit">Submit Request</button>
              </div>
            </form>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.home-hero {
  background: linear-gradient(155deg, #fdf3df, #ffffff);
}
</style>
