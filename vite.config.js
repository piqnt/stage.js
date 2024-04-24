import path from "path";
import Pages from "vite-plugin-pages";
import license from "rollup-plugin-license";

export default {
  define: {
    DEBUG: "false",
  },
  plugins: [
    Pages({
      dirs: "example",
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
    minify: false,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "Stage",
      fileName: "stage",
      formats: ["es", "umd", "cjs"],
    },
  },
};
