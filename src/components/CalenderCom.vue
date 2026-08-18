<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useItemsStore } from '@/stores/items'

const router = useRouter()
const items = useItemsStore()
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const today = new Date()

const selectedDate = ref(new Date(today.getFullYear(), today.getMonth(), today.getDate()))
const currentMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))

const monthLabel = computed(() =>
  new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentMonth.value),
)

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayIndex = firstDayOfMonth.getDay()
  const totalDays = lastDayOfMonth.getDate()
  const prevMonthLastDay = new Date(year, month, 0).getDate()

  const days = []

  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i)
    days.push({
      date,
      isCurrentMonth: false,
      isToday: isSameDate(date, today),
    })
  }

  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, month, day)
    days.push({
      date,
      isCurrentMonth: true,
      isToday: isSameDate(date, today),
    })
  }

  while (days.length % 7 !== 0) {
    const nextDay = days.length - (firstDayIndex + totalDays) + 1
    const date = new Date(year, month + 1, nextDay)
    days.push({
      date,
      isCurrentMonth: false,
      isToday: isSameDate(date, today),
    })
  }

  return days
})

function isSameDate(dateA, dateB) {
  if (!dateA || !dateB) return false

  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  )
}

function changeMonth(offset) {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() + offset,
    1,
  )
}

function selectDay(day) {
  if (!day) return

  const nextDate = new Date(day.getFullYear(), day.getMonth(), day.getDate())
  selectedDate.value = nextDate

  const month = String(nextDate.getMonth() + 1)
  const date = String(nextDate.getDate())

  router.push(`/home/${month}/${date}`)
}

function getCalendarKey(day, index) {
  if (!day?.date) return `empty-${index}`

  return `${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}-${index}`
}

function dayHasTasks(date) {
  if (!date) return false

  const month = date.getMonth() + 1
  const dayNumber = date.getDate()

  return items.items.some((entry) => {
    const matchesDay = Number(entry.day) === dayNumber
    const matchesMonth = Number(entry.month) === month
    const hasTasks = Array.isArray(entry.tasks)
      ? entry.tasks.some((task) => task && task.task && task.task.trim())
      : false

    return matchesDay && matchesMonth && hasTasks
  })
}

const selectedDateLabel = computed(() =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(selectedDate.value),
)
</script>

<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
    <div class="mb-5 flex items-center justify-between gap-3">
      <button
        type="button"
        class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        @click="changeMonth(-1)"
      >
        Prev
      </button>

      <h2 class="text-xl font-bold text-slate-900">{{ monthLabel }}</h2>

      <button
        type="button"
        class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        @click="changeMonth(1)"
      >
        Next
      </button>
    </div>

    <div
      class="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500"
    >
      <div v-for="day in weekDays" :key="day">
        {{ day }}
      </div>
    </div>

    <div class="mt-3 grid grid-cols-7 gap-2">
      <button
        v-for="(day, index) in calendarDays"
        :key="getCalendarKey(day, index)"
        type="button"
        class="flex h-12 items-center justify-center rounded-xl border text-sm font-medium transition"
        :class="[
          day?.isCurrentMonth
            ? 'border-slate-200 text-slate-800 hover:bg-slate-100'
            : 'border-transparent text-slate-300',
          day && isSameDate(day.date, selectedDate)
            ? 'bg-slate-900 text-white hover:bg-slate-800'
            : '',
          day?.isToday && day && !isSameDate(day.date, selectedDate)
            ? 'ring-2 ring-blue-200 ring-offset-1'
            : '',
          day && dayHasTasks(day.date) && !isSameDate(day.date, selectedDate)
            ? 'border-emerald-300 bg-emerald-100 text-emerald-800'
            : '',
        ]"
        @click="selectDay(day?.date)"
      >
        {{ day?.date?.getDate?.() ?? '' }}
      </button>
    </div>

    <div class="mt-5 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
      <span class="font-semibold text-slate-900">Selected:</span>
      {{ selectedDateLabel }}
    </div>
  </section>
</template>
