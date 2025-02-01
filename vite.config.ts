import path from "path";
import { defineConfig, normalizePath } from 'vite';
import pagesPlugin from "vite-plugin-pages";
import rollupLicensePlugin from "rollup-plugin-license";
import typescriptPlugin from "vite-plugin-typescript";
import dtsBundleGeneratorPlugin from 'vite-plugin-dts-bundle-generator';

export default defineConfig({
  define: {
  },
  build: {
    lib: {
      entry: normalizePath(path.resolve(__dirname, "src", "index.ts")),
      name: "Stage",
      fileName: "stage",
      formats: ["es", "umd"],
    },
    minify: false,
    sourcemap: true,
  },
  plugins: [
    pagesPlugin({
      dirs: "example",
    }),
    rollupLicensePlugin({
      sourcemap: true,
      banner: getLicense(),
    }) as Plugin,
    // this is used to let ts compile to es5, so that we can use it in planck v1
    typescriptPlugin({
    }),
    dtsBundleGeneratorPlugin({
      fileName: 'stage.d.ts',
    }),
  ],
});

function getLicense() {
  const version = process.env.npm_package_version;
  const year = new Date().getFullYear();
  const license = `
Stage.js v${version ?? "?"}
@copyright Copyright ${year} Ali Shakiba
@license Licensed under the MIT (https://github.com/piqnt/stage.js/blob/main/LICENSE.md)
  `;
  return license;
}