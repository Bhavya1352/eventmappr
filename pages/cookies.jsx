import React from "react";

function Cookies() {
  return (
    <div className="cookies-container">
      <div className="cookies-page">
        {/* Header */}
        <div className="header-section glass">
          <div className="icon-wrapper animate-bounce glass-light">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="8" cy="8" r="1" fill="currentColor" />
              <circle cx="16" cy="8" r="1" fill="currentColor" />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
              <circle cx="6" cy="14" r="1" fill="currentColor" />
              <circle cx="18" cy="14" r="1" fill="currentColor" />
              <circle cx="10" cy="12" r="1" fill="currentColor" />
              <circle cx="14" cy="10" r="1" fill="currentColor" />
            </svg>
          </div>
          <h1 className="title">🍪 Cookie Policy</h1>
          <p className="subtitle">
            Transparent, secure, and designed for your experience
          </p>
          <div className="updated-badge glass-light">
            <span>📅 Last updated: June 29, 2025</span>
          </div>
        </div>

        {/* Content */}
        <div className="content-grid">
          {[
            {
              number: "01",
              title: "What Are Cookies?",
              desc: "Cookies are small text files stored on your device to help us improve your experience and analyze usage.",
            },
            {
              number: "02",
              title: "How We Use Cookies",
              desc: "We categorize cookies to help you understand their purpose:",
              custom: (
                <div className="cookie-types">
                  {[
                    {
                      icon: "⚙️",
                      title: "Essential Cookies",
                      desc: "Enable core functionality and secure access",
                    },
                    {
                      icon: "📊",
                      title: "Analytics Cookies",
                      desc: "Help us understand how you use our platform",
                    },
                    {
                      icon: "🎯",
                      title: "Preference Cookies",
                      desc: "Remember your settings and personalization",
                    },
                  ].map((c, i) => (
                    <div className="cookie-card glass" key={i}>
                      <div className="card-icon">{c.icon}</div>
                      <div className="card-content">
                        <h3>{c.title}</h3>
                        <p>{c.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              number: "03",
              title: "Types of Cookies We Use",
              custom: (
                <div className="cookie-duration-grid">
                  {[
                    {
                      icon: "⏱️",
                      title: "Session Cookies",
                      desc: "Expire when you close your browser",
                    },
                    {
                      icon: "🔄",
                      title: "Persistent Cookies",
                      desc: "Remain until deleted or expired",
                    },
                  ].map((c, i) => (
                    <div className="duration-item glass" key={i}>
                      <span className="duration-icon">{c.icon}</span>
                      <div className="duration-content">
                        <h4>{c.title}</h4>
                        <p>{c.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              number: "04",
              title: "Managing Cookies",
              custom: (
                <div className="management-options">
                  {[
                    {
                      icon: "🌐",
                      title: "Browser Settings",
                      desc: "Control cookies through your browser preferences",
                    },
                    {
                      icon: "⚠️",
                      title: "Impact Notice",
                      desc: "Disabling cookies may affect platform functionality",
                    },
                  ].map((c, i) => (
                    <div className="management-card glass" key={i}>
                      <div className="card-icon">{c.icon}</div>
                      <div className="card-content">
                        <h3>{c.title}</h3>
                        <p>{c.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              number: "05",
              title: "Third-Party Services",
              desc: "We use third-party analytics services that may set their own cookies to help us improve performance.",
            },
            {
              number: "06",
              title: "Changes to This Policy",
              desc: "We may update this Cookie Policy from time to time. Please check back periodically.",
            },
          ].map((sec, i) => (
            <section className="section fade-in glass" key={i}>
              <div className="section-header">
                <span className="section-number">{sec.number}</span>
                <h2>{sec.title}</h2>
              </div>
              {sec.desc && <p>{sec.desc}</p>}
              {sec.custom && sec.custom}
            </section>
          ))}
        </div>

        {/* Contact */}
        <div className="contact-section">
          <div className="contact-card glass-strong">
            <h3>❓ Questions about cookies?</h3>
            <p>
              Our team is here to help you understand how we use cookies and
              protect your privacy.
            </p>
            <a href="mailto:support@eventmappr.com" className="contact-button">
              <span>Get in Touch</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 17L17 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 7H17V17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cookies-container {
          min-height: 100vh;
          background: url("https://grainy-gradients.vercel.app/noise.svg"),
            linear-gradient(135deg, #dbeafe, #fef9c3);
          background-size: cover;
          padding: 2rem 1rem;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }
        .cookies-page {
          max-width: 900px;
          margin: 0 auto;
          border-radius: 24px;
          overflow: hidden;
          backdrop-filter: blur(20px);
        }
        .header-section {
          text-align: center;
          padding: 3rem 2rem;
          color: #111827; /* ✅ Darker text */
          background: rgba(255, 255, 255, 0.7);
        }
        .icon-wrapper {
          padding: 1rem;
          border-radius: 16px;
          margin-bottom: 1rem;
          color: #1e40af; /* ✅ Dark blue icon */
        }
        .title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          color: #111827; /* ✅ Dark heading */
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .subtitle {
          font-size: 1.1rem;
          color: #1e293b; /* ✅ Darker subtitle */
        }
        .updated-badge {
          margin-top: 1rem;
          font-size: 0.9rem;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.6);
          color: #374151; /* ✅ Darker date text */
        }
        .glass {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 16px;
        }
        .glass-light {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          border-radius: 12px;
        }
        .glass-strong {
          background: rgba(255, 255, 255, 0.35);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .content-grid {
          padding: 2rem;
        }
        .section {
          margin-bottom: 2.5rem;
          padding: 1.5rem;
        }
        .section-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .section-number {
          background: rgba(37, 99, 235, 0.8);
          color: white;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          font-weight: 600;
        }
        .section h2 {
          font-size: 1.5rem;
          margin: 0;
          color: #111827; /* ✅ Dark headings */
        }
        .section p {
          color: #1f2937; /* ✅ Softer but dark body text */
          line-height: 1.6;
        }
        .cookie-card,
        .management-card,
        .duration-item {
          padding: 1rem;
          border-radius: 16px;
          display: flex;
          gap: 1rem;
          align-items: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .cookie-card:hover,
        .management-card:hover,
        .duration-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }
        .card-icon,
        .duration-icon {
          font-size: 1.5rem;
          background: rgba(37, 99, 235, 0.15);
          border-radius: 12px;
          padding: 0.75rem;
        }
        .contact-section {
          padding: 2rem;
        }
        .contact-card {
          text-align: center;
          padding: 2rem;
          border-radius: 20px;
          color: #111827; /* ✅ Dark text */
        }
        .contact-button {
          margin-top: 1rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.25);
          color: #1e40af;
          font-weight: 600;
          border-radius: 12px;
          backdrop-filter: blur(8px);
          transition: all 0.2s ease;
        }
        .contact-button:hover {
          transform: scale(1.05);
          background: rgba(255, 255, 255, 0.4);
        }
        .fade-in {
          animation: fadeIn 0.6s ease;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Cookies;
