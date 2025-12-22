<script setup lang="ts">
import type { CanvasSnapshot } from '~/composables/useCanvasReset'

interface Props {
  open: boolean
  items: CanvasSnapshot[]
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

// Selected item for viewing
const viewingItem = ref<CanvasSnapshot | null>(null)

// Generate canvas from snapshot
const generateCanvas = (snapshot: Record<string, string>, cellSize: number = 20) => {
  if (!import.meta.client) return null
  
  const canvas = document.createElement('canvas')
  const size = 20
  canvas.width = size * cellSize
  canvas.height = size * cellSize
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  
  // Fill background
  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // Draw pixels
  Object.entries(snapshot).forEach(([key, color]) => {
    const [x, y] = key.split('-').map(Number)
    ctx.fillStyle = color
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
  })
  
  return canvas
}

// Generate preview as data URL
const generatePreview = (snapshot: Record<string, string>) => {
  const canvas = generateCanvas(snapshot, 10)
  return canvas?.toDataURL('image/png') || ''
}

// Generate SVG from snapshot
const generateSVG = (snapshot: Record<string, string>) => {
  const size = 20
  const cellSize = 20
  let rects = ''
  
  // Background
  rects += `<rect x="0" y="0" width="${size * cellSize}" height="${size * cellSize}" fill="#1a1a2e"/>`
  
  Object.entries(snapshot).forEach(([key, color]) => {
    const [x, y] = key.split('-').map(Number)
    rects += `<rect x="${x * cellSize}" y="${y * cellSize}" width="${cellSize}" height="${cellSize}" fill="${color}"/>`
  })
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size * cellSize}" height="${size * cellSize}">${rects}</svg>`
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// View item in modal
const viewItem = (item: CanvasSnapshot) => {
  viewingItem.value = item
}

// Close viewer
const closeViewer = () => {
  viewingItem.value = null
}

// Download as PNG
const downloadPNG = () => {
  if (!viewingItem.value) return
  
  const canvas = generateCanvas(viewingItem.value.snapshot, 20)
  if (!canvas) return
  
  const link = document.createElement('a')
  link.download = `pixelparty-${viewingItem.value.id}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

// Download as SVG
const downloadSVG = () => {
  if (!viewingItem.value) return
  
  const svg = generateSVG(viewingItem.value.snapshot)
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.download = `pixelparty-${viewingItem.value.id}.svg`
  link.href = url
  link.click()
  
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div 
    class="gallery-overlay" 
    :class="{ open }"
    @click="emit('close')"
  />
  
  <div class="gallery-panel" :class="{ open }">
    <div class="gallery-header">
      <h2>🖼️ Gallery</h2>
      <button class="gallery-close" @click="emit('close')">✕</button>
    </div>
    
    <div class="gallery-content">
      <div v-if="items.length === 0" class="gallery-empty">
        <p>No saved canvases yet.</p>
        <p style="font-size: 0.75rem; margin-top: 8px;">
          Fill all 400 pixels to save!
        </p>
      </div>
      
      <div v-else class="gallery-grid">
        <div 
          v-for="item in items" 
          :key="item.id"
          class="gallery-item"
          @click="viewItem(item)"
        >
          <img 
            :src="generatePreview(item.snapshot)" 
            :alt="`Canvas from ${formatDate(item.completed_at)}`"
          />
          <div class="gallery-item-date">
            {{ formatDate(item.completed_at) }}
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Image Viewer Modal -->
  <Teleport to="body">
    <div v-if="viewingItem" class="viewer-overlay" @click="closeViewer">
      <div class="viewer-modal" @click.stop>
        <div class="viewer-header">
          <span>{{ formatDate(viewingItem.completed_at) }}</span>
          <button class="gallery-close" @click="closeViewer">✕</button>
        </div>
        
        <div class="viewer-image">
          <img :src="generatePreview(viewingItem.snapshot)" alt="Canvas" />
        </div>
        
        <div class="viewer-actions">
          <button class="btn" @click="downloadPNG">
            📷 Download PNG
          </button>
          <button class="btn" @click="downloadSVG">
            🎨 Download SVG
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.viewer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.viewer-modal {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  overflow: hidden;
}

.viewer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  font-weight: 500;
}

.viewer-image {
  padding: 20px;
  display: flex;
  justify-content: center;
}

.viewer-image img {
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1;
  border-radius: 8px;
  image-rendering: pixelated;
}

.viewer-actions {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
  justify-content: center;
}

.btn {
  padding: 10px 16px;
  background: var(--glass-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.15s ease;
}

.btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--accent);
}
</style>
