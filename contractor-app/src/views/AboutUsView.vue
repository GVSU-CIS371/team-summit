<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const slides = [
  { title: 'Built on Trust', text: 'Family-owned and serving Chicagoland since 2008.' },
  { title: 'Storm Response, Done Right', text: 'Fast inspections and honest, insurance-friendly estimates.' },
  { title: 'Craftsmanship That Lasts', text: 'Premium materials and certified installers on every job.' },
]

const stats = [
  { value: '2,400+', label: 'Roofs Completed' },
  { value: '18', label: 'Years in Business' },
  { value: '4.9★', label: 'Average Rating' },
]

const current = ref(0)
let timer = null

function go(idx) {
  current.value = (idx + slides.length) % slides.length
  reset()
}

function reset() {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    current.value = (current.value + 1) % slides.length
  }, 5000)
}

onMounted(reset)
onBeforeUnmount(() => timer && clearInterval(timer))
</script>

<template>
  <main class="about">
    <!-- Slideshow -->
    <section class="hero">
      <transition name="fade" mode="out-in">
        <div :key="current" class="hero-content">
          <h1>{{ slides[current].title }}</h1>
          <p>{{ slides[current].text }}</p>
        </div>
      </transition>
      <div class="dots">
        <button
          v-for="(s, i) in slides"
          :key="i"
          class="dot"
          :class="{ active: i === current }"
          @click="go(i)"
          :aria-label="`Slide ${i + 1}`"
        ></button>
      </div>
    </section>

    <!-- About copy -->
    <section class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8 text-center">
          <h2 class="section-title">About Team Summit</h2>
          <p class="lead text-secondary">
            We're a local roofing team focused on simple communication, honest estimates,
            and quality work — from the first inspection to the final cleanup.
          </p>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="container pb-5">
      <div class="row g-3">
        <div v-for="s in stats" :key="s.label" class="col-md-4">
          <div class="stat">
            <div class="stat-value">{{ s.value }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.about {
  background: #f8f9fb;
  min-height: 100%;
}

.hero {
  position: relative;
  background: linear-gradient(135deg, #0f3057 0%, #008891 100%);
  color: #fff;
  padding: 5rem 1.5rem 4rem;
  text-align: center;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.hero-content {
  max-width: 640px;
}

.hero h1 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
}

.hero p {
  font-size: 1.05rem;
  opacity: 0.9;
  margin: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.dots {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 0;
  transition: background 0.2s ease, width 0.3s ease;
}

.dot.active {
  background: #fff;
  width: 24px;
  border-radius: 5px;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f3057;
  margin-bottom: 1rem;
}

.stat {
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #0f3057;
}

.stat-label {
  font-size: 0.875rem;
  color: #6c757d;
  margin-top: 0.25rem;
}
</style>
