//import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './i18n'  // 确保导入 i18n

console.log('🔥🔥🔥 main.tsx 已执行！')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)