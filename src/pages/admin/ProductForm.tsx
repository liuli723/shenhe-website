import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export function AdminProductForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    name: '',
    summary: '',
    description: '',
    scenarios: '',
    process: '',
    icon: '',
    status: 'disabled',
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    if (isEdit) {
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (data) {
        setFormData({
          name: data.name,
          summary: data.summary,
          description: data.description,
          scenarios: data.scenarios || '',
          process: data.process || '',
          icon: data.icon || '',
          status: data.status,
        })
      }
    } catch (error) {
      console.error('获取产品失败:', error)
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.summary || !formData.description) {
      alert('请填写完整信息')
      return
    }

    setLoading(true)
    try {
      if (isEdit) {
        const { error } = await supabase
          .from('products')
          .update({
            name: formData.name,
            summary: formData.summary,
            description: formData.description,
            scenarios: formData.scenarios || null,
            process: formData.process || null,
            icon: formData.icon || null,
            status: formData.status,
          })
          .eq('id', id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('products')
          .insert({
            name: formData.name,
            summary: formData.summary,
            description: formData.description,
            scenarios: formData.scenarios || null,
            process: formData.process || null,
            icon: formData.icon || null,
            status: formData.status,
          })

        if (error) throw error
      }
      navigate('/admin/products')
    } catch (error) {
      console.error('保存失败:', error)
      alert('保存失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileName = `${Date.now()}.${file.name.split('.').pop()}`

    try {
      const { error } = await supabase.storage
        .from('product-icons')
        .upload(fileName, file)

      if (error) throw error
      setFormData({ ...formData, icon: fileName })
      alert('图标上传成功')
    } catch (error) {
      console.error('上传失败:', error)
      alert('图标上传失败，请重试')
    }
  }

  if (fetching) {
    return <div className="py-20 text-center text-gray-500">加载中...</div>
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-[#3E3E3E] mb-6">
          {isEdit ? '编辑产品' : '新增产品'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">名称 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">详细描述 *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A843]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">应用场景</label>
            <textarea
              value={formData.scenarios}
              onChange={(e) => setFormData({ ...formData, scenarios: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A843]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">服务流程</label>
            <textarea
              value={formData.process}
              onChange={(e) => setFormData({ ...formData, process: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A843]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">图标</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="图标路径"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A843]"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            {formData.icon && (
              <p className="text-xs text-gray-500 mt-1">已上传: {formData.icon}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A843]"
            >
              <option value="disabled">已禁用</option>
              <option value="enabled">已启用</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#D4A843] hover:bg-[#B8922E] text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? '保存中...' : '保存'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
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