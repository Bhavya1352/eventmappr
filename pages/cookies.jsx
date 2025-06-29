import React from 'react';

function Cookies() {
  return (
    <div className="page">
      <h1 className="title">🍪 Cookie Policy</h1>
      <p className="updated">Last updated: June 29, 2025</p>

      <section className="section">
        <h2>1. What Are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device to help us improve your experience and analyze usage.
        </p>
      </section>

      <section className="section">
        <h2>2. How We Use Cookies</h2>
        <p>
          We use cookies to remember user preferences, enable core functionalities, and gather analytics through third-party services.
        </p>
      </section>

      <section className="section">
        <h2>3. Managing Cookies</h2>
        <p>
          You can manage or disable cookies in your browser settings. Disabling some cookies may impact functionality.
        </p>
      </section>

      <section className="section">
        <h2>4. Contact</h2>
        <p>
          For more details, reach out at <a href="mailto:support@eventmappr.com">support@eventmappr.com</a>.
        </p>
      </section>

      <section className="section">
        <h2>5. Types of Cookies We Use</h2>
        <p>
          We use both session and persistent cookies. Session cookies expire once you close your browser, while persistent cookies remain on your device for a set period or until deleted.
        </p>
      </section>

      <section className="section">
        <h2>6. Changes to This Policy</h2>
        <p>
          We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
        </p>
      </section>

      <style jsx>{`
        .page {
          max-width: 900px;
          margin: 60px auto;
          padding: 30px;
          background: var(--bg-color);
          border-radius: 16px;
          box-shadow: var(--box-shadow);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: var(--text-color);
          transition: background-color 0.15s ease, color 0.15s ease;
        }

        .title {
          font-size: 2.5rem;
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
          color: var(--section-title-color);
          margin-bottom: 12px;
        }

        p {
          font-size: 1.05rem;
          line-height: 1.7;
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
      `}</style>
    </div>
  );
}

export default Cookies;