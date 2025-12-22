<script setup lang="ts">
interface Props {
  onlineCount: number
  showHeatmap: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  toggleHeatmap: []
}>()
</script>

<template>
  <div class="glass-panel stats-panel">
    <div class="stat-item">
      <span class="stat-dot" />
      <span class="stat-value">{{ onlineCount }}</span>
      <span class="stat-label">online</span>
    </div>
    
    <button 
      class="btn"
      :class="{ active: showHeatmap }"
      @click="emit('toggleHeatmap')"
    >
      🔥 Heatmap
    </button>
  </div>
</template>
