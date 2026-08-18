<template>
  <section class="mx-auto max-w-4xl px-6 py-10">
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <p class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
        About this app
      </p>
      <h1 class="text-3xl font-bold text-slate-900">Daily planner for better time management</h1>

      <div class="mt-6 space-y-5 text-base leading-7 text-slate-700">
        <p>
          This application helps you organize your tasks by day and month in one simple place. You
          can choose a date from the calendar, add tasks for that day, and keep everything
          structured without losing track of your schedule.
        </p>

        <p>
          The app is designed for quick planning. Each task belongs to a specific day, and the list
          view groups tasks by month so you can scroll through your upcoming responsibilities more
          easily.
        </p>
      </div>

      <div class="mt-8 grid gap-5 md:grid-cols-2">
        <div class="rounded-2xl bg-slate-50 p-5">
          <h2 class="text-lg font-semibold text-slate-900">How it works</h2>
          <ul class="mt-3 space-y-2 text-sm text-slate-700">
            <li>• Open a date on the calendar.</li>
            <li>• Add one or more tasks in the daily modal.</li>
            <li>• Save the task with its date and details.</li>
            <li>• View all tasks grouped by month in the list.</li>
          </ul>
        </div>

        <div class="rounded-2xl bg-slate-50 p-5">
          <h2 class="text-lg font-semibold text-slate-900">Features included</h2>
          <ul class="mt-3 space-y-2 text-sm text-slate-700">
            <li>• Monthly calendar navigation</li>
            <li>• Daily task creation</li>
            <li>• Task editing and deletion</li>
            <li>• Time selection for each task</li>
            <li>• Important task highlighting with a star</li>
            <li>• Local storage saving in the browser</li>
          </ul>
        </div>
      </div>

      <div class="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <h2 class="text-lg font-semibold text-blue-900">Why this app is useful</h2>
        <p class="mt-2 text-sm leading-6 text-blue-800">
          It keeps your daily routine simple and clear. Instead of writing everything in random
          notes, you can organize your tasks by date, focus on important jobs, and check your plan
          at a glance whenever you need it.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
:deep(*) {
  box-sizing: border-box;
}
</style>
