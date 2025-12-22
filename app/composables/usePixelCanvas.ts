import type { RealtimeChannel } from '@supabase/supabase-js'

export interface Pixel {
  id: number
  x: number
  y: number
  color: string
  change_count: number
  updated_by: string | null
}

export function usePixelCanvas() {
  const supabase = useSupabaseClient()
  
  // State
  const pixels = ref<Map<string, Pixel>>(new Map())
  const loading = ref(true)
  const error = ref<string | null>(null)
  
  let channel: RealtimeChannel | null = null

  // Helper to get pixel key
  const getKey = (x: number, y: number) => `${x}-${y}`

  // Fetch initial pixel data
  const fetchPixels = async () => {
    loading.value = true
    error.value = null
    
    const { data, error: fetchError } = await supabase
      .from('pixels')
      .select('*')
      .order('id')
    
    if (fetchError) {
      error.value = fetchError.message
      loading.value = false
      return
    }
    
    // Build pixel map
    const map = new Map<string, Pixel>()
    data?.forEach((pixel: Pixel) => {
      map.set(getKey(pixel.x, pixel.y), pixel)
    })
    pixels.value = map
    loading.value = false
  }

  // Subscribe to realtime updates
  const subscribeToUpdates = () => {
    channel = supabase
      .channel('pixels-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'pixels'
        },
        (payload) => {
          const updated = payload.new as Pixel
          const key = getKey(updated.x, updated.y)
          pixels.value.set(key, updated)
          // Trigger reactivity
          pixels.value = new Map(pixels.value)
        }
      )
      .subscribe()
  }

  // Paint a pixel (optimistic update)
  const paintPixel = async (x: number, y: number, color: string) => {
    const key = getKey(x, y)
    const oldPixel = pixels.value.get(key)
    
    // Optimistic update
    if (oldPixel) {
      pixels.value.set(key, { 
        ...oldPixel, 
        color,
        change_count: oldPixel.change_count + 1 
      })
      pixels.value = new Map(pixels.value)
    }
    
    // Send to database
    const { error: updateError } = await supabase
      .from('pixels')
      .update({ 
        color, 
        change_count: oldPixel ? oldPixel.change_count + 1 : 1 
      })
      .eq('x', x)
      .eq('y', y)
    
    // Revert on error
    if (updateError && oldPixel) {
      pixels.value.set(key, oldPixel)
      pixels.value = new Map(pixels.value)
      return { success: false, error: updateError.message }
    }
    
    return { success: true }
  }

  // Get pixel by coordinates
  const getPixel = (x: number, y: number): Pixel | undefined => {
    return pixels.value.get(getKey(x, y))
  }

  // ADMIN: Fill all pixels with random colors (for testing)
  const fillAll = async () => {
    const colors = ['#e94560', '#ff6b6b', '#feca57', '#48dbfb', '#6c63ff', '#1dd1a1', '#ff9f43', '#ee5a24']
    
    // Update all 400 pixels in database
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 20; x++) {
        const color = colors[Math.floor(Math.random() * colors.length)]
        await supabase
          .from('pixels')
          .update({ color })
          .eq('x', x)
          .eq('y', y)
      }
    }
    
    // Refresh to get updates
    await fetchPixels()
  }

  // Cleanup
  const cleanup = () => {
    if (channel) {
      supabase.removeChannel(channel)
      channel = null
    }
  }

  // Initialize
  onMounted(() => {
    fetchPixels()
    subscribeToUpdates()
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    pixels,
    loading,
    error,
    paintPixel,
    getPixel,
    fetchPixels,
    fillAll
  }
}
