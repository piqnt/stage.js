import path from 'path';
import Pages from 'vite-plugin-pages'

export default {
  define: {
    DEBUG: "true",
  },
  plugins: [
    Pages({
      dirs: 'example',
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'Stage',
      fileName: 'stage',
    }
  }
}
