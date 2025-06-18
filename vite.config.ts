import react from '@vitejs/plugin-react'; // ← Reactを動かすためのものを追加
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // ↓↓↓ ここに新しい設定を追加しました ↓↓↓
      plugins: [react()],
      base: "/TFWEB/", 

      // ↓↓↓ もともとあった大事な設定は、そのまま残してあります ↓↓↓
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});