import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { advantageService } from '@/services/advantages'
import type { Advantage } from '@/types'
import { getImageUrl, truncateText } from '@/utils/helpers'

export function AdvantagesPreview() {
  const { t } = useTranslation()
  const [advantages, setAdvantages] = useState<Advantage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdvantages = async () => {
      try {
        const data = await advantageService.getEnabled()
        setAdvantages(data.slice(0, 4))
      } catch (error) {
        console.error('Failed to fetch advantages:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAdvantages()
  }, [])

  if (loading) {
    return <div className="py-12 text-center text-gray-500">加载中...</div>
  }

  if (advantages.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
            {t('home.advantages')}
          </h2>
          <p className="text-lg text-[#6B6B6B] max-w-2xl mx-auto">
            {t('advantages.title')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((advantage, index) => {
            const iconUrl = getImageUrl('advantage-icons', advantage.icon) || getImageUrl('product-icons', advantage.icon) || ''
            return (
              <motion.div
                key={advantage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 p-8 h-full flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {iconUrl ? (
                      <img 
                        src={iconUrl}
                        alt={advantage.name}
                        className="w-24 h-24 object-contain"
                        style={{ 
                          display: 'block',
                          width: '80%',
                          height: '80%',
                          objectFit: 'contain',
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <span className="text-5xl text-gray-300">🏆</span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mt-5">
                    {advantage.name}
                  </h3>
                  <p className="text-[#6B6B6B] text-sm mt-2 flex-1">
                    {truncateText(advantage.summary, 60)}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/advantages"
            className="inline-flex items-center gap-2 text-[#D4A843] hover:text-[#B8922E] font-medium transition-colors"
          >
            {t('home.viewMore')} →
          </Link>
        </div>
      </div>
    </section>
  )
}