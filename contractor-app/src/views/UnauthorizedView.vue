<template>
  <main class="container py-5">
    <div class="alert alert-warning shadow-sm" role="alert">
      <h1 class="h4 mb-2">Unauthorized</h1>
      <p class="mb-0">Contractor access is required to view the contractor dashboard.</p>
    </div>
    <div class="d-flex gap-2">
      <RouterLink class="btn btn-dark" to="/contractor-login">Go to contractor login</RouterLink>
      <RouterLink class="btn btn-outline-secondary" to="/">Back to home</RouterLink>
    </div>
  </main>
</template>
