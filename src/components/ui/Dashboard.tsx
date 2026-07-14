import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { newsService } from '@/services/news'
import { productService } from '@/services/products'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from '@/components/ui'
import { FileText, Package, Plus } from 'lucide-react'

export function AdminDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [newsCount, setNewsCount] = useState(0)
  const [productCount, setProductCount] = useState(0)
  const [latestNews, setLatestNews] = useState<{ title: string; time: string } | null>(null)
  const [latestProduct, setLatestProduct] = useState<{ name: string; time: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/admin/login')
      return
    }
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      const [news, products] = await Promise.all([
        newsService.getAll(),
        productService.getAll(),
      ])
      setNewsCount(news.length)
      setProductCount(products.length)
      if (news.length > 0) {
        const latest = news[0]
        setLatestNews({ title: latest.title, time: latest.publish_time })
      }
      if (products.length > 0) {
        const latest = products[0]
        setLatestProduct({ name: latest.name, time: latest.created_at })
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="py-20 text-center text-gray-500">加载中...</div>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-[#D4A843] mb-6">数据看板</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-gray-500">新闻总数</p>
              <p className="text-2xl font-bold text-gray-800">{newsCount}</p>
            </div>
            <FileText className="w-8 h-8 text-[#D4A843]" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-gray-500">产品总数</p>
              <p className="text-2xl font-bold text-gray-800">{productCount}</p>
            </div>
            <Package className="w-8 h-8 text-[#D4A843]" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-2">最新动态</p>
            {latestNews && (
              <p className="text-sm text-gray-700">📰 {latestNews.title}</p>
            )}
            {latestProduct && (
              <p className="text-sm text-gray-700">📦 {latestProduct.name}</p>
            )}
            {!latestNews && !latestProduct && (
              <p className="text-sm text-gray-400">暂无动态</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 快捷入口 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/news">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-gray-500">新闻管理</p>
                <p className="text-lg font-semibold text-gray-800">{newsCount} 条</p>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                新增
              </Button>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/products">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-gray-500">产品管理</p>
                <p className="text-lg font-semibold text-gray-800">{productCount} 个</p>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                新增
              </Button>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/advantages">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-gray-500">优势管理</p>
                <p className="text-lg font-semibold text-gray-800">管理</p>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                新增
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}