export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  timestamp: number
}

export const useNotifications = () => {
  const notifications = useState<Notification[]>('notifications', () => [])

  const add = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: Date.now(),
      duration: notification.duration || 5000
    }

    notifications.value.push(newNotification)

    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        remove(id)
      }, newNotification.duration)
    }

    return id
  }

  const remove = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clear = () => {
    notifications.value = []
  }

  const success = (title: string, message: string, duration?: number) => {
    return add({ type: 'success', title, message, duration })
  }

  const error = (title: string, message: string, duration?: number) => {
    return add({ type: 'error', title, message, duration })
  }

  const warning = (title: string, message: string, duration?: number) => {
    return add({ type: 'warning', title, message, duration })
  }

  const info = (title: string, message: string, duration?: number) => {
    return add({ type: 'info', title, message, duration })
  }

  return {
    notifications,
    add,
    remove,
    clear,
    success,
    error,
    warning,
    info
  }
}
