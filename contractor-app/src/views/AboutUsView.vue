<template>
  <main class="about-shell">
    <div class="container py-5">
      <div class="about-card">
        <p class="about-name mb-2">Team Summit Roofing</p>
        <p class="about-copy mb-0">
          We make roofing requests simple: choose a contractor, send the job, and keep the process clear from start to finish.
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.about-shell {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(241, 183, 82, 0.14), transparent 25%),
    radial-gradient(circle at 90% 20%, rgba(16, 103, 160, 0.1), transparent 20%),
    #f2f5f8;
}

.about-card {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 0.25rem;
}

.about-name {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  color: #1c2530;
  margin: 0;
}

.about-copy {
  max-width: 38rem;
  color: #495057;
  font-size: 1.1rem;
  line-height: 1.7;
}
</style>