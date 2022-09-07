import { buildIdParser, IdParser } from "./utils";
import { resolve } from "path";
import { normalizePath, ViteDevServer } from "vite";
import type { Plugin } from "vite";

const crownImport = /^\$crown\/(.+)/;
const crownLoad = /^\0\$crown\/(.+)/;
const crownComponentsImport = "$crown/components";
const crownComponentsLoad = `\0${crownComponentsImport}`;
const hydrationImport = /^(hydrate|lazy):(.+\.svelte)(?:=(\w+))?$/;
const hydrationLoad = /^\0(hydrate|lazy):(.+\.svelte)(?:=(\w+))?$/;

function generateCrownComponentsImport(paths: string[]) {
  return {
    code: `
      const components = {
        ${paths.map((path) => `"${path}": () => import("${path}")`).join()}
      };
      export default components;
    `,
  };
}

function generatePatchedComponent(id: string, request: string, mode: string) {
  return {
    code: `
    import Component from "${id}";
    import { patch } from "@crown/jewels/mount/utils.ts";
    export default patch(Component, "${request}", "${mode}")
    `,
  };
}

export default function vitePluginCrown(): Plugin {
  let requestParser: IdParser;
  let ssr: boolean;
  let dev: boolean;
  let server: ViteDevServer;
  const dynamicComponents = new Set<string>();

  return {
    name: "vite-plugin-crown",
    async configResolved(config) {
      requestParser = buildIdParser(config);
      ssr = !!config.build.ssr;
      dev = config.mode === "development";
    },
    async resolveId(id, importer, options) {
      if (id === crownComponentsImport) return crownComponentsLoad;

      const crownMatch = id.match(crownImport);
      if (crownMatch) {
        const [_, mod] = crownMatch;

        if (mod === "navigation") {
          return await this.resolve(
            options.ssr
              ? "@crown/jewels/server/navigation.ts"
              : "@crown/jewels/client/navigation.ts",
            importer,
            { skipSelf: true }
          );
        } else if (mod === "stores") {
          return await this.resolve(
            options.ssr
              ? "@crown/jewels/server/stores/index.ts"
              : "@crown/jewels/client/stores/index.ts",
            importer,
            { skipSelf: true }
          );
        } else if (mod === "env") {
          return await this.resolve(
            options.ssr
              ? "@crown/jewels/server/env.ts"
              : "@crown/jewels/client/env.ts"
          );
        }

        return null;
      }

      if (options.ssr) {
        let matches = id.match(hydrationImport);
        if (matches) {
          const mode = matches[1];
          const realPath = "/src/" + matches[2];
          const args = matches[3] || "";
          const resolution = await this.resolve(realPath, importer, {
            skipSelf: true,
          });

          if (resolution) {
            const path = resolution.id.replace(
              normalizePath(resolve(process.cwd())),
              ""
            );

            if (server) {
              const crownComponents =
                server.moduleGraph.idToModuleMap.get(crownComponentsLoad);

              if (crownComponents) {
                server.moduleGraph.invalidateModule(crownComponents);
              }
            }

            dynamicComponents.add(path);
            return { id: `\0${mode}:${path}${args}` };
          }

          return null;
        }
      } else {
        // On the client side we're already in hydration, so all directives should be ignored
        let matches = id.match(hydrationImport);
        if (matches) {
          const realPath = "/src/" + matches[2];
          const args = matches[3] || "";
          const resolution = await this.resolve(realPath, importer, {
            skipSelf: true,
          });

          if (resolution) {
            return { id: `${resolution.id}${args}` };
          }
        }

        return null;
      }
    },
    async load(id, options) {
      if (id === crownComponentsLoad) {
        // $crown/components is a dynamically generated list of all the components that are imported using a hydration directive
        if (dev || (options && options.ssr)) {
          // In development we use the in-memory array generated on the server
          return generateCrownComponentsImport(Array.from(dynamicComponents));
        } else {
          // In production we rely on the manifest generated when building the server
          const manifest = require(resolve(
            "./dist/server/dynamic-components.json"
          )) as string[];
          return generateCrownComponentsImport(manifest);
        }
      }

      if (options && options.ssr) {
        // patch hydrated components in Crown
        let matches = id.match(hydrationLoad);

        if (matches) {
          const svelteRequest = requestParser(id, options.ssr);
          const [_, mode, realId] = matches;

          return generatePatchedComponent(
            realId,
            svelteRequest?.normalizedFilename
              .slice(1)
              .replace(`${mode}:`, "") || realId,
            mode
          );
        }
      }
    },
    generateBundle(this) {
      if (ssr) {
        this.emitFile({
          fileName: "dynamic-components.json",
          type: "asset",
          source: JSON.stringify(Array.from(dynamicComponents), null, 2),
        });
      }
    },
    configureServer(_server) {
      server = _server;
    },
  };
}
