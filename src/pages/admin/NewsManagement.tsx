import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import type { News } from '@/types'
import { formatDateShort } from '@/utils/helpers'

export function AdminNewsManagement() {
  const navigate = useNavigate()
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setNews(data || [])
    } catch (error) {
      console.error('获取新闻失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    try {
      const { error } = await supabase
        .from('news')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      await fetchNews()
    } catch (error) {
      console.error('更新状态失败:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确认删除这条新闻吗？')) return
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchNews()
    } catch (error) {
      console.error('删除失败:', error)
    }
  }

  if (loading) {
    return <div className="py-20 text-center text-gray-500">加载中...</div>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 顶部：标题 + 操作按钮 */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-[#3E3E3E]">📰 新闻管理</h2>
        <div className="flex gap-3">
          <Link to="/admin/news/new">
            <button className="bg-[#D4A843] hover:bg-[#B8922E] text-white px-4 py-2 rounded-lg transition-colors">
              + 新增新闻
            </button>
          </Link>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-[#D4A843] hover:bg-[#B8922E] text-white px-4 py-2 rounded-lg transition-colors"
          >
            📊 返回看板
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">标题</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">发布时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {news.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">暂无新闻，点击右上角新增</td>
              </tr>
            ) : (
              news.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{item.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDateShort(item.publish_time)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.status === 'published' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {item.status === 'published' ? '已发布' : '已下架'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => navigate(`/admin/news/edit/${item.id}`)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleToggleStatus(item.id, item.status)}
                      className="text-yellow-600 hover:text-yellow-800 text-sm"
                    >
                      {item.status === 'published' ? '下架' : '发布'}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}