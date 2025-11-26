<script lang="ts">
  interface Props {
    onclick?: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'danger';
    children: any;
  }

  let { onclick, disabled = false, variant = 'primary', children }: Props = $props();

  const variantClasses = {
    primary: 'bg-primary hover:bg-red-600',
    secondary: 'bg-secondary hover:bg-teal-600',
    danger: 'bg-red-700 hover:bg-red-800',
  };
</script>

<button
  {onclick}
  {disabled}
  class="pixel-button pixel-text {variantClasses[variant]}"
>
  {@render children()}
</button>

<style>
  button {
    transition: all 0.2s ease;
  }
</style>
