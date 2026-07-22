<script setup lang="ts">
const {
  store,
  isFormModalOpen,
  editingTask,
  isConfirmDeleteOpen,
  openAddModal,
  openEditModal,
  closeFormModal,
  handleSubmit,
  confirmDelete,
  handleDelete,
  handleToggleStatus,
  handleFilterChange,
  handleSearch,
  handleSetAppState,
} = useTasks()

const { filteredTasks, filter, searchQuery, appState, stats } = storeToRefs(store)

onMounted(() => {
  store.seedDemoData()
})

const statCards = computed(() => [
  {
    label: 'All Tasks',
    value: stats.value.all,
    icon: 'i-lucide-list',
    bg: 'bg-[var(--color-brand-50)]',
    iconColor: 'text-[var(--color-brand-500)]',
  },
  {
    label: 'Pending',
    value: stats.value.pending,
    icon: 'i-lucide-clock',
    bg: 'bg-[var(--color-amber-50)]',
    iconColor: 'text-[var(--color-amber-500)]',
  },
  {
    label: 'In Progress',
    value: stats.value['in-progress'],
    icon: 'i-lucide-play-circle',
    bg: 'bg-[var(--color-sky-50)]',
    iconColor: 'text-[var(--color-sky-600)]',
  },
  {
    label: 'Done',
    value: stats.value.done,
    icon: 'i-lucide-check-circle-2',
    bg: 'bg-[var(--color-green-50)]',
    iconColor: 'text-[var(--color-green-500)]',
  },
])

function handleRetry() {
  handleSetAppState('data')
}

watch(appState, (newState) => {
  if (newState === 'loading') {
    setTimeout(() => {
      handleSetAppState('data')
    }, 1500)
  }
})
</script>

<template>
  <main class="min-h-screen">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <!-- Header -->
      <header class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-md bg-brand-500 flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-check" class="size-5 text-white" />
          </div>
          <div>
            <h1 class="text-lg sm:text-xl font-bold">Task Manager</h1>
            <p class="text-sm text-muted">Manage your daily tasks efficiently</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <UColorModeButton
            variant="outline"
            size="sm"
          />
        </div>
      </header>

      <!-- Stats Cards -->
      <section class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div
          v-for="card in statCards"
          :key="card.label"
          class="card p-4 sm:p-5"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="size-10 rounded-md flex items-center justify-center" :class="card.bg">
              <UIcon :name="card.icon" class="size-5" :class="card.iconColor" />
            </div>
          </div>
          <p class="text-2xl font-bold">{{ card.value }}</p>
          <p class="text-sm text-muted mt-0.5">{{ card.label }}</p>
        </div>
      </section>

      <!-- Controls & Filtering -->
      <section class="mb-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div class="relative flex-1 w-full sm:max-w-xs">
            <UInput
              :model-value="searchQuery"
              icon="i-lucide-search"
              placeholder="Search tasks..."
              class="w-full"
              size="lg"
              variant="outline"
              @update:model-value="handleSearch"
            />
          </div>

          <div class="flex items-center gap-1.5 bg-[var(--color-ui-surface)] rounded-[var(--radius-md)] p-1 border border-[var(--color-ui-border)] shadow-sm flex-wrap">
            <button
              v-for="f in ([
                { value: 'all', label: 'All' },
                { value: 'pending', label: 'Pending' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'done', label: 'Done' },
              ] as const)"
              :key="f.value"
              class="px-3 py-1.5 text-sm font-medium rounded-[var(--radius-sm)] transition-all duration-150"
              :class="filter === f.value
                ? 'bg-[var(--color-brand-50)] text-[var(--color-brand-600)]'
                : 'text-[var(--color-ui-muted)] hover:text-[var(--color-ui-text)] hover:bg-[var(--color-ui-hover)]'"
              @click="handleFilterChange(f.value)"
            >
              {{ f.label }}
            </button>
          </div>

          <UButton
            color="primary"
            size="lg"
            label="+ New Task"
            icon="i-lucide-plus"
            class="shrink-0 ml-auto"
            @click="openAddModal"
          />
        </div>
      </section>

      <!-- Error State -->
      <div v-if="appState === 'error'" class="py-12">
        <div class="flex flex-col items-center justify-center gap-4">
          <div class="size-16 rounded-[var(--radius-lg)] bg-[var(--color-red-50)] flex items-center justify-center">
            <UIcon name="i-lucide-alert-circle" class="size-8 text-red-500" />
          </div>
          <h3 class="text-lg font-semibold">Something went wrong</h3>
          <UButton color="primary" variant="outline" label="Try Again" @click="handleRetry" />
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="appState === 'loading'" class="py-12">
        <div class="flex flex-col items-center justify-center gap-4 py-20">
          <UIcon name="i-lucide-loader-circle" class="size-10 text-[var(--color-brand-500)] animate-spin" />
          <p class="text-[var(--color-ui-subtle)] text-sm">Loading...</p>
        </div>
      </div>

      <!-- Task List -->
      <div v-else-if="filteredTasks.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TaskCard
          v-for="task in filteredTasks"
          :key="task.id"
          :task="task"
          @edit="openEditModal"
          @delete="confirmDelete"
          @toggle-status="handleToggleStatus"
        />
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredTasks.length === 0 && searchQuery.trim() === '' && filter === 'all'" class="py-12">
        <div class="flex flex-col items-center justify-center gap-4 py-16">
          <div class="size-16 rounded-[var(--radius-lg)] bg-[var(--color-brand-50)] flex items-center justify-center">
            <UIcon name="i-lucide-clipboard-list" class="size-8 text-[var(--color-brand-500)]" />
          </div>
          <h3 class="text-lg font-semibold">No tasks yet</h3>
          <p class="text-sm text-[var(--color-ui-subtle)] max-w-xs text-center">Get started by creating your first task</p>
          <UButton color="primary" label="+ New Task" @click="openAddModal" class="mt-2" />
        </div>
      </div>

      <!-- No Filtered Results -->
      <div v-else class="py-12">
        <div class="flex flex-col items-center justify-center gap-4 py-16">
          <div class="size-16 rounded-[var(--radius-lg)] bg-[var(--color-sky-50)] flex items-center justify-center">
            <UIcon name="i-lucide-filter" class="size-8 text-[var(--color-sky-600)]" />
          </div>
          <h3 class="text-lg font-semibold">No tasks match this filter</h3>
          <p class="text-sm text-[var(--color-ui-subtle)] max-w-xs text-center">Try changing the filter or create a new task</p>
        </div>
      </div>

      <!-- Add/Edit Task Modal -->
      <TaskForm
        v-model:open="isFormModalOpen"
        :task="editingTask"
        @close="closeFormModal"
        @submit="handleSubmit"
      />

      <!-- Confirm Delete Dialog -->
      <ConfirmDialog
        :open="isConfirmDeleteOpen"
        title="Delete Task"
        description="Are you sure you want to delete this task?"
        @confirm="handleDelete"
        @cancel="isConfirmDeleteOpen = false"
        @update:open="isConfirmDeleteOpen = $event"
      />
    </div>
  </main>
</template>
