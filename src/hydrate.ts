// This refers to a map of paths referring to dynamic imports which is generated at build time
import crownComponents from "$crown/components";

const instances = new WeakMap<HTMLElement, Promise<any>>();

export function lazy() {
  // Attaches an IntersectionObserver to all children of a crown-component to hydrate it only when it becomes visible
  const lazyObserver = new IntersectionObserver((entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target.closest("crown-component");
        if (el) {
          if (!instances.get(el as HTMLElement)) {
            attach(el as HTMLElement, true);
          }
        }
      }
    })
  );

  document
    .querySelectorAll("crown-component[data-mode=lazy]")
    .forEach((el) =>
      el
        .querySelectorAll("*")
        .forEach((childEl) => lazyObserver.observe(childEl))
    );
}

export function hydrate() {
  // Hydrates a server side rendered page by hydrating Svelte components where they are rendered
  document
    .querySelectorAll("crown-component[data-mode=hydrate]")
    .forEach((el) => attach(el as HTMLElement, true));
}

export function attach(el: HTMLElement, hydration: boolean = true) {
  const componentPath = el.dataset.component;

  if (!componentPath) {
    return;
  }

  const componentImport = crownComponents[componentPath];

  if (typeof componentImport === "function") {
    const promise = componentImport();

    let props: Record<string, any>;
    try {
      props = JSON.parse(decodeURIComponent(el.dataset.props || "{}"));
    } catch (e) {
      console.error(`Could not parse props of component "${componentPath}"`);
      return;
    }

    const instance = promise.then(
      ({ default: Component }) =>
        new Component({
          target: el,
          props,
          hydrate: true,
          intro: !hydration,
        })
    );
    instances.set(el, instance);
  } else {
    console.error(`"${componentPath}" is not a valid Crown component`);
  }
}

import type { SvelteComponent } from "svelte";
import { check_outros, group_outros, transition_out } from "svelte/internal";

// Workaround for https://github.com/sveltejs/svelte/issues/4056
const outroAndDestroy = (instance: SvelteComponent) => {
  return new Promise((resolve) => {
    if (instance.$$.fragment && instance.$$.fragment.o) {
      group_outros();
      transition_out(instance.$$.fragment, 0, 0, () => {
        instance.$destroy();
        resolve(true);
      });
      check_outros();
    } else {
      instance.$destroy();
      resolve(false);
    }
  });
};

export function detach(el: HTMLElement) {
  const promise = instances.get(el);
  if (!promise) {
    return;
  }

  promise.then((instance) => outroAndDestroy(instance)).then(() => el.remove());
}

export function update(current: HTMLElement, next: HTMLElement) {
  const promise = instances.get(current);
  if (!promise) {
    return;
  }

  promise.then((instance) =>
    instance.$set(JSON.parse(decodeURIComponent(next.dataset.props || "")))
  );
}
