"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <Link href="/" className="logo">
            <span className="logo-icon">🤝</span>
            <span className="logo-text">Conference Buddy</span>
          </Link>
          <div className="nav-links">
            <Link href="/dashboard" className="nav-link">Open App</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <span className="hero-badge">✨ AI-Powered Networking</span>
          <h1 className="hero-title">
            Connect Meaningfully<br />at Every Conference
          </h1>
          <p className="hero-subtitle">
            Stop wandering aimlessly. Get personalized event recommendations
            and meet the right people with AI-powered matching.
          </p>
          <div className="hero-cta">
            <Link href="/dashboard" className="btn btn-primary btn-lg">
              Get Started — It&apos;s Free
            </Link>
            <span className="hero-note">No credit card required</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <h2 className="features-title">Everything you need to network smarter</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3 className="feature-name">Smart Event Discovery</h3>
              <p className="feature-desc">
                AI analyzes your interests and recommends sessions that
                actually matter to your career goals.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-name">Perfect Match Finder</h3>
              <p className="feature-desc">
                Find attendees who share your interests, work in your field,
                or can help you reach your goals.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3 className="feature-name">Icebreaker Suggestions</h3>
              <p className="feature-desc">
                Never freeze up again. Get personalized conversation starters
                tailored to each connection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="proof">
        <div className="proof-container">
          <div className="proof-stats">
            <div className="stat">
              <span className="stat-number">2,400+</span>
              <span className="stat-label">Connections Made</span>
            </div>
            <div className="stat">
              <span className="stat-number">94%</span>
              <span className="stat-label">Match Accuracy</span>
            </div>
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Conferences</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to transform how you network?</h2>
          <p className="cta-subtitle">Join thousands of professionals making meaningful connections.</p>
          <Link href="/dashboard" className="btn btn-primary btn-lg">
            Start Networking Smarter
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <p className="footer-text">© 2024 Conference Buddy. Built with ❤️ for networkers.</p>
        </div>
      </footer>

      <style jsx>{`
        .landing {
          min-height: 100vh;
        }

        /* Navigation */
        .nav {
          position: sticky;
          top: 0;
          background: rgba(255, 251, 247, 0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          z-index: 100;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: var(--text-primary);
        }

        .logo-icon {
          font-size: 1.5rem;
        }

        .logo-text {
          font-weight: 700;
          font-size: 1.125rem;
        }

        .nav-link {
          padding: 8px 16px;
          background: var(--bg-secondary);
          border-radius: 8px;
          text-decoration: none;
          color: var(--text-primary);
          font-weight: 500;
          font-size: 0.875rem;
          transition: background 0.2s;
        }

        .nav-link:hover {
          background: var(--border);
        }

        /* Hero */
        .hero {
          padding: 64px 16px 80px;
          text-align: center;
        }

        .hero-container {
          max-width: 640px;
          margin: 0 auto;
        }

        .hero-badge {
          display: inline-block;
          padding: 6px 14px;
          background: var(--accent-light);
          color: var(--accent);
          font-size: 0.875rem;
          font-weight: 600;
          border-radius: 100px;
          margin-bottom: 24px;
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          margin-bottom: 20px;
        }

        @media (min-width: 640px) {
          .hero-title {
            font-size: 3.25rem;
          }
        }

        .hero-subtitle {
          font-size: 1.125rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .hero-cta {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .btn-lg {
          padding: 14px 28px;
          font-size: 1rem;
        }

        .hero-note {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }

        /* Features */
        .features {
          padding: 80px 16px;
          background: var(--bg-secondary);
        }

        .features-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .features-title {
          text-align: center;
          font-size: 1.75rem;
          margin-bottom: 48px;
          color: var(--text-primary);
        }

        .features-grid {
          display: grid;
          gap: 24px;
        }

        @media (min-width: 768px) {
          .features-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .feature-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 28px 24px;
          text-align: center;
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 16px;
        }

        .feature-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .feature-desc {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* Social Proof */
        .proof {
          padding: 64px 16px;
        }

        .proof-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .proof-stats {
          display: flex;
          justify-content: center;
          gap: 48px;
          flex-wrap: wrap;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--accent);
          letter-spacing: -0.02em;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        /* CTA Section */
        .cta-section {
          padding: 80px 16px;
          background: var(--text-primary);
          text-align: center;
        }

        .cta-container {
          max-width: 560px;
          margin: 0 auto;
        }

        .cta-title {
          font-size: 1.75rem;
          color: white;
          margin-bottom: 12px;
        }

        .cta-subtitle {
          color: rgba(255,255,255,0.7);
          margin-bottom: 28px;
        }

        /* Footer */
        .footer {
          padding: 32px 16px;
          border-top: 1px solid var(--border);
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .footer-text {
          font-size: 0.875rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
