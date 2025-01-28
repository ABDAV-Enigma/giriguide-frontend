import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // proxy: {
    //   "/api": {
    //     // target: "http://10.10.102.92:8080",
    //     target: "https://urgently-precious-spider.ngrok-free.app",
    //     changeOrigin: true,
    //   },
    // },
    proxy: {
      "/api": {
<<<<<<< HEAD
        target: "https://urgently-precious-spider.ngrok-free.app",
=======
        target: "http://10.10.102.92:8080",
>>>>>>> dev
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // Menghapus prefix `/api`
      },
    },
  },
});
