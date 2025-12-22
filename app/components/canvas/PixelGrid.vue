<script setup lang="ts">
import type { Pixel } from '~/composables/usePixelCanvas'
import type { UserPresence } from '~/composables/usePresence'

interface Props {
  pixels: Map<string, Pixel>
  showHeatmap?: boolean
  otherUsers?: Map<string, UserPresence>
}

const props = withDefaults(defineProps<Props>(), {
  showHeatmap: false,
  otherUsers: () => new Map()
})

const emit = defineEmits<{
  paint: [x: number, y: number]
  hover: [x: number, y: number]
  leave: []
}>()

const gridSize = 20

// Generate grid positions
const gridPositions = computed(() => {
  const positions = []
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      positions.push({ x, y })
    }
  }
  return positions
})

// Get pixel data for a position
const getPixelData = (x: number, y: number): Pixel => {
  const key = `${x}-${y}`
  return props.pixels.get(key) || {
    id: 0,
    x,
    y,
    color: '#1a1a2e',
    change_count: 0,
    updated_by: null
  }
}

// Handle pixel click
const handlePixelClick = (x: number, y: number) => {
  emit('paint', x, y)
}

// Handle pixel hover
const handlePixelHover = (x: number, y: number) => {
  emit('hover', x, y)
}

// Handle mouse leave grid
const handleMouseLeave = () => {
  emit('leave')
}

// Get ghost cursor style
const getGhostCursorStyle = (user: UserPresence) => {
  if (user.x < 0 || user.y < 0) return { display: 'none' }
  
  const cellSize = 100 / gridSize // percentage
  return {
    left: `${user.x * cellSize}%`,
    top: `${user.y * cellSize}%`,
    width: `${cellSize}%`,
    height: `${cellSize}%`,
    borderColor: user.color
  }
}
</script>

<template>
  <div 
    class="pixel-grid-container"
    @mouseleave="handleMouseLeave"
  >
    <div class="pixel-grid">
      <CanvasPixelCell
        v-for="pos in gridPositions"
        :key="`${pos.x}-${pos.y}`"
        :x="pos.x"
        :y="pos.y"
        :color="getPixelData(pos.x, pos.y).color"
        :change-count="getPixelData(pos.x, pos.y).change_count"
        :show-heatmap="showHeatmap"
        @click="handlePixelClick"
        @hover="handlePixelHover"
      />

    </div>
    
    <!-- Ghost cursors -->
    <div 
      v-for="[id, user] in otherUsers"
      :key="id"
      class="ghost-cursor"
      :style="getGhostCursorStyle(user)"
    >
      <span class="ghost-cursor-name">{{ user.username }}</span>
    </div>
  </div>
</template>

<style scoped>
.pixel-grid-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
}

.ghost-cursor {
  position: absolute;
  border: 2px solid;
  border-radius: 2px;
  pointer-events: none;
  transition: all 0.1s ease-out;
}
</style>
