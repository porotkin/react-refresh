import {defineConfig} from 'vite'
// TODO: Remove this plugin
import react from '@vitejs/plugin-react'
import viteBabel from './vitePluginReactBabel.js'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react({
            include: '',
        }),
        [viteBabel],
    ],
})
