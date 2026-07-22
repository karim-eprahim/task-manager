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
    // @ts-ignore
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

  function initializeTasks() {
    const stored = localStorage.getItem('task-manager-store')
    if (stored) {
      appState.value = 'data'
      return
    }

    appState.value = 'loading'

    setTimeout(async () => {
      const initial: TaskFormData[] = [
        { title: 'Review quarterly report', description: 'Compile and review Q3 financial metrics', status: 'in-progress', dueDate: '2026-08-05' },
        { title: 'Update onboarding docs', description: 'Revise the new hire onboarding guide', status: 'pending', dueDate: '2026-08-10' },
        { title: 'Deploy API v2', description: 'Ship the new API version to production', status: 'done', dueDate: '2026-07-28' },
        { title: 'Design sprint planning', description: 'Prepare materials for the upcoming design sprint', status: 'pending', dueDate: '2026-08-12' },
        { title: 'Fix login timeout bug', description: 'Users report session expiry after 5 minutes', status: 'in-progress', dueDate: '2026-08-03' },
      ]

      const created = await Promise.all(initial.map(data => taskService.create(data)))
      tasks.value = created
      appState.value = 'data'
    }, 2000)
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
    initializeTasks,
  }
}, {
  persist: {
    key: 'task-manager-store',
    storage: localStorage,
    pick: ['tasks'],
  },
})
