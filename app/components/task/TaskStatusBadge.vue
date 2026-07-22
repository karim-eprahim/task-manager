<script setup lang="ts">
import type { TaskStatus } from '~/types/task'

const props = defineProps<{
  status: TaskStatus
}>()

const config = computed(() => {
  const map: Record<TaskStatus, { label: string; class: string; icon: string }> = {
    pending: {
      label: 'Pending',
      class: 'bg-amber-50 text-amber-500',
      icon: 'i-lucide-clock',
    },
    'in-progress': {
      label: 'In Progress',
      class: 'bg-sky-50 text-sky-600',
      icon: 'i-lucide-play-circle',
    },
    done: {
      label: 'Done',
      class: 'bg-green-50 text-green-500',
      icon: 'i-lucide-check-circle-2',
    },
  }
  return map[props.status]
})
</script>

<template>
  <span class="inline-flex items-center gap-1 px-2.5 py-1 border text-xs font-medium rounded-full" :class="config.class">
    <UIcon :name="config.icon" class="size-3" />
    {{ config.label }}
  </span>
</template>
