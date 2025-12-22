<script setup lang="ts">
import type { Pixel } from '~/composables/usePixelCanvas'

interface Props {
  pixels: Map<string, Pixel>
}

const props = defineProps<Props>()

const exporting = ref(false)
const showMenu = ref(false)

const generateCanvas = () => {
  const canvas = document.createElement('canvas')
  const size = 20
  const cellSize = 20
  canvas.width = size * cellSize
  canvas.height = size * cellSize
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const key = `${x}-${y}`
      const pixel = props.pixels.get(key)
      ctx.fillStyle = pixel?.color || '#1a1a2e'
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
    }
  }
  
  return canvas
}

const generateSVG = () => {
  const size = 20
  const cellSize = 20
  let rects = ''
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const key = `${x}-${y}`
      const pixel = props.pixels.get(key)
      const color = pixel?.color || '#1a1a2e'
      rects += `<rect x="${x * cellSize}" y="${y * cellSize}" width="${cellSize}" height="${cellSize}" fill="${color}"/>`
    }
  }
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size * cellSize}" height="${size * cellSize}">${rects}</svg>`
}

const exportPNG = async () => {
  exporting.value = true
  showMenu.value = false
  
  try {
    const canvas = generateCanvas()
    if (!canvas) return
    
    const link = document.createElement('a')
    const timestamp = new Date().toISOString().slice(0, 10)
    link.download = `pixelparty-${timestamp}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } finally {
    exporting.value = false
  }
}

const exportSVG = () => {
  showMenu.value = false
  
  const svg = generateSVG()
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  const timestamp = new Date().toISOString().slice(0, 10)
  link.download = `pixelparty-${timestamp}.svg`
  link.href = url
  link.click()
  
  URL.revokeObjectURL(url)
}

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

// Close menu when clicking outside
const closeMenu = () => {
  showMenu.value = false
}
</script>

<template>
  <div class="export-wrapper" @mouseleave="closeMenu">
    <button 
      class="btn glass-panel"
      :disabled="exporting"
      @click="toggleMenu"
    >
      <span v-if="exporting">⏳</span>
      <span v-else>💾</span>
      Save
    </button>
    
    <div v-if="showMenu" class="export-menu glass-panel">
      <button class="export-option" @click="exportPNG">
        📷 Save as PNG
      </button>
      <button class="export-option" @click="exportSVG">
        🎨 Save as SVG
      </button>
    </div>
  </div>
</template>

<style scoped>
.export-wrapper {
  position: relative;
}

.export-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  min-width: 140px;
  padding: 4px;
  z-index: 50;
}

.export-option {
  display: block;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 0.8125rem;
  text-align: left;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.15s ease;
}

.export-option:hover {
  background: rgba(255, 255, 255, 0.1);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
