import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Globe } from 'lucide-react'

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
    console.log('切换语言到:', nextLang)
    i18n.changeLanguage(nextLang)
    localStorage.setItem('i18nextLng', nextLang)
    // 强制刷新页面，确保所有组件重新渲染
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  return (
    <header className="sticky top-0 z-50 bg-[#FDF6E3]/95 backdrop-blur-sm border-b border-[#E5DDD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#D4A843]">申禾</span>
            <span className="text-sm text-[#6B6B6B] hidden sm:inline">工业科技</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-[#D4A843] ${
                  location.pathname === item.path
                    ? 'text-[#D4A843] border-b-2 border-[#D4A843] pb-1'
                    : 'text-[#3E3E3E]'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-sm text-[#6B6B6B] hover:text-[#D4A843] transition-colors"
            >
              <Globe className="w-4 h-4" />
              {i18n.language === 'zh' ? 'EN' : '中文'}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-[#E5DDD0]">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block py-2 text-sm font-medium transition-colors hover:text-[#D4A843] ${
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
              className="flex items-center gap-1 mt-2 text-sm text-[#6B6B6B] hover:text-[#D4A843] transition-colors"
            >
              <Globe className="w-4 h-4" />
              {i18n.language === 'zh' ? '切换英文' : 'Switch to Chinese'}
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}