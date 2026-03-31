import Navbar from '../components/Navbar'
import styles from './LandingPage.module.css'
import { useNavigate } from 'react-router-dom'
import { FolderKanban, Users, Clock, BarChart2, Shield, Zap } from 'lucide-react'

const features = [
  { icon: <FolderKanban size={24} />, title: 'Project Organization', desc: 'Create and organize multiple projects with ease. Keep your work structured and accessible.' },
  { icon: <Users size={24} />, title: 'Team Collaboration', desc: 'Assign tasks to team members and collaborate seamlessly across your organization.' },
  { icon: <BarChart2 size={24} />, title: 'Progress Analytics', desc: 'Visualize project progress and team performance with detailed analytics and reports.' },
  { icon: <Zap size={24} />, title: 'Lightning Fast', desc: 'Built for speed and efficiency. Access your projects and tasks instantly, anywhere.' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <Navbar
        onSignIn={() => navigate('/login')}
        onGetStarted={() => navigate('/signup')}
      />

      <section className={styles.hero}>
        
        <h1 className={styles.heroTitle}>
          Manage Projects with <span>Ease</span>
        </h1>
        <p className={styles.heroSub}>
          Streamline your team's workflow with ProMap. Organize projects,
          assign tasks, and track progress all in one intuitive platform.
        </p>
        <div className={styles.heroButtons}>
          <button className={styles.primary} onClick={() => navigate('/signup')}>
            Start Free Trial
          </button>
          <button className={styles.secondary} onClick={() => navigate('/login')}>
            Sign In
          </button>
        </div>
      </section>

      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Everything you need to succeed</h2>
        <p className={styles.sectionSub}>Powerful features to help your team stay organized and productive</p>
        <div className={styles.featuresGrid}>
          {features.map((f, i) => (
            <div key={i} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready to get started?</h2>
        <div className={styles.heroButtons}>
          <button className={styles.primary} onClick={() => navigate('/signup')}>
            Create Free Account
          </button>
          <button className={styles.secondary} onClick={() => navigate('/login')}>
            Sign In
          </button>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>© 2026 ProMap. All rights reserved.</span>
      </footer>
    </div>
  )
}