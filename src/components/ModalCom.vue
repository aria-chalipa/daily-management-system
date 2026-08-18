<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useItemsStore } from '@/stores/items'

const route = useRoute()
const router = useRouter()
const taskNum = ref(1)
const items = useItemsStore()
const tasks = ref([])

const month = computed(() => Number(route.params.month || new Date().getMonth() + 1))
const day = computed(() => Number(route.params.day || new Date().getDate()))

const dateLabel = computed(() => {
  const date = new Date(new Date().getFullYear(), month.value - 1, day.value)

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
})

function closeModal() {
  const savedTasks = tasks.value
    .filter((task) => task && task.trim())
    .map((task) => ({
      task: task.trim(),
      important: false,
    }))

  items.addItem({
    month: month.value,
    day: day.value,
    tasks: savedTasks,
  })

  router.push('/')
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
    <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-xl font-bold text-slate-900">Daily plan</h2>
        <button
          type="button"
          class="rounded-full border border-slate-200 px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
          @click="closeModal"
        >
          ✕
        </button>
      </div>

      <p class="text-sm font-medium uppercase tracking-wide text-blue-600">Selected date</p>
      <p class="mt-2 text-lg font-semibold text-slate-900">{{ dateLabel }}</p>

      <div class="mt-5 rounded-xl bg-slate-50 p-4" v-for="n in taskNum" :key="n">
        <input
          v-model="tasks[n - 1]"
          type="text"
          placeholder="Add your task or notes for this day."
          class="w-full rounded-lg border border-slate-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="button"
        class="mt-4 mb-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        @click="taskNum++"
      >
        Add Task
      </button>

      <button
        type="button"
        class="mt-5 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
        @click="closeModal"
      >
        Save
      </button>
    </div>
  </div>
</template>
