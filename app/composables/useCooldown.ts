export function useCooldown(cooldownMs: number = 5000) {
  const lastPaintTime = ref<number>(0)
  const remainingTime = ref<number>(0)
  const canPaint = ref<boolean>(true)
  
  let intervalId: ReturnType<typeof setInterval> | null = null

  const startCooldown = () => {
    lastPaintTime.value = Date.now()
    canPaint.value = false
    remainingTime.value = cooldownMs

    // Clear existing interval
    if (intervalId) {
      clearInterval(intervalId)
    }

    // Update remaining time every 100ms
    intervalId = setInterval(() => {
      const elapsed = Date.now() - lastPaintTime.value
      remainingTime.value = Math.max(0, cooldownMs - elapsed)
      
      if (remainingTime.value <= 0) {
        canPaint.value = true
        if (intervalId) {
          clearInterval(intervalId)
          intervalId = null
        }
      }
    }, 100)
  }

  const progress = computed(() => {
    if (canPaint.value) return 100
    return ((cooldownMs - remainingTime.value) / cooldownMs) * 100
  })

  const remainingSeconds = computed(() => {
    return Math.ceil(remainingTime.value / 1000)
  })

  // Cleanup on unmount
  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId)
    }
  })

  return {
    canPaint,
    remainingTime,
    remainingSeconds,
    progress,
    startCooldown
  }
}
