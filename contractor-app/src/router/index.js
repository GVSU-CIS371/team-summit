import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../auth/mockAuth'
import LandingView from '../views/LandingView.vue'
import CreateAccountView from '../views/CreateAccountView.vue'
import HomeView from '../views/HomeView.vue'
import AboutUsView from '../views/AboutUsView.vue'
import QuoteView from '../views/QuoteView.vue'
import AdminLoginView from '../views/AdminLoginView.vue'
import CustomerLoginView from '../views/CustomerLoginView.vue'
import ContractorDashboardView from '../views/ContractorDashboardView.vue'
import ContractorJobDetailView from '../views/ContractorJobDetailView.vue'
import UnauthorizedView from '../views/UnauthorizedView.vue'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingView,
  },
  {
    path: '/create-account',
    name: 'create-account',
    component: CreateAccountView,
  },
  {
    path: '/customer/home',
    name: 'home',
    component: HomeView,
    meta: { requiresRole: 'guest' },
  },
  {
    path: '/customer/about',
    name: 'about-us',
    component: AboutUsView,
    meta: { requiresRole: 'guest' },
  },
  {
    path: '/customer/quote',
    name: 'quote',
    component: QuoteView,
    meta: { requiresRole: 'guest' },
  },
  {
    path: '/admin-login',
    name: 'admin-login',
    component: AdminLoginView,
  },
  {
    path: '/customer-login',
    name: 'customer-login',
    component: CustomerLoginView,
  },
  {
    path: '/contractor',
    name: 'contractor-dashboard',
    component: ContractorDashboardView,
    meta: { requiresRole: 'contractor' },
  },
  {
    path: '/contractor/jobs/:id',
    name: 'contractor-job-detail',
    component: ContractorJobDetailView,
    meta: { requiresRole: 'contractor' },
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: UnauthorizedView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuth()
  const requiredRole = to.meta.requiresRole

  if (!requiredRole) {
    return true
  }

  if (!auth.currentUser || auth.currentUser.role !== requiredRole) {
    if (requiredRole === 'guest') {
      return { name: 'landing' }
    }

    return { name: 'unauthorized' }
  }

  return true
})

export default router
