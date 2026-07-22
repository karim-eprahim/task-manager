export function validateTaskTitle(title: string): string | null {
  if (!title.trim()) {
    return 'Title is required'
  }
  if (title.trim().length < 3) {
    return 'Title must be at least 3 characters'
  }
  if (title.trim().length > 100) {
    return 'Title must be less than 100 characters'
  }
  return null
}

export function validateDueDate(dueDate: string): string | null {
  if (!dueDate) {
    return 'Due date is required'
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const selected = new Date(dueDate + 'T00:00:00')

  if (Number.isNaN(selected.getTime())) {
    return 'Invalid date'
  }

  if (selected < today) {
    return 'Due date cannot be in the past'
  }

  return null
}
