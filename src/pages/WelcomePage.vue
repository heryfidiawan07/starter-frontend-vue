<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Navbar -->
    <header class="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <RouterLink to="/" class="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm">
            <Zap :size="16" class="text-white" />
          </div>
          <span class="font-bold text-gray-900 text-base tracking-tight">StarterApp</span>
        </RouterLink>
        <nav class="flex items-center gap-2">
          <RouterLink to="/login">
            <AppButton variant="ghost" size="sm" :icon="LogIn">Sign In</AppButton>
          </RouterLink>
          <RouterLink to="/register">
            <AppButton size="sm" :icon="UserPlus">Register</AppButton>
          </RouterLink>
        </nav>
      </div>
    </header>

    <!-- Hero -->
    <section class="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-primary-50/60 to-white">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 text-primary-700 text-xs font-medium mb-6">
        <Zap :size="12" />
        Production-ready starter template
      </div>
      <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight max-w-2xl">
        Build faster with a
        <span class="text-primary-600"> consistent API</span> across every backend
      </h1>
      <p class="mt-4 text-base text-gray-500 max-w-xl">
        One frontend. Six backends. Identical API contracts — Golang, Node.js, Java, .NET, Python, and Rust all speak the same language.
      </p>
      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <RouterLink to="/register">
          <AppButton size="lg" :icon="UserPlus">Get Started</AppButton>
        </RouterLink>
        <RouterLink to="/login">
          <AppButton size="lg" variant="outline" :icon="LogIn">Sign In</AppButton>
        </RouterLink>
      </div>

      <!-- Backend badges -->
      <div class="mt-10 flex flex-wrap justify-center gap-2">
        <span
          v-for="b in backends"
          :key="b"
          class="px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-600 shadow-sm"
        >
          {{ b }}
        </span>
      </div>
    </section>

    <!-- Features -->
    <section class="max-w-6xl mx-auto px-6 py-16 w-full">
      <div class="text-center mb-10">
        <h2 class="text-2xl font-bold text-gray-900">Everything you need out of the box</h2>
        <p class="text-sm text-gray-500 mt-2">All features are implemented identically across all backends.</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="flex gap-4 p-5 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-primary-200 transition-all"
        >
          <div class="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
            <component :is="feature.icon" :size="18" class="text-primary-600" />
          </div>
          <div>
            <p class="font-semibold text-sm text-gray-900">{{ feature.title }}</p>
            <p class="text-xs text-gray-500 mt-1 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-primary-600 py-14 px-6 text-center">
      <Lock :size="28" class="text-primary-200 mx-auto mb-4" />
      <h2 class="text-2xl font-bold text-white">Ready to get started?</h2>
      <p class="text-primary-200 mt-2 text-sm">Create your account and explore the admin panel.</p>
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <RouterLink to="/register">
          <AppButton size="lg" variant="secondary" :icon="ArrowRight">Create Account</AppButton>
        </RouterLink>
        <RouterLink to="/login">
          <AppButton size="lg" variant="ghost" class="text-white hover:bg-white/10" :icon="LogIn">Sign In</AppButton>
        </RouterLink>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-gray-100 py-5 px-6 text-center text-xs text-gray-400">
      StarterApp &copy; {{ new Date().getFullYear() }} — Built with Vue 3, Tailwind CSS &amp; Lucide Icons
    </footer>
  </div>
</template>

<script setup lang="ts">
import {
  Zap, LogIn, UserPlus, ShieldCheck, RefreshCw, Globe,
  Database, ArrowRight, Lock, Users, Shield,
} from '@lucide/vue'
import AppButton from '@/components/ui/AppButton.vue'

const backends = ['Golang', 'Node.js', 'Java', '.NET', 'Python', 'Rust']

const features = [
  { icon: ShieldCheck, title: 'JWT Authentication',  description: 'Access & refresh tokens stored in database, fully revocable.' },
  { icon: Globe,       title: 'OAuth 2.0',           description: 'Login with Google or Facebook via raw HTTP — no heavy SDKs.' },
  { icon: Users,       title: 'User Management',     description: 'Full CRUD with photo upload, role assignment, and soft delete.' },
  { icon: Shield,      title: 'Role & Permission',   description: 'Hierarchical permissions (category → menu → action) per role.' },
  { icon: RefreshCw,   title: 'Token Revocation',    description: 'Refresh tokens tracked in DB — logout from any device anytime.' },
  { icon: Database,    title: 'Multi-Database',      description: 'MySQL, PostgreSQL, SQLite, and SQL Server — switch via .env.' },
]
</script>
