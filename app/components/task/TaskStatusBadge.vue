<script setup lang="ts">
import type { TaskStatus } from '~/types/task'

const props = defineProps<{
  status: TaskStatus
}>()

const config = computed(() => {
  const map: Record<TaskStatus, { label: string; class: string; icon: string }> = {
    pending: {
      label: 'Pending',
      class: 'bg-[var(--color-amber-50)] text-[var(--color-amber-500)]',
      icon: 'i-lucide-clock',
    },
    'in-progress': {
      label: 'In Progress',
      class: 'bg-[var(--color-sky-50)] text-[var(--color-sky-600)]',
      icon: 'i-lucide-play-circle',
    },
    done: {
      label: 'Done',
      class: 'bg-[var(--color-green-50)] text-[var(--color-green-500)]',
      icon: 'i-lucide-check-circle-2',
    },
  }
  return map[props.status]
})
</script>

<template>
  <span class="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-[var(--radius-full)]" :class="config.class">
    <UIcon :name="config.icon" class="size-3" />
    {{ config.label }}
  </span>
</template>
