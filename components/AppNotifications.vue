<template>
  <div class="fixed bottom-4 left-4 z-50 flex flex-col gap-2 max-w-md">
    <TransitionGroup name="notification" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'p-4 rounded-lg shadow-lg border-r-4 min-w-[300px] fade-in',
          getNotificationClass(notification.type)
        ]"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <h4 class="font-semibold mb-1">{{ notification.title }}</h4>
            <p class="text-sm opacity-90">{{ notification.message }}</p>
          </div>
          <button
            @click="remove(notification.id)"
            class="text-current opacity-70 hover:opacity-100 transition-opacity"
            aria-label="إغلاق"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
const { notifications, remove } = useNotifications()

const getNotificationClass = (type: string) => {
  const classes = {
    success: 'bg-success/20 border-success text-success',
    error: 'bg-danger/20 border-danger text-danger',
    warning: 'bg-warning/20 border-warning text-warning',
    info: 'bg-primary/20 border-primary text-primary'
  }
  return classes[type as keyof typeof classes] || classes.info
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
