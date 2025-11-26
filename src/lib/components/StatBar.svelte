<script lang="ts">
  interface Props {
    label: string;
    current: number;
    max: number;
    color?: string;
  }

  let { label, current, max, color = 'bg-green-500' }: Props = $props();

  const percentage = $derived(Math.max(0, Math.min(100, (current / max) * 100)));
</script>

<div class="mb-2">
  <div class="flex justify-between mb-1 pixel-text text-xs">
    <span>{label}</span>
    <span>{current} / {max}</span>
  </div>
  <div class="stat-bar">
    <div class="stat-bar-fill {color}" style="width: {percentage}%"></div>
  </div>
</div>
