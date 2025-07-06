import { defineConfig } from "vite"; 
import react from "@vitejs/plugin-react-swc"; 
import path from "path"; 
import { componentTagger } from "lovable-tagger"; 
 
// https://vitejs.dev/config/ 
export default defineConfig(({ mode }) => ({ 
  base: "/baba-ghanoush-kitchen-helper/", // ✅ السطر اللي يخلّي GitHub Pages يشتغل صح
  server: { 
    host: "::", 
    port: 8080, 
  }, 
  plugins: [ 
    react(), 
    mode === 'development' && 
    componentTagger(), 
  ].filter(Boolean), 
  resolve: { 
    alias: { 
      "@": path.resolve(__dirname, "./src"), 
    }, 
  }, 
}));
