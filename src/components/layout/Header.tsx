import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export function Header() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/products', label: t('nav.products') },
    { path: '/advantages', label: t('nav.advantages') },
    { path: '/news', label: t('nav.news') },
    { path: '/contact', label: t('nav.contact') },
  ]

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'zh' ? 'en' : 'zh'
    i18n.changeLanguage(nextLang)
    localStorage.setItem('i18nextLng', nextLang)
    setTimeout(() => window.location.reload(), 100)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E5DDD0] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#D4A843] rounded-lg flex items-center justify-center text-white font-bold text-sm">
              申
            </div>
            <span className="text-xl font-bold text-[#1A1A1A]">申禾工业</span>
            <span className="text-sm text-[#6B6B6B] hidden sm:inline">| 科技引领未来</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-[#D4A843] border-b-2 border-[#D4A843] pb-1'
                    : 'text-[#3E3E3E] hover:text-[#D4A843]'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={toggleLanguage}
              className="text-sm text-[#6B6B6B] hover:text-[#D4A843] transition-colors px-3 py-1 border border-[#E5DDD0] rounded-lg"
            >
              {i18n.language === 'zh' ? 'EN' : '中文'}
            </button>
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-[#E5DDD0]">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block py-2 text-sm font-medium transition-colors ${
                  location.pathname === item.path ? 'text-[#D4A843]' : 'text-[#3E3E3E]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => {
                toggleLanguage()
                setIsMenuOpen(false)
              }}
              className="mt-2 text-sm text-[#6B6B6B] hover:text-[#D4A843] transition-colors"
            >
              {i18n.language === 'zh' ? '切换英文' : 'Switch to Chinese'}
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}