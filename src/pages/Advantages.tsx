import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { advantageService } from '@/services/advantages'
import type { Advantage } from '@/types'
import { getImageUrl } from '@/utils/helpers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function Advantages() {
  const { t } = useTranslation()
  const [advantages, setAdvantages] = useState<Advantage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdvantages = async () => {
      try {
        const data = await advantageService.getEnabled()
        setAdvantages(data)
      } catch (error) {
        console.error('Failed to fetch advantages:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAdvantages()
  }, [])

  if (loading) {
    return <div className="py-20 text-center text-text-light">加载中...</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="py-16"
    >
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="section-title">{t('advantages.title')}</h1>
          <p className="section-subtitle mx-auto">{t('advantages.title')}</p>
        </div>
        {advantages.length === 0 ? (
          <div className="text-center py-12 text-text-light">
            <p>{t('news.noData')}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advantages.map((advantage, index) => (
                <motion.div
                  key={advantage.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    {advantage.icon && (
                      <div className="h-32 flex items-center justify-center pt-4">
                        <img
                          src={getImageUrl('product-icons', advantage.icon) || ''}
                          alt={advantage.name}
                          className="w-16 h-16 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.png'
                          }}
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-xl">{advantage.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-text-light">{advantage.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="mt-16 bg-background-light p-8 rounded-2xl border border-border">
              <h2 className="text-2xl font-bold text-primary text-center mb-8">{t('advantages.data')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">15+</div>
                  <div className="text-sm text-text-light">成立年限</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-text-light">服务客户</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">200+</div>
                  <div className="text-sm text-text-light">项目案例</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-sm text-text-light">团队规模</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}