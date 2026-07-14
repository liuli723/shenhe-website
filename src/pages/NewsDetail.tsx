import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { newsService } from '@/services/news'
import type { News } from '@/types'
import { formatDate } from '@/utils/helpers'

export function NewsDetail() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [news, setNews] = useState<News | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getImageUrl = (path: string | null) => {
    if (!path) return null
    const cleanPath = path.replace(/^public\//, '')
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/news-covers/${cleanPath}`
  }

  useEffect(() => {
    const fetchNews = async () => {
      if (!id) {
        setError('新闻不存在')
        setLoading(false)
        return
      }
      try {
        const data = await newsService.getById(id)
        if (!data || data.status !== 'published') {
          setError('新闻不存在或已下架')
        } else {
          setNews(data)
        }
      } catch (err) {
        setError('加载失败，请稍后重试')
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [id])

  if (loading) {
    return <div className="py-20 text-center text-gray-500">加载中...</div>
  }

  if (error || !news) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">{error || t('news.noData')}</p>
        <button onClick={() => navigate('/news')} className="mt-4 text-[#D4A843] hover:text-[#B8922E]">
          {t('news.back')}
        </button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="py-16"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/news')}
          className="mb-6 text-[#6B6B6B] hover:text-[#D4A843] transition-colors"
        >
          ← {t('news.back')}
        </button>
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#E5DDD0]">
          {news.cover_image && (
            <div className="w-full mb-6 rounded-xl overflow-hidden bg-[#f5f0e8]">
              <img
                src={getImageUrl(news.cover_image) || ''}
                alt={news.title}
                className="w-full max-h-[500px] object-cover object-center"
                style={{ display: 'block' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"%3E%3Crect width="800" height="400" fill="%23f5f0e8"/%3E%3Ctext x="400" y="210" font-family="sans-serif" font-size="24" fill="%23cccccc" text-anchor="middle"%3E📰 图片加载失败%3C/text%3E%3C/svg%3E'
                }}
              />
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
            {news.title}
          </h1>
          <p className="text-sm text-[#6B6B6B] mb-6">
            {formatDate(news.publish_time)}
          </p>
          <div className="prose prose-lg max-w-none text-[#3E3E3E]">
            <p className="text-[#3E3E3E] leading-relaxed whitespace-pre-wrap">
              {news.content}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}