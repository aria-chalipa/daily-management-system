import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const normalizeTask = (task) => {
  if (typeof task === 'string') {
    return { task: task.trim(), important: false, time: '' }
  }

  if (task && typeof task.task === 'string') {
    return {
      task: task.task.trim(),
      important: Boolean(task.important),
      time: task.time ?? '',
    }
  }

  return null
}

const STORAGE_KEY = 'daily-management-items'

export const useItemsStore = defineStore('items', () => {
  const savedItems = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  const items = ref(Array.isArray(savedItems) ? savedItems : [])

  const persistItems = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
  }

  const addItem = (item) => {
    const normalizedItem = {
      ...item,
      tasks: Array.isArray(item.tasks)
        ? item.tasks.map((task) => normalizeTask(task)).filter(Boolean)
        : [],
    }

    items.value.push(normalizedItem)
    persistItems()
  }

  const toggleTaskImportant = (month, day, taskText, important) => {
    items.value.forEach((entry) => {
      if (Number(entry.month) !== Number(month) || Number(entry.day) !== Number(day)) {
        return
      }

      entry.tasks = (Array.isArray(entry.tasks) ? entry.tasks : []).map((task) => {
        const normalized = normalizeTask(task)

        if (!normalized || normalized.task !== taskText) {
          return task
        }

        return {
          ...normalized,
          important: Boolean(important),
        }
      })
    })

    persistItems()
  }

  const updateTask = (month, day, oldTaskText, updates) => {
    items.value.forEach((entry) => {
      if (Number(entry.month) !== Number(month) || Number(entry.day) !== Number(day)) {
        return
      }

      entry.tasks = (Array.isArray(entry.tasks) ? entry.tasks : []).map((task) => {
        const normalized = normalizeTask(task)

        if (!normalized || normalized.task !== oldTaskText) {
          return task
        }

        return {
          ...normalized,
          task: String(updates.task ?? normalized.task).trim(),
          important: updates.important ?? normalized.important,
          time: updates.time ?? normalized.time ?? '',
        }
      })
    })

    persistItems()
  }

  const deleteTask = (month, day, taskText) => {
    items.value.forEach((entry) => {
      if (Number(entry.month) !== Number(month) || Number(entry.day) !== Number(day)) {
        return
      }

      entry.tasks = (Array.isArray(entry.tasks) ? entry.tasks : []).filter((task) => {
        const normalized = normalizeTask(task)
        return !(normalized && normalized.task === taskText)
      })
    })

    persistItems()
  }

  const removeItem = (index) => {
    items.value.splice(index, 1)
    persistItems()
  }

  const itemCount = computed(() => items.value.length)

  return {
    items,
    addItem,
    removeItem,
    toggleTaskImportant,
    updateTask,
    deleteTask,
    itemCount,
  }
})
