import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export function AdminNewsForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    cover_image: '',
    publish_time: new Date().toISOString().slice(0, 16),
    status: 'draft',
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      fetchNews()
    }
  }, [id])

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
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
      console.error('获取新闻失败:', error)
    } finally {
      setFetching(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      alert('请选择图片文件')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过 5MB')
      return
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`

    setUploading(true)
    try {
      console.log('📤 开始上传图片:', fileName)
      
      const { data, error } = await supabase.storage
        .from('news-covers')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('上传错误:', error)
        alert('图片上传失败: ' + error.message)
        return
      }

      console.log('✅ 上传成功:', data)
      
      // 只保存文件名
      setFormData({ ...formData, cover_image: fileName })
      alert('✅ 图片上传成功！')
      
    } catch (error) {
      console.error('上传异常:', error)
      alert('图片上传异常，请重试')
    } finally {
      setUploading(false)
    }
  }

  // 获取图片 URL
  const getImageUrl = (path: string | null) => {
    if (!path) return null
    const cleanPath = path.replace(/^public\//, '')
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/news-covers/${cleanPath}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.summary || !formData.content || !formData.publish_time) {
      alert('请填写完整信息')
      return
    }

    console.log('📦 准备保存:', {
      title: formData.title,
      cover_image: formData.cover_image || '(无图片)',
    })

    setLoading(true)
    try {
      const insertData = {
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        cover_image: formData.cover_image || null,
        publish_time: formData.publish_time,
        status: formData.status,
      }

      if (isEdit) {
        const { error } = await supabase
          .from('news')
          .update(insertData)
          .eq('id', id)

        if (error) throw error
        console.log('✅ 新闻更新成功')
      } else {
        const { error } = await supabase
          .from('news')
          .insert(insertData)

        if (error) throw error
        console.log('✅ 新闻创建成功')
      }
      navigate('/admin/news')
    } catch (error) {
      console.error('保存失败:', error)
      alert('保存失败: ' + (error as any).message)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="py-20 text-center text-gray-500">加载中...</div>
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-[#3E3E3E] mb-6">
          {isEdit ? '编辑新闻' : '新增新闻'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A843]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">摘要 *</label>
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A843]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">正文 *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A843]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">封面图</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.cover_image}
                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                placeholder="图片路径（自动填写）"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A843] bg-gray-50"
                readOnly
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
              />
            </div>
            {uploading && <p className="text-xs text-blue-500 mt-1">⏳ 上传中...</p>}
            
            {/* 图片预览 */}
            {formData.cover_image && !uploading && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">图片预览：</p>
                <div className="w-48 h-32 rounded-lg overflow-hidden bg-[#F0E8D0] border border-[#E5DDD0]">
                  <img
                    src={getImageUrl(formData.cover_image) || ''}
                    alt="封面预览"
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f0e8d0"/%3E%3Ctext x="200" y="160" font-family="sans-serif" font-size="20" fill="%23999" text-anchor="middle"%3E图片加载失败%3C/text%3E%3C/svg%3E'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">发布时间 *</label>
            <input
              type="datetime-local"
              value={formData.publish_time}
              onChange={(e) => setFormData({ ...formData, publish_time: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A843]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A843]"
            >
              <option value="draft">已下架</option>
              <option value="published">已发布</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || uploading}
              className="bg-[#D4A843] hover:bg-[#B8922E] text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? '保存中...' : '保存'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/news')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
            >
              返回列表
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="bg-[#D4A843] hover:bg-[#B8922E] text-white px-6 py-2 rounded-lg transition-colors"
            >
              📊 返回看板
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}