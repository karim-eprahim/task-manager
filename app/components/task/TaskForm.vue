<script setup lang="ts">
import type { Task, TaskFormData, TaskStatus } from '~/types/task'
import { validateTaskTitle } from '~/utils/validation'

const props = defineProps<{
  open: boolean
  task?: Task | null
}>()

const emit = defineEmits<{
  close: []
  submit: [data: TaskFormData]
  'update:open': [value: boolean]
}>()

const formData = ref<TaskFormData>({
  title: '',
  description: '',
  status: 'pending',
  dueDate: new Date().toISOString().split('T')[0],
})

const titleError = ref<string | null>(null)

watchEffect(() => {
  if (props.open) {
    if (props.task) {
      formData.value = {
        title: props.task.title,
        description: props.task.description,
        status: props.task.status,
        dueDate: props.task.dueDate,
      }
    } else {
      formData.value = {
        title: '',
        description: '',
        status: 'pending',
        dueDate: new Date().toISOString().split('T')[0],
      }
    }
    titleError.value = null
  }
})

const statusOptions = [
  { label: 'Pending', value: 'pending' as TaskStatus },
  { label: 'In Progress', value: 'in-progress' as TaskStatus },
  { label: 'Done', value: 'done' as TaskStatus },
]

function validate(): boolean {
  titleError.value = validateTaskTitle(formData.value.title)
  return titleError.value === null
}

function handleSubmit() {
  if (!validate()) return
  emit('submit', { ...formData.value })
}

const title = computed(() => props.task ? 'Edit Task' : 'Add Task')
</script>

<template>
  <UModal
    :open="open"
    :title="title"
    @update:open="emit('update:open', $event)"
    :ui="{
      footer: 'flex items-center justify-end gap-2 p-4 sm:px-6',
    }"
  >
    <template #body>
      <div class="space-y-4">
        <UFormField label="Title" :error="titleError" required>
          <UInput
            v-model="formData.title"
            placeholder="Enter task title"
            class="w-full"
            size="lg"
          />
        </UFormField>

        <UFormField label="Description">
          <UTextarea
            v-model="formData.description"
            placeholder="Enter task description (optional)"
            class="w-full"
            :rows="3"
          />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Status">
            <USelect
              v-model="formData.status"
              :items="statusOptions"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Due Date">
            <UInput
              v-model="formData.dueDate"
              type="date"
              class="w-full"
            />
          </UFormField>
        </div>
      </div>
    </template>

    <template #footer>
      <UButton color="neutral" variant="outline" label="Cancel" @click="emit('close')" />
      <UButton color="primary" label="Save" @click="handleSubmit" />
    </template>
  </UModal>
</template>
