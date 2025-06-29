import React from 'react';

function Privacy() {
  return (
    <div className="privacy-page">
      <h1 className="title">🔒 Privacy Policy</h1>
      <p className="updated">Last updated: June 29, 2025</p>

      <section className="section">
        <h2>1. Introduction</h2>
        <p>
          At EventMappr, your privacy is a top priority. This policy explains how we handle your personal information and protect your data when you interact with our platform.
        </p>
      </section>

      <section className="section">
        <h2>2. What We Collect</h2>
        <ul>
          <li>👤 Name, Email, Contact Details</li>
          <li>🌐 Browsing behavior and interaction history</li>
          <li>📍 Location data (if you allow it)</li>
        </ul>
      </section>

      <section className="section">
        <h2>3. How We Use Your Information</h2>
        <p>
          We use your data to provide better recommendations, improve your user experience, and keep you informed about relevant events. We never sell your data.
        </p>
      </section>

      <section className="section">
        <h2>4. Contact Us</h2>
        <p>
          Got questions? Email us at <a href="mailto:support@eventmappr.com">support@eventmappr.com</a>.
        </p>
      </section>

      <section className="section">
        <h2>5. Data Retention</h2>
        <p>
          We retain your personal data only as long as necessary for the purposes described in this Privacy Policy, or as required by law. You may request deletion of your information at any time.
        </p>
      </section>

      <section className="section">
        <h2>6. Your Rights</h2>
        <p>
          You have the right to access, correct, or delete your personal data. You may also object to or restrict certain processing activities. Contact us to exercise your rights.
        </p>
      </section>

      <section className="section">
        <h2>7. Third-Party Services</h2>
        <p>
          Our platform may contain links to third-party websites or services. We are not responsible for their privacy practices, and we encourage you to review their privacy policies.
        </p>
      </section>

      <style jsx>{`
        :root {
          --bg-color: #e6f0ff;
          --text-color: #0a1f44;
          --title-color: #003d99;
          --section-title-color: #005ce6;
          --muted-text-color: #4a6fa5;
          --list-item-color: #123870;
          --link-color: #0041c2;
          --link-hover-color: #002e8a;
          --box-shadow: 0 8px 32px rgba(0, 64, 128, 0.1);
          transition-duration: 0.15s;
        }

        [data-theme='dark'] {
          --bg-color: #0b132b;
          --text-color: #e0ecff;
          --title-color: #669cff;
          --section-title-color: #80b3ff;
          --muted-text-color: #a0b9df;
          --list-item-color: #c4d9f8;
          --link-color: #80b3ff;
          --link-hover-color: #a3caff;
          --box-shadow: 0 8px 32px rgba(0, 123, 255, 0.2);
          transition-duration: 0.15s;
        }

        .privacy-page {
          max-width: 900px;
          margin: 10px auto;
          padding: 30px;
          background: var(--bg-color);
          border-radius: 16px;
          box-shadow: var(--box-shadow);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: var(--text-color);
          animation: fadeIn 0.5s ease-in-out;
          transition: background-color 0.015s ease, color 0.015s ease;
        }

        .title {
          font-size: 2.75rem;
          font-weight: 800;
          color: var(--title-color);
          margin-bottom: 10px;
        }

        .updated {
          font-size: 0.95rem;
          color: var(--muted-text-color);
          margin-bottom: -20px;
        }

        .section {
          margin-bottom: -100px;
        }

        h2 {
          font-size: 1.5rem;
          color: var(--section-title-color);
          margin-bottom: 12px;
        }

        p {
          font-size: 1.05rem;
          line-height: 1.7;
          color: var(--list-item-color);
        }

        ul {
          padding-left: 20px;
          list-style-type: '🔹 ';
        }

        li {
          margin-bottom: 10px;
          font-size: 1.05rem;
          color: var(--list-item-color);
        }

        a {
          color: var(--link-color);
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
          color: var(--link-hover-color);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
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

export default Privacy;