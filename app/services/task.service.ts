import type { Task, TaskFormData, TaskStatus } from '~/types/task'

let idCounter = Date.now()

function generateId(): string {
  return `task_${idCounter++}_${Math.random().toString(36).slice(2, 9)}`
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

export const taskService = {
  async create(data: TaskFormData): Promise<Task> {
    const now = new Date().toISOString()
    return {
      id: generateId(),
      title: data.title.trim(),
      description: data.description.trim(),
      status: data.status,
      dueDate: data.dueDate || getTodayDate(),
      createdAt: now,
      updatedAt: now,
    }
  },

  async update(task: Task, data: TaskFormData): Promise<Task> {
    return {
      ...task,
      title: data.title.trim(),
      description: data.description.trim(),
      status: data.status,
      dueDate: data.dueDate || task.dueDate,
      updatedAt: new Date().toISOString(),
    }
  },

  async updateStatus(task: Task, status: TaskStatus): Promise<Task> {
    return {
      ...task,
      status,
      updatedAt: new Date().toISOString(),
    }
  },
}
