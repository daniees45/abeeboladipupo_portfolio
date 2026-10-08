import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

function staticSpaFallbackPlugin(): Plugin {
  return {
    name: 'static-spa-fallback',
    closeBundle() {
      const outDir = path.resolve(import.meta.dirname, 'dist')
      const indexHtmlPath = path.join(outDir, 'index.html')
      if (!fs.existsSync(indexHtmlPath)) return

      const indexContent = fs.readFileSync(indexHtmlPath, 'utf-8')
      const routes = ['resume', 'projects', 'portal-admin-abeeb']

      const customAdmin = (process.env.VITE_ADMIN_PATH || '').replace(/^\//, '').trim()
      if (customAdmin && !routes.includes(customAdmin)) {
        routes.push(customAdmin)
      }

      for (const route of routes) {
        const routeDir = path.join(outDir, route)
        if (!fs.existsSync(routeDir)) {
          fs.mkdirSync(routeDir, { recursive: true })
        }
        fs.writeFileSync(path.join(routeDir, 'index.html'), indexContent)
      }

      // Also ensure root 404.html matches index.html
      fs.writeFileSync(path.join(outDir, '404.html'), indexContent)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), staticSpaFallbackPlugin()],
})

