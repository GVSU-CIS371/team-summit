<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
const currentSlide = ref(0)
const slides = [
  {
    eyebrow: 'Roof Repair',
    title: 'Fast help when your roof cannot wait.',
    text: 'Report leaks, storm damage, or urgent repairs in a few minutes and keep everything organized in one place.',
    accent: 'Emergency response ready',
    theme: 'slide-warm',
  },
  {
    eyebrow: 'Roof Replacement',
    title: 'Plan larger projects with clear next steps.',
    text: 'Submit replacement details, compare contractor responses, and move from estimate to approval without chasing updates.',
    accent: 'Built for residential and commercial jobs',
    theme: 'slide-cool',
  },
  {
    eyebrow: 'Storm Recovery',
    title: 'Keep inspections, photos, and timing in one request.',
    text: 'Share property details, upload damage photos, and give contractors the context they need before they ever call you.',
    accent: 'Better handoff, fewer delays',
    theme: 'slide-neutral',
  },
  {
    eyebrow: 'Customer Portal',
    title: 'A simple place to submit, review, and track work.',
    text: 'From the first request to quotes and project progress, the portal keeps your roofing job easy to follow.',
    accent: 'Designed for simple communication',
    theme: 'slide-sky',
  },
]

let slideTimer

onMounted(() => {
  slideTimer = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length
  }, 6000)
})

onUnmounted(() => {
  clearInterval(slideTimer)
})
</script>

<template>
  <main class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-8">
        <article class="card border-0 shadow-sm">
          <div class="card-body p-4 p-lg-5 text-center">
            <p class="text-uppercase small fw-semibold mb-2">Team Summit Roofing</p>
            <div class="slideshow-shell mb-4">
              <transition name="fade-slide" mode="out-in">
                <div :key="currentSlide" :class="['slide-card', slides[currentSlide].theme, 'p-4', 'p-lg-5']">
                  <p class="slide-eyebrow small text-uppercase fw-semibold mb-2">{{ slides[currentSlide].eyebrow }}</p>
                  <h1 class="h3 fw-semibold mb-2">{{ slides[currentSlide].title }}</h1>
                  <p class="slide-text mb-3">{{ slides[currentSlide].text }}</p>
                  <div class="slide-accent small fw-semibold">{{ slides[currentSlide].accent }}</div>
                </div>
              </transition>
            </div>
            <div class="slide-indicators justify-content-center">
              <span
                v-for="(slide, index) in slides"
                :key="slide.title"
                :class="['slide-dot', { active: index === currentSlide }]"
              ></span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </main>
</template>

<style scoped>
.slideshow-shell {
  min-height: 240px;
}

.slide-card {
  border-radius: 0.75rem;
  border: 1px solid #dee2e6;
  color: #0f172a;
  min-height: 260px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
}

.slide-eyebrow {
  letter-spacing: 0.08em;
}

.slide-text {
  max-width: 34rem;
  color: #405162;
}

.slide-accent {
  display: inline-flex;
  align-self: flex-start;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(28, 37, 48, 0.12);
}

.slide-warm {
  background: linear-gradient(145deg, #fff1df, #fffaf4);
}

.slide-cool {
  background: linear-gradient(145deg, #e6f2fb, #f8fbff);
}

.slide-neutral {
  background: linear-gradient(145deg, #eef1f4, #fbfcfd);
}

.slide-sky {
  background: linear-gradient(145deg, #e8f7ff, #f7fcff);
}

.slide-indicators {
  display: flex;
  gap: 0.5rem;
}

.slide-dot {
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 50%;
  background: rgba(28, 37, 48, 0.18);
}

.slide-dot.active {
  background: #1c2530;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.35s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
}
</style>
