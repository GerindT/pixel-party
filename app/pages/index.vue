<script setup lang="ts">
// Page metadata
useHead({
  title: 'PixelParty - Collaborative Canvas',
  meta: [
    { name: 'description', content: 'Paint pixels in real-time with players around the world!' }
  ]
})

// Initialize theme
useTheme()

// Canvas state
const { pixels, loading, paintPixel, fillAll } = usePixelCanvas()

// Cooldown
const { canPaint, remainingSeconds, progress, startCooldown } = useCooldown(5000)

// Presence
const { otherUsers, onlineCount, updatePosition, leaveGrid } = usePresence()

// Canvas reset & gallery
const { 
  isResetting, 
  countdown, 
  gallery, 
  galleryOpen, 
  checkComplete, 
  startCountdown,
  performReset,
  toggleGallery 
} = useCanvasReset()

// UI State
const selectedColor = ref('#e94560')
const showHeatmap = ref(false)
const hoveredPixel = ref<{ x: number; y: number } | null>(null)

// Watch for canvas completion
watch(pixels, (newPixels) => {
  if (!isResetting.value && checkComplete(newPixels)) {
    startCountdown()
  }
}, { deep: true })

// Watch countdown to trigger reset at 0
watch(countdown, async (newVal) => {
  if (newVal === 0 && isResetting.value) {
    await performReset(pixels.value)
  }
})

// Handle paint
const handlePaint = async (x: number, y: number) => {
  if (!canPaint.value) return
  
  const result = await paintPixel(x, y, selectedColor.value)
  
  if (result.success) {
    startCooldown()
  }
}

// Handle hover (update presence + show coordinates)
const handleHover = (x: number, y: number) => {
  hoveredPixel.value = { x, y }
  updatePosition(x, y)
}

// Handle mouse leave grid
const handleLeave = () => {
  hoveredPixel.value = null
  leaveGrid()
}

// Toggle heatmap
const toggleHeatmap = () => {
  showHeatmap.value = !showHeatmap.value
}
</script>

<template>
  <div class="main-container">
    <!-- Reset Banner -->
    <UiResetBanner v-if="isResetting" :countdown="countdown" />
    
    <!-- Header -->
    <header class="header">
      <h1>🎨 PixelParty</h1>
      <p>Click to paint • 5s cooldown • Fill all pixels to save!</p>
    </header>

    <!-- Top Bar -->
    <div class="top-bar">
      <UiUserStats
        :online-count="onlineCount"
        :show-heatmap="showHeatmap"
        @toggle-heatmap="toggleHeatmap"
      />
      
      <UiExportButton :pixels="pixels" />
      
      <button class="btn glass-panel" @click="toggleGallery">
        🖼️ Gallery
      </button>
      
      <UiThemeToggle />
      
      <!-- Admin: Fill All for testing -->
      <button class="btn glass-panel" title="Admin: Fill all pixels" @click="fillAll">
        🧪 Fill All
      </button>
    </div>

    <!-- Canvas -->
    <div class="canvas-container">
      <div v-if="loading" class="loading-grid">
        <div class="loading" style="width: 100%; aspect-ratio: 1; border-radius: 12px;" />
      </div>
      
      <CanvasPixelGrid
        v-else
        :pixels="pixels"
        :show-heatmap="showHeatmap"
        :other-users="otherUsers"
        @paint="handlePaint"
        @hover="handleHover"
        @leave="handleLeave"
      />
      
      <!-- Coordinate tooltip -->
      <div 
        v-if="hoveredPixel" 
        class="pixel-coords glass-panel"
      >
        {{ hoveredPixel.x }}, {{ hoveredPixel.y }}
      </div>
    </div>

    <!-- Controls -->
    <div class="controls-panel">
      <UiColorPicker v-model="selectedColor" />
      
      <UiCooldownTimer
        :can-paint="canPaint"
        :remaining-seconds="remainingSeconds"
        :progress="progress"
      />
    </div>
    
    <!-- Gallery Panel -->
    <UiGalleryPanel 
      :open="galleryOpen" 
      :items="gallery"
      @close="toggleGallery"
    />
  </div>
</template>

<style scoped>
.pixel-coords {
  position: absolute;
  bottom: -32px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
}
</style>
