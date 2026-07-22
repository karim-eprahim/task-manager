<script setup lang="ts">
defineProps<{
  title: string
  description: string
  open: boolean
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
  'update:open': [value: boolean]
}>()
</script>

<template>
  <UModal
    :open="open"
    :title="title"
    :description="description"
    @update:open="emit('update:open', $event)"
  >
    <template #footer>
      <div class="flex gap-2 justify-end">
        <UButton color="neutral" variant="outline" label="Cancel" @click="emit('cancel')" />
        <UButton color="error" label="Delete" @click="emit('confirm')" />
      </div>
    </template>
  </UModal>
</template>
