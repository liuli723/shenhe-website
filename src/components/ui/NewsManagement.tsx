import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { newsService } from '@/services/news'
import type { News } from '@/types'
import { formatDateShort } from '@/utils/helpers'
//import { Card, CardContent } from '@/components/ui'
import { Button, Table, TableHeader, TableBody, TableRow, TableHead, Badge, Card, CardContent } from '@/components/ui'
//import { Badge } from '@/components/ui'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { TableCell } from "@/components/ui/table"

export function AdminNewsManagement() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/admin/login')
      return
    }
    fetchNews()
  }, [user])

  const fetchNews = async () => {
    try {
      const data = await newsService.getAll()
      setNews(data)
    } catch (error) {
      console.error('Failed to fetch news:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: 'published' | 'draft') => {
    try {
      await newsService.toggleStatus(id, currentStatus)
      await fetchNews()
    } catch (error) {
      console.error('Failed to toggle status:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确认删除？')) return
    try {
      await newsService.delete(id)
      await fetchNews()
    } catch (error) {
      console.error('Failed to delete news:', error)
    }
  }

  if (loading) {
    return <div className="py-20 text-center text-gray-500">加载中...</div>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#3E3E3E]">新闻管理</h2>
        <Link to="/admin/news/new">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-1" />
            新增
          </Button>
        </Link>
      </div>
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>标题</TableHead>
                <TableHead>发布时间</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {news.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center text-gray-400 py-8">
                    暂无新闻
                  </TableCell>
                </TableRow>
              ) : (
                news.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-gray-800">{item.title}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDateShort(item.publish_time)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'published' ? 'success' : 'default'}>
                        {item.status === 'published' ? '已发布' : '已下架'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/news/edit/${item.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(item.id, item.status)}
                      >
                        {item.status === 'published' ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}