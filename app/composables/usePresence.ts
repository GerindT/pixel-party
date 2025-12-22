import type { RealtimeChannel } from '@supabase/supabase-js'

export interface UserPresence {
  id: string
  username: string
  x: number
  y: number
  color: string
}

export function usePresence() {
  const supabase = useSupabaseClient()
  
  const otherUsers = ref<Map<string, UserPresence>>(new Map())
  const myId = ref<string>('')
  
  let channel: RealtimeChannel | null = null

  // Generate random username
  const generateUsername = () => {
    const adjectives = ['Swift', 'Pixel', 'Cosmic', 'Neon', 'Cyber', 'Turbo']
    const nouns = ['Painter', 'Artist', 'Ninja', 'Fox', 'Wolf', 'Hawk']
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
    const noun = nouns[Math.floor(Math.random() * nouns.length)]
    return `${adj}${noun}${Math.floor(Math.random() * 100)}`
  }

  // Generate random color for cursor
  const generateCursorColor = () => {
    const colors = ['#e94560', '#6c63ff', '#00d9ff', '#ff6b6b', '#4ecdc4', '#feca57']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const username = ref(generateUsername())
  const cursorColor = ref(generateCursorColor())

  // Initialize presence channel
  const initPresence = () => {
    myId.value = crypto.randomUUID()
    
    channel = supabase.channel('presence-channel', {
      config: {
        presence: {
          key: myId.value
        }
      }
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel?.presenceState() || {}
        const users = new Map<string, UserPresence>()
        
        Object.values(state).forEach((presences: any[]) => {
          presences.forEach((presence) => {
            if (presence.id !== myId.value) {
              users.set(presence.id, presence as UserPresence)
            }
          })
        })
        
        otherUsers.value = users
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel?.track({
            id: myId.value,
            username: username.value,
            x: -1,
            y: -1,
            color: cursorColor.value
          })
        }
      })
  }

  // Update my cursor position
  const updatePosition = async (x: number, y: number) => {
    if (channel) {
      await channel.track({
        id: myId.value,
        username: username.value,
        x,
        y,
        color: cursorColor.value
      })
    }
  }

  // Leave presence (mouse leaves grid)
  const leaveGrid = async () => {
    await updatePosition(-1, -1)
  }

  // Online user count
  const onlineCount = computed(() => otherUsers.value.size + 1)

  // Cleanup
  const cleanup = () => {
    if (channel) {
      supabase.removeChannel(channel)
      channel = null
    }
  }

  onMounted(() => {
    initPresence()
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    otherUsers,
    myId,
    username,
    cursorColor,
    onlineCount,
    updatePosition,
    leaveGrid
  }
}
