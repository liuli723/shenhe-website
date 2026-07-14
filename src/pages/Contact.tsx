import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { messageService } from '@/services/messages'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function Contact() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({ name: '', contact: '', content: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!formData.name || !formData.contact || !formData.content) {
      setError(t('contact.required'))
      return
    }

    const phoneRegex = /^1[3-9]\d{9}$/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!phoneRegex.test(formData.contact) && !emailRegex.test(formData.contact)) {
      setError(t('contact.invalidContact'))
      return
    }

    setSubmitting(true)
    try {
      await messageService.create(formData)
      setSuccess(true)
      setFormData({ name: '', contact: '', content: '' })
    } catch (err) {
      setError('提交失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="py-16"
    >
      <div className="container-custom">
        <h1 className="section-title text-center mb-12">{t('contact.title')}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{t('contact.info')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-primary">🏢</span>
                  <div>
                    <p className="font-medium">深圳申禾工业科技有限公司</p>
                    <p className="text-text-light text-sm">深圳市宝安区松岗街道东方社区东方一路32号厂房A栋201</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary">📞</span>
                  <div>
                    <p className="font-medium">133-8498-7720</p>
                    <p className="text-text-light text-sm">周一至周五 9:00-18:00</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary">✉️</span>
                  <div>
                    <p className="font-medium">13384987720@189.com</p>
                    <p className="text-text-light text-sm">我们会在24小时内回复</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{t('contact.map')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-background-dark h-48 rounded-lg flex items-center justify-center text-text-light border border-border">
                  <div className="text-center">
                    <p className="text-sm">📍 深圳市宝安区松岗街道东方社区东方一路32号厂房A栋201</p>
                    <p className="text-xs mt-1">地图加载中...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>{t('contact.message')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">{t('contact.name')} *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('contact.name')}
                  />
                </div>
                <div>
                  <Label htmlFor="contact">{t('contact.phone')} *</Label>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="手机号 或 邮箱"
                  />
                </div>
                <div>
                  <Label htmlFor="content">{t('contact.content')} *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder={t('contact.content')}
                    rows={5}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                {success && <p className="text-sm text-green-600">{t('contact.success')}</p>}
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? '提交中...' : t('contact.submit')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}