import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Public
    {
      path: '/',
      component: () => import('@/pages/WelcomePage.vue'),
    },

    // Guest-only routes
    {
      path: '/login',
      component: () => import('@/pages/auth/LoginPage.vue'),
      meta: { guest: true },
    },
    {
      path: '/register',
      component: () => import('@/pages/auth/RegisterPage.vue'),
      meta: { guest: true },
    },
    {
      path: '/forgot-password',
      component: () => import('@/pages/auth/ForgotPasswordPage.vue'),
      meta: { guest: true },
    },
    {
      path: '/reset-password',
      component: () => import('@/pages/auth/ResetPasswordPage.vue'),
      meta: { guest: true },
    },
    {
      path: '/verify-email',
      component: () => import('@/pages/auth/VerifyEmailPage.vue'),
    },

    // Protected routes
    {
      path: '/dashboard',
      component: () => import('@/pages/dashboard/DashboardPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/users',
      component: () => import('@/pages/users/UsersPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/roles',
      component: () => import('@/pages/roles/RolesPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/permissions',
      component: () => import('@/pages/permissions/PermissionsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      component: () => import('@/pages/profile/ProfilePage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile/password',
      component: () => import('@/pages/profile/ChangePasswordPage.vue'),
      meta: { requiresAuth: true },
    },

    // Error pages
    {
      path: '/403',
      component: () => import('@/pages/errors/ForbiddenPage.vue'),
    },
    {
      path: '/500',
      component: () => import('@/pages/errors/ServerErrorPage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/pages/errors/NotFoundPage.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/login'
  }
  if (to.meta.guest && auth.isAuthenticated) {
    return '/dashboard'
  }
})

export default router
