import { defineStore } from 'pinia'
import type { Task, TaskFormData, TaskFilter, TaskStatus, AppState } from '~/types/task'
import { taskService } from '~/services/task.service'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([])
  const filter = ref<TaskFilter>('all')
  const searchQuery = ref('')
  const appState = ref<AppState>('data')

  const stats = computed(() => ({
    all: tasks.value.length,
    pending: tasks.value.filter(t => t.status === 'pending').length,
    'in-progress': tasks.value.filter(t => t.status === 'in-progress').length,
    done: tasks.value.filter(t => t.status === 'done').length,
  }))

  const filteredTasks = computed(() => {
    let result = tasks.value

    if (filter.value !== 'all') {
      result = result.filter(t => t.status === filter.value)
    }

    if (searchQuery.value.trim()) {
      const query = searchQuery.value.trim().toLowerCase()
      result = result.filter(
        t =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query),
      )
    }

    return result
  })

  function setFilter(newFilter: TaskFilter) {
    filter.value = newFilter
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  function setAppState(state: AppState) {
    appState.value = state
  }

  async function addTask(data: TaskFormData) {
    const task = await taskService.create(data)
    tasks.value.unshift(task)
  }

  async function updateTask(id: string, data: TaskFormData) {
    const index = tasks.value.findIndex(t => t.id === id)
    if (index === -1) return
    const updated = await taskService.update(tasks.value[index], data)
    tasks.value[index] = updated
  }

  async function toggleTaskStatus(id: string) {
    const task = tasks.value.find(t => t.id === id)
    if (!task) return

    const nextStatus: Record<TaskStatus, TaskStatus> = {
      pending: 'in-progress',
      'in-progress': 'done',
      done: 'pending',
    }

    const updated = await taskService.updateStatus(task, nextStatus[task.status])
    const index = tasks.value.findIndex(t => t.id === id)
    if (index !== -1) {
      tasks.value[index] = updated
    }
  }

  function deleteTask(id: string) {
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  function seedDemoData() {
    if (tasks.value.length > 0) return

    const demo: TaskFormData[] = [
      { title: 'Design system audit', description: 'Review and audit the current design system components', status: 'in-progress', dueDate: '2026-07-25' },
      { title: 'Client onboarding call', description: 'Prepare for the client onboarding meeting', status: 'pending', dueDate: '2026-07-23' },
      { title: 'Ship invoice module', description: 'Finalize and ship the invoice module to production', status: 'done', dueDate: '2026-07-20' },
      { title: 'Quarterly report draft', description: 'Compile metrics from analytics and finance teams', status: 'pending', dueDate: '2026-07-28' },
      { title: 'Update API documentation', description: 'Document the new API endpoints', status: 'in-progress', dueDate: '2026-07-26' },
      { title: 'Code review sprint 12', description: 'Review pull requests for sprint 12', status: 'done', dueDate: '2026-07-22' },
    ]

    demo.forEach(async (data) => {
      const task = await taskService.create(data)
      tasks.value.push(task)
    })
  }

  return {
    tasks,
    filter,
    searchQuery,
    appState,
    stats,
    filteredTasks,
    setFilter,
    setSearchQuery,
    setAppState,
    addTask,
    updateTask,
    toggleTaskStatus,
    deleteTask,
    seedDemoData,
  }
}, {
  persist: {
    key: 'task-manager-store',
    storage: localStorage,
    pick: ['tasks'],
  },
})
