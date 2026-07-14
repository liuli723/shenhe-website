import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { productService } from '@/services/products'
import type { Product } from '@/types'
import { getImageUrl, truncateText } from '@/utils/helpers'

export function ProductsPreview() {
  const { t } = useTranslation()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getEnabled()
        setProducts(data.slice(0, 3))
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return <div className="py-12 text-center text-gray-500">加载中...</div>
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section id="products" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
            {t('home.products')}
          </h2>
          <p className="text-lg text-[#6B6B6B] max-w-2xl mx-auto">
            {t('products.description')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => {
            const iconUrl = getImageUrl('product-icons', product.icon) || ''
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden h-full flex flex-col">
                  <div className="w-full h-48 bg-gray-50 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {iconUrl ? (
                      <img 
                        src={iconUrl}
                        alt={product.name}
                        className="w-full h-full object-contain"
                        style={{ 
                          display: 'block',
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          padding: '16px',
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <span className="text-6xl text-gray-300">📦</span>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold text-[#1A1A1A]">{product.name}</h3>
                    <p className="text-[#6B6B6B] text-sm mt-2 flex-1">
                      {truncateText(product.summary, 80)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-[#D4A843] hover:text-[#B8922E] font-medium transition-colors"
          >
            {t('home.viewMore')} →
          </Link>
        </div>
      </div>
    </section>
  )
}