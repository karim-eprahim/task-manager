import type { Task, TaskFormData, TaskFilter, TaskStatus, AppState } from '~/types/task'
import { useTaskStore } from '~/stores/task'

export function useTasks() {
  const store = useTaskStore()

  const toast = useToast()

  const isFormModalOpen = ref(false)
  const editingTask = ref<Task | null>(null)
  const isConfirmDeleteOpen = ref(false)
  const deletingTaskId = ref<string | null>(null)
  const isSubmitting = ref(false)

  const formTitle = computed(() =>
    editingTask.value ? 'Edit Task' : 'Add Task',
  )

  function openAddModal() {
    editingTask.value = null
    isFormModalOpen.value = true
  }

  function openEditModal(task: Task) {
    editingTask.value = task
    isFormModalOpen.value = true
  }

  function closeFormModal() {
    isFormModalOpen.value = false
    editingTask.value = null
  }

  async function handleSubmit(data: TaskFormData) {
    isSubmitting.value = true
    try {
      if (editingTask.value) {
        await store.updateTask(editingTask.value.id, data)
        toast.add({ title: 'Task updated', description: `"${data.title}" updated`, color: 'success' })
      } else {
        await store.addTask(data)
        toast.add({ title: 'Task added', description: `"${data.title}" added`, color: 'success' })
      }
      closeFormModal()
    } catch {
      toast.add({ title: 'Something went wrong', color: 'error' })
    } finally {
      isSubmitting.value = false
    }
  }

  function confirmDelete(taskId: string) {
    deletingTaskId.value = taskId
    isConfirmDeleteOpen.value = true
  }

  function handleDelete() {
    if (deletingTaskId.value) {
      store.deleteTask(deletingTaskId.value)
      toast.add({ title: 'Task deleted', color: 'success' })
    }
    isConfirmDeleteOpen.value = false
    deletingTaskId.value = null
  }

  function handleToggleStatus(taskId: string) {
    store.toggleTaskStatus(taskId)
  }

  function handleFilterChange(newFilter: TaskFilter) {
    store.setFilter(newFilter)
  }

  function handleSearch(query: string) {
    store.setSearchQuery(query)
  }

  function handleSetAppState(state: AppState) {
    store.setAppState(state)
  }

  return {
    store,
    isFormModalOpen,
    editingTask,
    isConfirmDeleteOpen,
    deletingTaskId,
    isSubmitting,
    formTitle,
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
  }
}
