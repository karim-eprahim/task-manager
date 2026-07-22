<script setup lang="ts">
import type { TaskFilter, AppState } from '~/types/task'

defineProps<{
  modelValue: TaskFilter
  searchQuery: string
  appState: AppState
}>()

const emit = defineEmits<{
  'update:modelValue': [value: TaskFilter]
  'update:searchQuery': [value: string]
  'update:appState': [value: AppState]
}>()

const filters: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

</script>

<template>
  <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
    <div class="relative flex-1 w-full sm:max-w-xs">
      <UIcon name="i-lucide-search" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-subtle pointer-events-none" />
      <UInput
        :model-value="searchQuery"
        placeholder="Search tasks..."
        class="w-full pl-9"
        size="lg"
        variant="outline"
        @update:model-value="emit('update:searchQuery', $event)"
      />
    </div>

    <div class="flex items-center gap-1.5 bg-ui-surface rounded-md p-1 border border-ui-border shadow-sm flex-wrap">
      <button
        v-for="f in filters"
        :key="f.value"
        class="px-3 py-1.5 text-sm font-medium rounded-sm transition-all duration-150"
        :class="modelValue === f.value
          ? 'bg-brand-50 text-brand-600'
          : 'text-muted hover:text-text hover:bg-hover'"
        @click="emit('update:modelValue', f.value)"
      >
        {{ f.label }}
      </button>
    </div>
  </div>
</template>
