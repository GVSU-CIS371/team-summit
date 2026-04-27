import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../auth/mockAuth'
import LandingView from '../views/LandingView.vue'
import CreateAccountView from '../views/CreateAccountView.vue'
import CustomerHomeDashboardView from '../views/CustomerHomeDashboardView.vue'
import AboutUsView from '../views/AboutUsView.vue'
import SubmittedRequestsView from '../views/SubmittedRequestsView.vue'
import AdminLoginView from '../views/AdminLoginView.vue'
import CustomerLoginView from '../views/CustomerLoginView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'
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
    component: CustomerHomeDashboardView,
    meta: { requiresRole: 'guest' },
  },
  {
    path: '/customer/about',
    name: 'about-us',
    component: AboutUsView,
    meta: { publicAccess: true },
  },
  {
    path: '/customer/quote',
    name: 'submitted-requests',
    component: SubmittedRequestsView,
    meta: { requiresRole: 'guest' },
  },
  {
    path: '/contractor-login',
    name: 'contractor-login',
    component: AdminLoginView,
  },
  {
    path: '/admin-login',
    redirect: { name: 'contractor-login' },
  },
  {
    path: '/customer-login',
    name: 'customer-login',
    component: CustomerLoginView,
  },
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: AdminDashboardView,
    meta: { requiresRole: 'admin' },
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

async function waitForAuthReady(auth) {
  if (auth.ready) {
    return
  }

  for (let i = 0; i < 40; i += 1) {
    if (auth.ready) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
}

router.beforeEach(async (to) => {
  const auth = useAuth()
  await waitForAuthReady(auth)
  if (to.meta.publicAccess) {
    return true
  }

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
