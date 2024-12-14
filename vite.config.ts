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

@copyright Copyright (c) ${year} Ali Shakiba
@license The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
  `;
  return license;
}