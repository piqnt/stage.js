import path from "path";
import { defineConfig, normalizePath } from 'vite';
import Pages from "vite-plugin-pages";
import license from "rollup-plugin-license";
import { vitePluginTypescriptTransform } from "vite-plugin-typescript-transform";
import dtsBundleGenerator from 'vite-plugin-dts-bundle-generator';

export default defineConfig({
  define: {
  },
  plugins: [
    Pages({
      dirs: "example",
    }),
    // this is used to let ts compile to es5, so that we can use it in planck v1
    vitePluginTypescriptTransform({
      enforce: 'pre',
    }),
    dtsBundleGenerator({
      fileName: 'stage.d.ts',
    }),
    license({
      sourcemap: true,
      cwd: process.cwd(),

      banner: {
        commentStyle: "regular",

        content: {
          file: path.join(__dirname, "LICENSE.md"),
          encoding: "utf-8",
        },

        // Optional, may be an object or a function returning an object.
        data() {
          return {
            foo: "foo",
          };
        },
      },
    }),
  ],
  build: {
    lib: {
      entry: normalizePath(path.resolve(__dirname, "src", "index.ts")),
      name: "Stage",
      fileName: "stage",
      formats: ["es", "umd", "cjs"],
    },
    minify: false,
  },
});
