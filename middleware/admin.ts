export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, isAdmin } = useAuth()
  
  if (!isAuthenticated.value) {
    return navigateTo({
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    })
  }
  
  if (!isAdmin.value) {
    return navigateTo({
      path: '/',
      query: {
        error: 'unauthorized'
      }
    })
  }
})
