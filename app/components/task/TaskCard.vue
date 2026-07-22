<script setup lang="ts">
import type { Task } from '~/types/task'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  edit: [task: Task]
  delete: [taskId: string]
  toggleStatus: [taskId: string]
}>()

const isCompleted = computed(() => props.task.status === 'done')

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="card group">
    <div class="p-4 sm:p-5">
      <div class="flex items-start gap-3">
        <button
          class="mt-0.5 shrink-0 size-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
          :class="isCompleted
            ? 'bg-green-500 border-green-500'
            : 'border-ui-border hover:border-brand-500'"
          @click="emit('toggleStatus', task.id)"
        >
          <UIcon
            v-if="isCompleted"
            name="i-lucide-check"
            class="size-3 text-white"
          />
        </button>

        <div class="flex-1 min-w-0">
          <h3
            class="text-sm font-semibold"
            :class="isCompleted ? 'line-through text-subtle' : ''"
          >
            {{ task.title }}
          </h3>
          <p
            v-if="task.description"
            class="text-sm text-subtle mt-1 line-clamp-2"
            :class="isCompleted ? 'line-through' : ''"
          >
            {{ task.description }}
          </p>
        </div>

        <div class="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <UTooltip text="Edit">
            <UButton
              color="neutral"
              variant="outline"
              size="sm"
              icon="i-lucide-pencil"
              @click="emit('edit', task)"
            />
          </UTooltip>
          <UTooltip text="Delete">
            <UButton
              color="error"
              variant="outline"
              size="sm"
              icon="i-lucide-trash-2"
              @click="emit('delete', task.id)"
            />
          </UTooltip>
        </div>
      </div>
    </div>

    <div class="border-t border-ui-border px-4 sm:px-5 py-3 flex items-center justify-between">
      <TaskStatusBadge :status="task.status" />

      <div class="flex items-center gap-1.5 text-xs text-subtle">
        <UIcon name="i-lucide-calendar" class="size-3.5" />
        <span>{{ formatDate(task.dueDate) }}</span>
      </div>
    </div>
  </div>
</template>
