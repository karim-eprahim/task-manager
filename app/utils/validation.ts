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

export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString)
  return !Number.isNaN(date.getTime())
}
