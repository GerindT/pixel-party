export interface CanvasSnapshot {
  id: number
  snapshot: Record<string, string> // key: "x-y", value: color
  completed_at: string
}

export function useCanvasReset() {
  const supabase = useSupabaseClient()
  
  const isResetting = ref(false)
  const countdown = ref(0)
  const gallery = ref<CanvasSnapshot[]>([])
  const galleryOpen = ref(false)
  
  let countdownInterval: ReturnType<typeof setInterval> | null = null
  
  const DEFAULT_COLOR = '#1a1a2e'
  const RESET_COUNTDOWN_SECONDS = 60

  // Check if canvas is complete (all pixels painted)
  const checkComplete = (pixels: Map<string, { color: string }>) => {
    if (pixels.size !== 400) return false
    
    for (const pixel of pixels.values()) {
      if (pixel.color === DEFAULT_COLOR) {
        return false
      }
    }
    return true
  }

  // Start the reset countdown
  const startCountdown = () => {
    if (isResetting.value) return
    
    isResetting.value = true
    countdown.value = RESET_COUNTDOWN_SECONDS
    
    countdownInterval = setInterval(() => {
      countdown.value--
      
      // Just stop the interval at 0, let the watcher in index.vue handle the rest
      if (countdown.value <= 0) {
        if (countdownInterval) {
          clearInterval(countdownInterval)
          countdownInterval = null
        }
      }
    }, 1000)
  }

  // Stop countdown and reset state
  const stopCountdown = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval)
      countdownInterval = null
    }
    isResetting.value = false
    countdown.value = 0
  }

  // Save current canvas to gallery (with duplicate prevention)
  const saveToGallery = async (pixels: Map<string, { color: string }>) => {
    // Check if a save happened in the last 30 seconds (prevent duplicates)
    const thirtySecondsAgo = new Date(Date.now() - 30000).toISOString()
    
    const { data: recentSaves } = await supabase
      .from('canvas_history')
      .select('id')
      .gte('completed_at', thirtySecondsAgo)
      .limit(1)
    
    if (recentSaves && recentSaves.length > 0) {
      console.log('Recent save detected, skipping duplicate')
      return true // Already saved by another user
    }
    
    const snapshot: Record<string, string> = {}
    
    pixels.forEach((pixel, key) => {
      snapshot[key] = pixel.color
    })
    
    console.log('Saving to gallery, snapshot size:', Object.keys(snapshot).length)
    
    const { data, error } = await supabase
      .from('canvas_history')
      .insert({
        snapshot,
        completed_at: new Date().toISOString()
      })
      .select()
    
    if (error) {
      console.error('Failed to save to gallery:', error)
      alert(`Failed to save canvas: ${error.message}`)
      return false
    }
    
    console.log('Saved successfully:', data)
    
    // Refresh gallery
    await fetchGallery()
    return true
  }

  // Reset all pixels to default
  const resetCanvas = async () => {
    const { error } = await supabase
      .from('pixels')
      .update({ color: DEFAULT_COLOR, change_count: 0 })
      .gte('id', 1) // Update all
    
    if (error) {
      console.error('Failed to reset canvas:', error)
      return false
    }
    
    return true
  }

  // Complete reset flow: save snapshot → reset → stop countdown
  const performReset = async (pixels: Map<string, { color: string }>) => {
    const saved = await saveToGallery(pixels)
    if (saved) {
      await resetCanvas()
    }
    stopCountdown()
  }

  // Fetch gallery items
  const fetchGallery = async () => {
    const { data, error } = await supabase
      .from('canvas_history')
      .select('*')
      .order('completed_at', { ascending: false })
      .limit(20)
    
    if (!error && data) {
      gallery.value = data as CanvasSnapshot[]
    }
  }

  // Toggle gallery panel
  const toggleGallery = () => {
    galleryOpen.value = !galleryOpen.value
    if (galleryOpen.value) {
      fetchGallery()
    }
  }

  // Cleanup
  onUnmounted(() => {
    if (countdownInterval) {
      clearInterval(countdownInterval)
    }
  })

  return {
    isResetting,
    countdown,
    gallery,
    galleryOpen,
    checkComplete,
    startCountdown,
    stopCountdown,
    performReset,
    fetchGallery,
    toggleGallery,
    DEFAULT_COLOR
  }
}
