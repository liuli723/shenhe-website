import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

export function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="relative bg-gradient-to-r from-background-dark to-background py-20 md:py-28 overflow-hidden">
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-dark leading-tight">
            {t('home.hero.title')}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-text-light">
            {t('home.hero.subtitle')}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#products"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              {t('nav.products')}
            </a>
            <a
              href="#contact"
              className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
            >
              {t('nav.contact')}
            </a>
          </div>
        </motion.div>
      </div>
      <div className="absolute right-0 top-0 w-1/2 h-full bg-primary/5 rounded-l-full hidden lg:block" />
    </section>
  )
}