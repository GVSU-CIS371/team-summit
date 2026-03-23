<script setup>
import { computed } from 'vue'
import { useAuth, setDemoRole } from './auth/mockAuth'

const auth = useAuth()

const roleLabel = computed(() => auth.currentUser?.role || 'none')
</script>

<template>
  <div class="app-shell">
    <nav class="navbar navbar-expand-lg border-bottom bg-white sticky-top">
      <div class="container">
        <span class="navbar-brand fw-semibold">Team Summit Roofing</span>
        <div class="d-flex align-items-center gap-2 ms-auto">
          <span class="small text-secondary">Role: {{ roleLabel }}</span>
          <button class="btn btn-sm btn-outline-dark" @click="setDemoRole('contractor')">Contractor</button>
          <button class="btn btn-sm btn-outline-secondary" @click="setDemoRole('client')">Client</button>
        </div>
      </div>
    </nav>

    <RouterView />
  </div>
</template>
