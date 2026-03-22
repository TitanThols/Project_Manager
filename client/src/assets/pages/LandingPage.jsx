import Navbar from '../components/Navbar'
import styles from './LandingPage.module.css'
import { useNavigate } from 'react-router-dom'
import { FolderKanban, Users, Clock, BarChart2, Shield, Zap } from 'lucide-react'

const features = [
  { icon: <FolderKanban size={24} />, title: 'Project Organization', desc: 'Create and organize multiple projects with ease. Keep your work structured and accessible.' },
  { icon: <Users size={24} />, title: 'Team Collaboration', desc: 'Assign tasks to team members and collaborate seamlessly across your organization.' },
  { icon: <Clock size={24} />, title: 'Time Tracking', desc: 'Track time spent on tasks and monitor deadlines to ensure projects stay on schedule.' },
  { icon: <BarChart2 size={24} />, title: 'Progress Analytics', desc: 'Visualize project progress and team performance with detailed analytics and reports.' },
  { icon: <Shield size={24} />, title: 'Secure & Private', desc: 'Your data is protected with enterprise-grade security and privacy measures.' },
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

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroIcon}>
          <FolderKanban size={32} color="#fff" />
        </div>
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
        <p className={styles.heroNote}>No credit card required • Free 14-day trial</p>
      </section>

      {/* Features */}
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

      {/* CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready to get started?</h2>
        <p className={styles.ctaSub}>
          Join thousands of teams already using ProMap to manage their projects more efficiently.
        </p>
        <div className={styles.heroButtons}>
          <button className={styles.primary} onClick={() => navigate('/signup')}>
            Create Free Account
          </button>
          <button className={styles.secondary} onClick={() => navigate('/login')}>
            Sign In
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <span>© 2026 ProMap. All rights reserved.</span>
      </footer>
    </div>
  )
}