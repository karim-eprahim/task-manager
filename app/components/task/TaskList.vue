<script setup lang="ts">
import type { Task, TaskFilter, AppState } from '~/types/task'

defineProps<{
  tasks: Task[]
  filter: TaskFilter
  appState: AppState
  searchQuery: string
}>()

const emit = defineEmits<{
  edit: [task: Task]
  delete: [taskId: string]
  toggleStatus: [taskId: string]
  add: []
  retry: []
}>()
</script>

<template>
  <div v-if="appState === 'loading'" class="py-12">
    <LoadingState />
  </div>

  <div v-else-if="appState === 'error'" class="py-12">
    <div class="flex flex-col items-center justify-center gap-4">
      <div class="size-16 rounded-[var(--radius-lg)] bg-[var(--color-red-50)] flex items-center justify-center">
        <UIcon name="i-lucide-alert-circle" class="size-8 text-red-500" />
      </div>
      <h3 class="text-lg font-semibold text-[var(--color-ui-text)]">Something went wrong</h3>
      <UButton color="primary" variant="outline" label="Try Again" @click="emit('retry')" />
    </div>
  </div>

  <div v-else-if="tasks.length === 0 && filter === 'all' && searchQuery.trim() === ''" class="py-12">
    <EmptyState
      title="No tasks yet"
      description="Get started by creating your first task"
      action-label="+ New Task"
      @action="emit('add')"
    />
  </div>

  <div v-else-if="tasks.length === 0" class="py-12">
    <EmptyState
      title="No tasks match this filter"
      description="Try changing the filter or create a new task"
    />
  </div>

  <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <TaskCard
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      @edit="emit('edit', $event)"
      @delete="emit('delete', $event)"
      @toggle-status="emit('toggleStatus', $event)"
    />
  </div>
</template>
