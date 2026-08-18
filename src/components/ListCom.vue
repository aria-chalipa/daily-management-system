<script setup>
import { computed } from 'vue'
import { useItemsStore } from '@/stores/items'
import ListItems from './ListItems.vue'

const items = useItemsStore()

const normalizeTask = (task) => {
  if (typeof task === 'string') {
    return {
      task: task.trim(),
      important: false,
      day: 1,
    }
  }

  if (task && typeof task.task === 'string') {
    return {
      task: task.task.trim(),
      important: Boolean(task.important),
      day: Number(task.day || 1),
    }
  }

  return null
}

const groupedItems = computed(() => {
  const groupedMap = new Map()

  items.items.forEach((entry) => {
    const monthNumber = Number(entry.month)

    if (!groupedMap.has(monthNumber)) {
      groupedMap.set(monthNumber, [])
    }

    const tasks = Array.isArray(entry.tasks) ? entry.tasks : []

    tasks.forEach((task) => {
      const normalized = normalizeTask(task)

      if (!normalized || !normalized.task) {
        return
      }

      groupedMap.get(monthNumber).push({
        day: Number(entry.day || normalized.day || 1),
        task: normalized.task,
        important: Boolean(normalized.important),
      })
    })
  })

  return [...groupedMap.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([month, tasks]) => ({
      month,
      tasks: tasks.sort((a, b) => a.day - b.day),
    }))
})
</script>

<template>
  <div class="mx-auto max-w-4xl p-6">
    <div v-if="groupedItems.length" class="flex flex-col gap-4">
      <ListItems
        v-for="entry in groupedItems"
        :key="entry.month"
        :item="{ month: entry.month, tasks: entry.tasks }"
      />
    </div>

    <div
      v-else
      class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500"
    >
      No tasks yet.
    </div>
  </div>
</template>
