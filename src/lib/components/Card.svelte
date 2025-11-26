<script lang="ts">
  interface Props {
    title?: string;
    children: any;
  }

  let { title, children }: Props = $props();
</script>

<div class="pixel-card">
  {#if title}
    <h2 class="text-xl mb-4 text-dark border-b-4 border-dark pb-2 pixel-text">{title}</h2>
  {/if}
  <div class="text-dark">
    {@render children()}
  </div>
</div>
