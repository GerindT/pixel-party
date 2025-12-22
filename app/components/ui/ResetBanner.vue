<script setup lang="ts">
interface Props {
  countdown: number
}

defineProps<Props>()
</script>

<template>
  <div class="reset-banner">
    <span>🎉 Canvas complete! Saving to gallery in</span>
    <span class="countdown">{{ countdown }}s</span>
  </div>
</template>
