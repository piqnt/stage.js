import path from "path";
import Pages from "vite-plugin-pages";

export default {
  define: {
    DEBUG: "false",
  },
  plugins: [
    Pages({
      dirs: "example",
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
