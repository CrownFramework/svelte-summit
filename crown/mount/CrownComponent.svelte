<script lang="ts">
  import { nanoid } from "nanoid/non-secure";
  import type { SvelteComponent } from "svelte/internal";
  export let __module__: string;
  export let __component__: typeof SvelteComponent;
  export let __mode__: string;
  export let key = "cr-" + nanoid();
</script>

<crown-component
  id={key}
  data-component={__module__}
  data-mode={__mode__ || undefined}
  data-props={encodeURIComponent(JSON.stringify($$restProps))}
>
  <svelte:component this={__component__} {...$$restProps}>
    <slot />
  </svelte:component>
</crown-component>
