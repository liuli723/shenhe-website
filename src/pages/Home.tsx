import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { newsService } from '@/services/news'
import { productService } from '@/services/products'
import { advantageService } from '@/services/advantages'
import type { News, Product, Advantage } from '@/types'
import { formatDate, truncateText } from '@/utils/helpers'

export function Home() {
  const { t } = useTranslation()
  const [news, setNews] = useState<News[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [advantages, setAdvantages] = useState<Advantage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsData, productsData, advantagesData] = await Promise.all([
          newsService.getPublished(),
          productService.getEnabled(),
          advantageService.getEnabled(),
        ])
        setNews(newsData.slice(0, 3))
        setProducts(productsData.slice(0, 3))
        setAdvantages(advantagesData.slice(0, 4))
        console.log('优势数据:', advantagesData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // 获取图片URL（新闻用 news-covers 桶）
  const getNewsImage = (path: string | null) => {
    if (!path) return ''
    const cleanPath = path.replace(/^public\//, '')
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/news-covers/${cleanPath}`
  }

  // 获取图片URL（产品/优势用 product-icons 桶）
  const getIconImage = (path: string | null) => {
    if (!path) return ''
    const cleanPath = path.replace(/^public\//, '')
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-icons/${cleanPath}`
  }

  // 检查是否是有效的图片路径（判断是否包含图片扩展名）
  const isValidImagePath = (path: string | null) => {
    if (!path) return false
    const ext = path.split('.').pop()?.toLowerCase()
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')
  }

  if (loading) {
    return <div className="py-20 text-center text-gray-500">加载中...</div>
  }

  return (
    <div className="bg-[#FDF6E3]">
      {/* Hero 区域 */}
      <section className="relative bg-gradient-to-r from-[#FDF6E3] to-[#FFFBF0] py-20 md:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] leading-tight">
              {t('home.hero.title')}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-[#6B6B6B]">
              {t('home.hero.subtitle')}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#products"
                className="px-6 py-3 bg-[#D4A843] text-white rounded-lg hover:bg-[#B8922E] transition-colors"
              >
                {t('nav.products')}
              </a>
              <a
                href="#contact"
                className="px-6 py-3 border border-[#D4A843] text-[#D4A843] rounded-lg hover:bg-[#D4A843]/10 transition-colors"
              >
                {t('nav.contact')}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          产品中心
          ============================================================ */}
      <section id="products" className="py-16 bg-[#F5EDE0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
              🏭 {t('home.products')}
            </h2>
            <p className="text-lg text-[#6B6B6B] max-w-2xl mx-auto">
              专注3D打印与工业胶水解决方案
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#E5DDD0]"
              >
                <div className="w-full h-56 bg-[#f5f0e8] overflow-hidden">
                  {isValidImagePath(product.icon) ? (
                    <img
                      src={getIconImage(product.icon)}
                      alt={product.name}
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f0e8d0"/%3E%3Ctext x="200" y="160" font-family="sans-serif" font-size="20" fill="%23999" text-anchor="middle"%3E暂无图片%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
                      📦
                    </div>
                  )}
                </div>
                <div className="p-6 pt-5">
                  <h3 className="text-xl font-bold text-[#1A1A1A]">{product.name}</h3>
                  <p className="text-[#6B6B6B] text-sm mt-2 line-clamp-2">
                    {truncateText(product.summary, 80)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/products" className="text-[#D4A843] hover:text-[#B8922E] font-medium">
              {t('home.viewMore')} →
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          企业优势
          ============================================================ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
              ⭐ {t('home.advantages')}
            </h2>
            <p className="text-lg text-[#6B6B6B] max-w-2xl mx-auto">
              我们的核心竞争力
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {advantages.map((advantage, index) => (
              <motion.div
                key={advantage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-[#D4A843]/20 hover:border-[#D4A843]"
              >
                {/* 图片容器 - 正方形，背景图铺满 */}
                <div className="w-full aspect-square bg-[#f5f0e8] overflow-hidden">
                  {isValidImagePath(advantage.icon) ? (
                    <img
                      src={getIconImage(advantage.icon)}
                      alt={advantage.name}
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%23f0e8d0"/%3E%3Ctext x="200" y="210" font-family="sans-serif" font-size="20" fill="%23999" text-anchor="middle"%3E暂无图片%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
                      🏆
                    </div>
                  )}
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-lg font-bold text-[#1A1A1A]">{advantage.name}</h3>
                  <p className="text-[#6B6B6B] text-sm mt-1">{truncateText(advantage.summary, 50)}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/advantages" className="text-[#D4A843] hover:text-[#B8922E] font-medium">
              {t('home.viewMore')} →
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          新闻动态
          ============================================================ */}
      <section className="py-16 bg-[#F8F6F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
                📰 {t('home.news')}
              </h2>
              <p className="text-lg text-[#6B6B6B]">企业最新动态</p>
            </div>
            <Link to="/news" className="text-[#D4A843] hover:text-[#B8922E] font-medium">
              {t('home.viewMore')} →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={`/news/${item.id}`}>
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#E5DDD0] h-full flex flex-col">
                    <div className="w-full h-56 bg-[#f5f0e8] overflow-hidden flex-shrink-0">
                      {isValidImagePath(item.cover_image) ? (
                        <img
                          src={getNewsImage(item.cover_image)}
                          alt={item.title}
                          className="w-full h-full object-cover object-center"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f0e8d0"/%3E%3Ctext x="200" y="160" font-family="sans-serif" font-size="20" fill="%23999" text-anchor="middle"%3E暂无图片%3C/text%3E%3C/svg%3E'
                          }}
                        />
                      ) : (
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
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}