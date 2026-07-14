import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export function About() {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="py-16"
    >
      <div className="container-custom">
        <h1 className="section-title text-center">{t('about.title')}</h1>
        <div className="max-w-3xl mx-auto mt-8 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-primary mb-4">{t('about.intro')}</h2>
            <p className="text-text-light leading-relaxed">
              深圳申禾工业科技有限公司是一家专注于工业科技领域的高新技术企业，致力于为全球客户提供优质的3D打印设备及工业胶水解决方案。公司成立于2010年，经过多年的发展，已成为行业内的领先者。
            </p>
            <p className="text-text-light leading-relaxed mt-4">
              我们坚持以技术创新为核心，以客户需求为导向，不断推出具有竞争力的产品和服务，助力客户实现产业升级和可持续发展。
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary mb-4">{t('about.qualifications')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['ISO9001', 'CE认证', '高新技术企业', '多项专利', 'AAA信用企业', '行业标杆'].map((item) => (
                <div key={item} className="bg-background-light p-4 rounded-lg text-center border border-border">
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary mb-4">{t('about.team')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: '潘海翠', position: 'CEO & 创始人', bio: '20年工业科技领域经验' },
                { name: '李珊', position: '技术总监', bio: '15年3D打印研发经验' },
                { name: '宋超', position: '运营总监', bio: '10年企业管理经验' },
              ].map((member) => (
                <div key={member.name} className="bg-background-light p-6 rounded-lg border border-border text-center">
                  <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary">
                    {member.name[0]}
                  </div>
                  <h3 className="font-bold mt-4">{member.name}</h3>
                  <p className="text-primary text-sm">{member.position}</p>
                  <p className="text-text-light text-sm mt-2">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}