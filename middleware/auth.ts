export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser()
  if (user.value) return

  // useSupabaseUser() can lag behind the actual session on client-side navigation
  // immediately after sign-in. Fall back to reading the session directly.
  const client = useSupabaseClient()
  const { data: { session } } = await client.auth.getSession()
  if (!session) return navigateTo('/manage/login')
})
