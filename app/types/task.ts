export type TaskStatus = 'pending' | 'in-progress' | 'done'
export type TaskFilter = 'all' | TaskStatus
export type AppState = 'data' | 'loading' | 'empty' | 'error'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  dueDate: string
  createdAt: string
  updatedAt: string
}

export interface TaskFormData {
  title: string
  description: string
  status: TaskStatus
  dueDate: string
}

export interface TaskStats {
  all: number
  pending: number
  'in-progress': number
  done: number
}
