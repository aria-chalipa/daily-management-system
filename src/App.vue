<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-800">
    <header class="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <nav class="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <RouterLink to="/" class="text-lg font-bold tracking-tight text-slate-900">
          Daily Manager
        </RouterLink>

        <div class="flex items-center gap-2 text-sm font-medium">
          <RouterLink
            to="/"
            class="rounded-full px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            active-class="bg-slate-900 text-white hover:bg-slate-900 hover:text-white"
          >
            Home
          </RouterLink>
          <RouterLink
            to="/about"
            class="rounded-full px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            active-class="bg-slate-900 text-white hover:bg-slate-900 hover:text-white"
          >
            About
          </RouterLink>
          <RouterLink
            to="/list"
            class="rounded-full px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            active-class="bg-slate-900 text-white hover:bg-slate-900 hover:text-white"
          >
            List
          </RouterLink>
        </div>
      </nav>
    </header>

    <main class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <RouterView />
    </main>
  </div>
</template>
