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
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getNewsImage = (path: string | null) => {
    if (!path) return ''
    const cleanPath = path.replace(/^public\//, '')
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/news-covers/${cleanPath}`
  }

  const getIconImage = (path: string | null) => {
    if (!path) return ''
    const cleanPath = path.replace(/^public\//, '')
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-icons/${cleanPath}`
  }

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
      {/* ============================================================
          Hero Banner - 保留原有文案，新布局风格
          ============================================================ */}
      <section className="relative bg-gradient-to-r from-[#FDF6E3] to-[#FFFBF0] py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#D4A843" strokeWidth="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[#D4A843] font-medium text-sm tracking-wider uppercase mb-4">
                申禾工业科技 · 创新驱动
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] leading-tight">
                {t('home.hero.title')}
              </h1>
              <p className="mt-4 text-lg text-[#6B6B6B] max-w-2xl">
                {t('home.hero.subtitle')}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="px-8 py-3 bg-[#D4A843] text-white rounded-lg hover:bg-[#B8922E] transition-colors font-medium"
                >
                  {t('nav.products')}
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-3 border border-[#D4A843] text-[#D4A843] rounded-lg hover:bg-[#D4A843]/10 transition-colors font-medium"
                >
                  {t('nav.contact')}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================
          产品中心 - 3列卡片布局
          ============================================================ */}
      <section id="products" className="py-16 bg-[#FDF6E3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-2">
                🏭 {t('home.products')}
              </h2>
              <p className="text-lg text-[#6B6B6B]">专注于3D打印设备及工业胶水解决方案</p>
            </div>
            <Link to="/products" className="text-[#D4A843] hover:text-[#B8922E] font-medium">
              {t('home.viewMore')} →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#E5DDD0] hover:border-[#D4A843] group"
              >
                <div className="h-52 bg-[#F5F0E8] overflow-hidden">
                  {isValidImagePath(product.icon) ? (
                    <img
                      src={getIconImage(product.icon)}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f5f0e8"/%3E%3Ctext x="200" y="160" font-family="sans-serif" font-size="20" fill="%23999" text-anchor="middle"%3E暂无图片%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">
                      📦
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1A1A1A]">{product.name}</h3>
                  <p className="text-[#6B6B6B] text-sm mt-2 line-clamp-2">
                    {truncateText(product.summary, 80)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          企业优势 - 4列卡片布局（图片铺满）
          ============================================================ */}
      <section className="py-16 bg-[#FFFBF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-2">
                ⭐ {t('home.advantages')}
              </h2>
              <p className="text-lg text-[#6B6B6B]">企业核心竞争力</p>
            </div>
            <Link to="/advantages" className="text-[#D4A843] hover:text-[#B8922E] font-medium">
              {t('home.viewMore')} →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {advantages.map((advantage, index) => (
              <motion.div
                key={advantage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#E5DDD0] hover:border-[#D4A843] group"
              >
                {/* 图片 - 正方形铺满 */}
                <div className="w-full aspect-square bg-[#F5F0E8] overflow-hidden">
                  {isValidImagePath(advantage.icon) ? (
                    <img
                      src={getIconImage(advantage.icon)}
                      alt={advantage.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%23f5f0e8"/%3E%3Ctext x="200" y="210" font-family="sans-serif" font-size="20" fill="%23999" text-anchor="middle"%3E暂无图片%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">
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
        </div>
      </section>

      {/* ============================================================
          新闻动态 - 3列卡片布局
          ============================================================ */}
      <section className="py-16 bg-[#FDF6E3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-2">
                📰 {t('home.news')}
              </h2>
              <p className="text-lg text-[#6B6B6B]">企业最新动态与资讯</p>
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
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#E5DDD0] hover:border-[#D4A843] group h-full flex flex-col">
                    <div className="h-52 bg-[#F5F0E8] overflow-hidden flex-shrink-0">
                      {isValidImagePath(item.cover_image) ? (
                        <img
                          src={getNewsImage(item.cover_image)}
                          alt={item.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f5f0e8"/%3E%3Ctext x="200" y="160" font-family="sans-serif" font-size="20" fill="%23999" text-anchor="middle"%3E暂无图片%3C/text%3E%3C/svg%3E'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">
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