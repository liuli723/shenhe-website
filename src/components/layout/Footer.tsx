import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background-dark border-t border-border mt-16">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">深圳申禾工业科技有限公司</h3>
            <p className="text-text-light text-sm">专注于3D打印设备及工业胶水解决方案</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('contact.info')}</h4>
            <ul className="space-y-2 text-sm text-text-light">
              <li>📞 0755-8888-8888</li>
              <li>✉️ info@shenhe.com</li>
              <li>📍 深圳市南山区科技园</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('nav.about')}</h4>
            <ul className="space-y-2 text-sm text-text-light">
              <li><Link to="/about" className="hover:text-primary transition-colors">{t('about.intro')}</Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors">{t('nav.products')}</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-text-light">
          <p>{t('footer.copyright', { year: currentYear })}</p>
          <p className="mt-1">{t('footer.备案号')}</p>
        </div>
      </div>
    </footer>
  )
}