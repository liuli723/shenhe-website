import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { newsService } from '@/services/news'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Button, Input } from '@/components/ui'

export function AdminNewsForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    cover_image: '',
    publish_time: new Date().toISOString().slice(0, 16),
    status: 'draft' as 'published' | 'draft',
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    if (!user) {
      navigate('/admin/login')
      return
    }
    if (isEdit) {
      fetchNews()
    }
  }, [user, id])

  const fetchNews = async () => {
    if (!id) return
    try {
      const data = await newsService.getById(id)
      if (data) {
        setFormData({
          title: data.title,
          summary: data.summary,
          content: data.content,
          cover_image: data.cover_image || '',
          publish_time: data.publish_time.slice(0, 16),
          status: data.status,
        })
      }
    } catch (error) {
      console.error('Failed to fetch news:', error)
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.summary || !formData.content || !formData.publish_time) {
      alert('请填写完整信息')
      return
    }

    setLoading(true)
    try {
      if (isEdit && id) {
        await newsService.update(id, {
          title: formData.title,
          summary: formData.summary,
          content: formData.content,
          cover_image: formData.cover_image || null,
          publish_time: formData.publish_time,
          status: formData.status,
        })
      } else {
        await newsService.create({
          title: formData.title,
          summary: formData.summary,
          content: formData.content,
          cover_image: formData.cover_image || null,
          publish_time: formData.publish_time,
          status: formData.status,
        })
      }
      navigate('/admin/news')
    } catch (error) {
      console.error('Failed to save news:', error)
      alert('保存失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = fileName

    try {
      const { error } = await supabase.storage
        .from('news-covers')
        .upload(filePath, file)

      if (error) throw error

      setFormData({ ...formData, cover_image: filePath })
      alert('图片上传成功')
    } catch (error) {
      console.error('Upload failed:', error)
      alert('图片上传失败，请重试')
    }
  }

  if (fetching) {
    return <div className="py-20 text-center text-gray-500">加载中...</div>
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-[#3E3E3E]">{isEdit ? '编辑新闻' : '新增新闻'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="标题 *"
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
              placeholder="标题"
              required
            />
            <Input
              label="摘要 *"
              value={formData.summary}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="摘要"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">正文 *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="正文"
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A843] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">封面图</label>
              <div className="flex gap-2">
                <Input
                  value={formData.cover_image}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, cover_image: e.target.value })}
                  placeholder="图片路径"
                  className="flex-1"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              {formData.cover_image && (
                <p className="text-xs text-gray-500 mt-1">已上传: {formData.cover_image}</p>
              )}
            </div>
            <Input
              label="发布时间 *"
              type="datetime-local"
              value={formData.publish_time}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, publish_time: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' | 'draft' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A843]"
              >
                <option value="draft">已下架</option>
                <option value="published">已发布</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? '保存中...' : '保存'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => navigate('/admin/news')}>
                返回
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}