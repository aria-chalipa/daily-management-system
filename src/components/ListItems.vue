<script setup>
import { computed, ref } from 'vue'
import { useItemsStore } from '@/stores/items'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const items = useItemsStore()
const isEditOpen = ref(false)
const editingTask = ref(null)
const draftTask = ref('')
const draftTime = ref('')

const monthName = computed(() => {
  const monthNumber = Number(props.item.month)

  return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
    new Date(new Date().getFullYear(), monthNumber - 1, 1),
  )
})

const safeTasks = computed(() => {
  if (!Array.isArray(props.item.tasks)) return []

  return props.item.tasks
    .filter((taskItem) => taskItem && taskItem.task && taskItem.task.trim())
    .map((taskItem) => ({
      day: Number(taskItem.day || 1),
      task: taskItem.task.trim(),
      important: Boolean(taskItem.important),
      time: taskItem.time ?? '',
    }))
})

function toggleImportant(taskItem) {
  items.toggleTaskImportant(props.item.month, taskItem.day, taskItem.task, !taskItem.important)
}

function openEditModal(taskItem) {
  editingTask.value = taskItem
  draftTask.value = taskItem.task
  draftTime.value = taskItem.time || ''
  isEditOpen.value = true
}

function closeEditModal() {
  isEditOpen.value = false
  editingTask.value = null
  draftTask.value = ''
  draftTime.value = ''
}

function saveEditedTask() {
  if (!editingTask.value) return

  const nextTask = draftTask.value.trim()

  if (!nextTask) {
    deleteCurrentTask()
    return
  }

  items.updateTask(props.item.month, editingTask.value.day, editingTask.value.task, {
    task: nextTask,
    time: draftTime.value,
  })

  closeEditModal()
}

function deleteCurrentTask() {
  if (!editingTask.value) return

  items.deleteTask(props.item.month, editingTask.value.day, editingTask.value.task)
  closeEditModal()
}
</script>

<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <h3 class="mb-3 text-lg font-semibold text-slate-900">{{ monthName }}</h3>

    <ul v-if="safeTasks.length" class="space-y-3">
      <li
        v-for="(taskItem, index) in safeTasks"
        :key="`${props.item.month}-${taskItem.day}-${index}`"
        class="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm"
      >
        <div class="flex min-w-0 flex-1 items-start gap-3">
          <span class="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500"></span>
          <div class="min-w-0 flex-1">
            <span class="block wrap-break-word">{{ taskItem.task }}</span>
            <span v-if="taskItem.time" class="mt-1 block text-xs font-medium text-slate-500">
              {{ taskItem.time }}
            </span>
          </div>
        </div>

        <div class="flex shrink-0 items-center gap-2">
          <button
            type="button"
            :class="[
              'flex h-8 w-8 items-center justify-center rounded-full border text-base transition hover:opacity-90',
              taskItem.important
                ? 'border-amber-400 bg-amber-500 text-white'
                : 'border-slate-200 bg-slate-100 text-slate-400',
            ]"
            aria-label="Mark as important"
            @click="toggleImportant(taskItem)"
          >
            ★
          </button>

          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-sm text-slate-600 transition hover:bg-slate-100"
            aria-label="Edit task"
            @click="openEditModal(taskItem)"
          >
            ✎
          </button>

          <span class="min-w-12 text-right text-xs font-medium text-slate-500"
            >Day {{ taskItem.day }}</span
          >
        </div>
      </li>
    </ul>

    <p v-else class="text-sm text-slate-500">No tasks added for this month yet.</p>
  </section>

  <div
    v-if="isEditOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
    @click.self="closeEditModal"
  >
    <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-xl font-bold text-slate-900">Edit task</h3>
        <button
          type="button"
          class="rounded-full border border-slate-200 px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
          @click="closeEditModal"
        >
          ✕
        </button>
      </div>

      <label class="mb-4 block text-sm font-medium text-slate-700">
        Task
        <input
          v-model="draftTask"
          type="text"
          class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      <label class="mb-5 block text-sm font-medium text-slate-700">
        Time
        <input
          v-model="draftTime"
          type="time"
          class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      <div class="flex gap-3">
        <button
          type="button"
          class="flex-1 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100"
          @click="deleteCurrentTask"
        >
          Delete
        </button>

        <button
          type="button"
          class="flex-1 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
          @click="saveEditedTask"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>
