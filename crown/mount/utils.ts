import type { create_ssr_component } from "svelte/internal";
import CrownComponent from "./CrownComponent.svelte";

// The typings for SSR components is very vague in Svelte
// and we need to cast them this way even though it's awkward
export function patch(
  __component__: ReturnType<typeof create_ssr_component>,
  __module__: string,
  __mode__: string
) {
  if (
    !(CrownComponent as unknown as ReturnType<typeof create_ssr_component>)
      .$$render ||
    !__component__.$$render
  ) {
    console.log({ __component__ });

    throw new Error("Invalid SSR component");
  }

  let render = (
    CrownComponent as unknown as ReturnType<typeof create_ssr_component>
  ).$$render;

  function $$render(
    result: any,
    props: Record<string, any>,
    bindings: any,
    slots: any,
    context: any
  ) {
    return render(
      result,
      { ...props, __module__, __component__, __mode__ },
      bindings,
      slots,
      context
    );
  }

  return { ...CrownComponent, $$render };
}
