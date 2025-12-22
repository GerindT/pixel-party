<script setup lang="ts">
const { mode, toggleTheme } = useTheme()

const icon = computed(() => mode.value === 'dark' ? '☀️' : '🌙')
const label = computed(() => mode.value === 'dark' ? 'Light mode' : 'Dark mode')
</script>

<template>
  <button 
    class="btn btn-icon glass-panel" 
    :title="label"
    @click="toggleTheme"
  >
    {{ icon }}
  </button>
</template>
