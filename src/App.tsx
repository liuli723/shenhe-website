import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// ===== 前台页面 =====
import { Layout } from '@/components/layout/Layout'
import { Home } from '@/pages/Home'
import { About } from '@/pages/About'
import { Products } from '@/pages/Products'
import { Advantages } from '@/pages/Advantages'
import { News } from '@/pages/News'
import { NewsDetail } from '@/pages/NewsDetail'
import { Contact } from '@/pages/Contact'

// ===== 后台页面 =====
import { AdminLogin } from '@/pages/admin/Login'
import { AdminDashboard } from '@/pages/admin/Dashboard'
import { AdminNewsManagement } from '@/pages/admin/NewsManagement'
import { AdminNewsForm } from '@/pages/admin/NewsForm'
import { AdminProductsManagement } from '@/pages/admin/ProductsManagement'
import { AdminProductForm } from '@/pages/admin/ProductForm'
import { AdminAdvantagesManagement } from '@/pages/admin/AdvantagesManagement'
import { AdminAdvantageForm } from '@/pages/admin/AdvantageForm'

const queryClient = new QueryClient()

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const location = useLocation()

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      try {
        console.log('🔍 AuthGuard 开始检查 session...')
        const { data: { session } } = await supabase.auth.getSession()
        console.log('🔍 AuthGuard session:', session?.user?.email || '无')
        if (mounted) {
          setUser(session?.user ?? null)
          setLoading(false)
        }
      } catch (error) {
        console.error('AuthGuard 检查失败:', error)
        if (mounted) {
          setUser(null)
          setLoading(false)
        }
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔔 AuthGuard 状态变化:', event, session?.user?.email || '无')
        if (mounted) {
          setUser(session?.user ?? null)
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  console.log(`🛡️ AuthGuard: path=${location.pathname}, loading=${loading}, user=${user?.email || 'null'}`)

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">验证登录状态...</div>
  }

  if (!user) {
    console.log('🚫 AuthGuard: 无用户，重定向到 /admin/login')
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
  }

  console.log('✅ AuthGuard: 用户已登录，渲染子组件')
  return children
}

function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#FDF6E3]">
      <Outlet />
    </div>
  )
}

function App() {
  console.log('🔥🔥🔥 App 组件已渲染！')
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* 前台路由 */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="products" element={<Products />} />
            <Route path="advantages" element={<Advantages />} />
            <Route path="news" element={<News />} />
            <Route path="news/:id" element={<NewsDetail />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* 后台登录 */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* 所有后台页面 */}
          <Route
            path="/admin"
            element={
              <AuthGuard>
                <AdminLayout />
              </AuthGuard>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="news" element={<AdminNewsManagement />} />
            <Route path="news/new" element={<AdminNewsForm />} />
            <Route path="news/edit/:id" element={<AdminNewsForm />} />
            <Route path="products" element={<AdminProductsManagement />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/edit/:id" element={<AdminProductForm />} />
            <Route path="advantages" element={<AdminAdvantagesManagement />} />
            <Route path="advantages/new" element={<AdminAdvantageForm />} />
            <Route path="advantages/edit/:id" element={<AdminAdvantageForm />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App