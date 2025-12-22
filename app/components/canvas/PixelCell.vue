<script setup lang="ts">
interface Props {
  x: number
  y: number
  color: string
  changeCount?: number
  showHeatmap?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  changeCount: 0,
  showHeatmap: false
})

const emit = defineEmits<{
  click: [x: number, y: number]
  hover: [x: number, y: number]
}>()

const justPainted = ref(false)

// Heatmap color based on change count
const heatmapOpacity = computed(() => {
  if (!props.showHeatmap) return 0
  // Max opacity at 50+ changes
  return Math.min(props.changeCount / 50, 1) * 0.7
})

const handleClick = () => {
  justPainted.value = true
  emit('click', props.x, props.y)
  
  setTimeout(() => {
    justPainted.value = false
  }, 300)
}

const handleMouseEnter = () => {
  emit('hover', props.x, props.y)
}
</script>

<template>
  <div
    class="pixel-cell"
    :class="{ 'just-painted': justPainted }"
    :style="{ backgroundColor: color }"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
  >
    <!-- Heatmap overlay -->
    <div
      v-if="showHeatmap && changeCount > 0"
      class="heatmap-indicator"
      :style="{ opacity: heatmapOpacity }"
    />
  </div>
</template>

<style scoped>
.heatmap-indicator {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #ff6b6b, #feca57);
  pointer-events: none;
}
</style>
