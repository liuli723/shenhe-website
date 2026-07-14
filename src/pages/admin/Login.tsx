import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function AdminLogin() {
  const [email, setEmail] = useState('liuli723@163.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    console.log('🔥 点击登录按钮')
    setError(null)
    setLoading(true)

    if (!email || !password) {
      setError('请填写用户名和密码')
      setLoading(false)
      return
    }

    try {
      console.log('📤 发送登录请求:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('❌ 登录错误:', error)
        setError('用户名或密码错误: ' + error.message)
        setLoading(false)
        return
      }

      console.log('✅ 登录成功!', data.user)
      
      // 强制保存 session 到 localStorage
      if (data.session) {
        console.log('📦 保存 session 到 localStorage')
        localStorage.setItem('sb-auth-token', JSON.stringify(data.session))
      }
      
      // 使用 replace 强制跳转并刷新页面
      window.location.replace('/admin/dashboard')
      
    } catch (err) {
      console.error('💥 登录异常:', err)
      setError('登录失败，请检查网络连接')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF6E3] p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#3E3E3E]">登录</h1>
          <p className="text-sm text-gray-500 mt-2">深圳申禾工业科技 · CMS 管理后台</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A843] focus:border-transparent"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A843] focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading) {
                  handleLogin()
                }
              }}
              disabled={loading}
            />
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              ❌ {error}
            </div>
          )}
          
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#D4A843] hover:bg-[#B8922E] text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '登录中...' : '登录'}
          </button>
          
          <div className="text-center text-xs text-gray-400 mt-4">
            提示：按 Enter 键快速登录
          </div>
        </div>
      </div>
    </div>
  )
}