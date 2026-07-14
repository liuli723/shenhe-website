import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { newsService } from '@/services/news'
import type { News } from '@/types'
import { formatDate, truncateText } from '@/utils/helpers'

export function News() {
  const { t } = useTranslation()
  const [newsList, setNewsList] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await newsService.getPublished()
        setNewsList(data)
      } catch (error) {
        console.error('Failed to fetch news:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [])

  const getImageUrl = (path: string | null) => {
    if (!path) return ''
    const cleanPath = path.replace(/^public\//, '')
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/news-covers/${cleanPath}`
  }

  if (loading) {
    return <div className="py-20 text-center text-gray-500">加载中...</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="py-16 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] text-center mb-12">
          {t('news.title')}
        </h1>
        {newsList.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>{t('news.noData')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsList.map((item, index) => {
              const imageUrl = getImageUrl(item.cover_image)
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link to={`/news/${item.id}`}>
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden h-full flex flex-col">
                      <div className="w-full h-48 bg-gray-100 flex-shrink-0 overflow-hidden">
                        {imageUrl ? (
                          <img 
                            src={imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover object-center"
                            style={{ 
                              display: 'block',
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'center',
                            }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        ) : null}
                        {!imageUrl && (
                          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
                            📰
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-lg font-semibold text-[#1A1A1A] line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#6B6B6B] mt-1">
                          {formatDate(item.publish_time)}
                        </p>
                        <p className="text-[#6B6B6B] text-sm mt-2 line-clamp-3 flex-1">
                          {truncateText(item.summary, 100)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </motion.div>
  )
}