import path from "path";
import { defineConfig, normalizePath } from 'vite';
import pagesPlugin from "vite-plugin-pages";
import licensePlugin from "rollup-plugin-license";
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
  },
  plugins: [
    pagesPlugin({
      dirs: "example",
    }),
    // this is used to let ts compile to es5, so that we can use it in planck v1
    typescriptPlugin({
    }),
    dtsBundleGeneratorPlugin({
      fileName: 'stage.d.ts',
    }),
    licensePlugin({
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
});
