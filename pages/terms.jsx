import React from 'react';

function Terms() {
  return (
    <div className="page">
      <h1 className="title">📄 Terms of Service</h1>
      <p className="updated">Last updated: June 29, 2025</p>

      <section className="section">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By using EventMappr, you agree to be bound by these Terms of Service. If you do not agree, you may not access or use the platform.
        </p>
      </section>

      <section className="section">
        <h2>2. User Responsibilities</h2>
        <p>
          Users must provide accurate information and use the platform only for lawful purposes. Misuse may result in termination of access.
        </p>
      </section>

      <section className="section">
        <h2>3. Modification of Terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of the platform implies acceptance of any changes.
        </p>
      </section>

      <section className="section">
        <h2>4. Contact</h2>
        <p>
          For questions regarding these Terms, contact us at <a href="mailto:support@eventmappr.com">support@eventmappr.com</a>.
        </p>
      </section>

      <section className="section">
        <h2>5. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your access to EventMappr at any time, without notice, if we believe you have violated these Terms or applicable laws.
        </p>
      </section>

      <section className="section">
        <h2>6. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of your jurisdiction, without regard to its conflict of law provisions.
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

export default Terms;