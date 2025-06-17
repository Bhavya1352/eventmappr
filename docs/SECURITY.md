# 🔐 Security Policy

## 📦 Supported Versions

We currently support the `main` branch of eventmappr. Older or archived branches may not receive security updates.

| Version | Supported |
|---------|-----------|
| main    | ✅ Yes    |
| others  | ❌ No     |

## 🚨 Reporting a Vulnerability

If you find a security vulnerability in eventmappr, **please report it privately** to prevent misuse.

Instead, report it discreetly by emailing the maintainer.

Please include:
-  A detailed description of the issue  
-  Steps to reproduce the vulnerability (if applicable)  
-  The impact and potential threat level  
-  Suggested fixes or recommendations (optional but helpful)

We aim to:
- ⏱️ Acknowledge your report within **3 working days**
- 🛠️ Investigate and patch valid issues within **14 days**, depending on severity

## 🛡️ Scope of Vulnerability Reporting

You're encouraged to report:
- XSS (Cross-Site Scripting)  
- CSRF vulnerabilities  
- Open redirects  
- Exposure of sensitive event or location data  
- Authentication/authorization bypass  
- Insecure API endpoints

Please **do not** report:
-  Automated scans without proof-of-concept  
-  Issues in third-party dependencies unless directly exploitable  
-  Outdated libraries with no active exploitation path

## ⚖️ Responsible Testing Guidelines

-  Avoid running disruptive tests on any live deployment  
-  Do not access, modify, or delete user/admin data  
-  Use test accounts where available  
-  Do not publicly disclose vulnerabilities before they are patched

## 👨‍💻 Recommendations for Developers

If contributing to eventmappr:
-  Sanitize all user inputs (especially location/event names)  
-  Validate coordinates and form data on both client and server sides  
-  Avoid exposing sensitive API keys or secrets  
-  Use secure headers and enforce HTTPS

## 🔧 Dependencies and Maintenance

This project may use:
-  React  
-  Map APIs (e.g., Leaflet, Google Maps)  
-  Node.js/Express (if backend exists)  
-  Firebase or other cloud services

🔍 Run `npm audit` and `npm audit fix` regularly to check for vulnerabilities.

## 📢 Disclosure Policy

We believe in responsible disclosure and value input from the developer and security community. All valid reports will be acknowledged and credited (if desired).

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability)
---

🙏 Thank you for helping keep **eventmappr** safe for everyone!
