<script setup lang="ts">
const presetColors = [
  '#e94560', // Red
  '#ff6b6b', // Coral
  '#feca57', // Yellow
  '#48dbfb', // Cyan
  '#6c63ff', // Purple
  '#1dd1a1', // Green
  '#ffffff', // White
  '#1a1a2e', // Dark (eraser)
]

const selectedColor = defineModel<string>({ default: '#e94560' })
const customColor = ref('#e94560')

const selectColor = (color: string) => {
  selectedColor.value = color
  customColor.value = color
}

const onCustomColorChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  customColor.value = target.value
  selectedColor.value = target.value
}
</script>

<template>
  <div class="glass-panel color-picker">
    <!-- Preset colors -->
    <button
      v-for="color in presetColors"
      :key="color"
      class="color-swatch"
      :class="{ active: selectedColor === color }"
      :style="{ backgroundColor: color }"
      :title="color"
      @click="selectColor(color)"
    />
    
    <!-- Custom color picker -->
    <div class="custom-color-wrapper">
      <input 
        type="color" 
        class="custom-color-input"
        :value="customColor"
        title="Pick any color"
        @input="onCustomColorChange"
      />
      <span class="custom-color-label">+</span>
    </div>
  </div>
</template>

<style scoped>
.custom-color-wrapper {
  position: relative;
  width: 32px;
  height: 32px;
}

.custom-color-input {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
  -webkit-appearance: none;
  appearance: none;
}

.custom-color-input::-webkit-color-swatch-wrapper {
  padding: 2px;
}

.custom-color-input::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}

.custom-color-input::-moz-color-swatch {
  border: none;
  border-radius: 4px;
}

.custom-color-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  pointer-events: none;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.custom-color-input:hover {
  border-color: var(--accent);
}
</style>
