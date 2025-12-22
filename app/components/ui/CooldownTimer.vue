<script setup lang="ts">
interface Props {
  canPaint: boolean
  remainingSeconds: number
  progress: number
}

const props = defineProps<Props>()

// SVG circle properties
const size = 60
const strokeWidth = 4
const radius = (size - strokeWidth) / 2
const circumference = 2 * Math.PI * radius

const dashOffset = computed(() => {
  return circumference - (props.progress / 100) * circumference
})
</script>

<template>
  <div class="cooldown-timer glass-panel">
    <svg :width="size" :height="size" class="cooldown-circle">
      <!-- Background circle -->
      <circle
        class="cooldown-bg"
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
      />
      <!-- Progress circle -->
      <circle
        class="cooldown-progress"
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    
    <div class="cooldown-text">
      <span v-if="canPaint" class="ready">✓</span>
      <span v-else class="countdown">{{ remainingSeconds }}</span>
    </div>
  </div>
</template>

<style scoped>
.cooldown-timer {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  width: 76px;
  height: 76px;
}

.cooldown-circle {
  transform: rotate(-90deg);
}

.cooldown-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 4;
}

.cooldown-progress {
  fill: none;
  stroke: #e94560;
  stroke-width: 4;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.1s linear;
}

.cooldown-text {
  position: absolute;
  font-size: 1.25rem;
  font-weight: 700;
}

.ready {
  color: #1dd1a1;
}

.countdown {
  color: #e94560;
}
</style>
