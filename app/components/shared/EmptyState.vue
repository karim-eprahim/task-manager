<script setup lang="ts">
defineProps<{
  title: string
  description: string
  actionLabel?: string
}>()

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 gap-4">
    <div class="size-16 rounded-[var(--radius-lg)] bg-[var(--color-brand-50)] flex items-center justify-center">
      <UIcon name="i-lucide-clipboard-list" class="size-8 text-[var(--color-brand-500)]" />
    </div>
    <h3 class="text-lg font-semibold">{{ title }}</h3>
    <p class="text-sm text-[var(--color-ui-subtle)] max-w-xs text-center">{{ description }}</p>
    <UButton v-if="actionLabel" :label="actionLabel" color="primary" @click="emit('action')" class="mt-2" />
  </div>
</template>
