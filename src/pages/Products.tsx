import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { productService } from '@/services/products'
import type { Product } from '@/types'
import { getImageUrl } from '@/utils/helpers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function Products() {
  const { t } = useTranslation()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getEnabled()
        setProducts(data)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
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
          <h1 className="section-title">{t('products.title')}</h1>
          <p className="section-subtitle mx-auto">{t('products.description')}</p>
        </div>
        {products.length === 0 ? (
          <div className="text-center py-12 text-text-light">
            <p>{t('news.noData')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  {product.icon && (
                    <div className="h-56 bg-background-dark rounded-t-lg overflow-hidden">
                      <img
                        src={getImageUrl('product-icons', product.icon) || ''}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.png'
                        }}
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-text-light">{product.description}</p>
                    {product.scenarios && (
                      <div>
                        <h4 className="font-semibold text-primary">{t('products.scenarios')}</h4>
                        <p className="text-text-light text-sm">{product.scenarios}</p>
                      </div>
                    )}
                    {product.process && (
                      <div>
                        <h4 className="font-semibold text-primary">{t('products.process')}</h4>
                        <p className="text-text-light text-sm">{product.process}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}