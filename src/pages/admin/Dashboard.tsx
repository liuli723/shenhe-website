import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export function AdminDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [newsCount, setNewsCount] = useState(0)
  const [productCount, setProductCount] = useState(0)
  const [advantageCount, setAdvantageCount] = useState(0)

  // 获取统计数据
  const fetchStats = async () => {
    try {
      // 获取新闻数量
      const { count: newsCountData } = await supabase
        .from('news')
        .select('*', { count: 'exact', head: true })
      setNewsCount(newsCountData || 0)

      // 获取产品数量
      const { count: productCountData } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
      setProductCount(productCountData || 0)

      // 获取优势数量
      const { count: advantageCountData } = await supabase
        .from('advantages')
        .select('*', { count: 'exact', head: true })
      setAdvantageCount(advantageCountData || 0)
    } catch (error) {
      console.error('获取统计数据失败:', error)
    }
  }

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/admin/login')
        return
      }
      setUser(session.user)
      setLoading(false)
      // 获取统计数据
      await fetchStats()
    }
    checkUser()
  }, [navigate])

  // 手动刷新数据
  const handleRefresh = async () => {
    setLoading(true)
    await fetchStats()
    setLoading(false)
  }

  // 跳转函数
  const goTo = (path: string) => {
    navigate(path)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDF6E3] p-8">
      <div className="max-w-7xl mx-auto">
        {/* 顶部标题 */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#3E3E3E]">数据看板</h1>
            <p className="text-gray-500 mt-1">欢迎回来，{user?.email}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-[#D4A843] hover:bg-[#B8922E] text-white rounded-lg transition-colors"
            >
              🔄 刷新数据
            </button>
            <button
              onClick={async () => {
                await supabase.auth.signOut()
                window.location.href = '/admin/login'
              }}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500">新闻总数</p>
            <p className="text-3xl font-bold text-[#3E3E3E] mt-2">{newsCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500">产品总数</p>
            <p className="text-3xl font-bold text-[#3E3E3E] mt-2">{productCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500">优势总数</p>
            <p className="text-3xl font-bold text-[#3E3E3E] mt-2">{advantageCount}</p>
          </div>
        </div>

        {/* 快捷入口 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
               onClick={() => goTo('/admin/news')}>
            <h3 className="font-semibold text-[#3E3E3E]">📰 新闻管理</h3>
            <p className="text-sm text-gray-500 mt-1">管理企业新闻动态</p>
            <span className="inline-block mt-4 text-[#D4A843] hover:text-[#B8922E] font-medium">
              进入管理 →
            </span>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
               onClick={() => goTo('/admin/products')}>
            <h3 className="font-semibold text-[#3E3E3E]">📦 产品管理</h3>
            <p className="text-sm text-gray-500 mt-1">管理产品中心内容</p>
            <span className="inline-block mt-4 text-[#D4A843] hover:text-[#B8922E] font-medium">
              进入管理 →
            </span>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
               onClick={() => goTo('/admin/advantages')}>
            <h3 className="font-semibold text-[#3E3E3E]">🏆 优势管理</h3>
            <p className="text-sm text-gray-500 mt-1">管理企业优势展示</p>
            <span className="inline-block mt-4 text-[#D4A843] hover:text-[#B8922E] font-medium">
              进入管理 →
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}