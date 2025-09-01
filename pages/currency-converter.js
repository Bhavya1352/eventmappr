import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, ArrowRightLeft, DollarSign, ChevronDown, Moon, Sun, Bell, Currency } from "lucide-react";
import Head from "next/head";


const CURRENCIES = {
  USD: { name: "US Dollar", symbol: "$" }, EUR: { name: "Euro", symbol: "€" },
  GBP: { name: "British Pound", symbol: "£" }, JPY: { name: "Japanese Yen", symbol: "¥" },
  AUD: { name: "Australian Dollar", symbol: "A$" }, CAD: { name: "Canadian Dollar", symbol: "C$" },
  CHF: { name: "Swiss Franc", symbol: "Fr" }, CNY: { name: "Chinese Yuan", symbol: "¥" },
  INR: { name: "Indian Rupee", symbol: "₹" }, BRL: { name: "Brazilian Real", symbol: "R$" }
};

const USD_RATES = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 155.5, AUD: 1.51, CAD: 1.37,
  CHF: 0.87, CNY: 7.23, INR: 83.3, BRL: 5.27
};

function buildRates() {
  const rates = {};
  for (const from in USD_RATES) {
    rates[from] = {};
    for (const to in USD_RATES) {
      rates[from][to] = +(USD_RATES[to] / USD_RATES[from]).toFixed(4);
    }
  }
  return rates;
}
const RATES = buildRates();

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [converted, setConverted] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [popular, setPopular] = useState([]);
  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [alertFrom, setAlertFrom] = useState("USD");
  const [alertTo, setAlertTo] = useState("EUR");
  const [alertCondition, setAlertCondition] = useState(">");
  const [alertThreshold, setAlertThreshold] = useState("");
  const [alertEmail, setAlertEmail] = useState("");
  const [alertActive, setAlertActive] = useState(false);

  // Theme state will be read from document.documentElement.classList
  useEffect(() => {
    // Listen for theme changes from navbar
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    
    checkTheme(); // Initial check
    
    // Listen for changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);


  function convertCurrency() {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt < 0) {
      setConverted("");
      setShowResult(false);
      return;
    }
    const rate = RATES[from][to];
    const result = (amt * rate).toFixed(2);
    setConverted(result);
    setShowResult(true);
  }

  useEffect(() => {
    if (showResult) convertCurrency();
  }, [from, to]);

  useEffect(() => {
    const rate = RATES[from][to];
    const newData = Array.from({ length: 7 }, (_, i) => ({
      day: `Day ${i + 1}`,
      value: +(rate * (1 + (Math.random() - 0.5) * 0.05)).toFixed(4),
    }));
    setGraphData(newData);
  }, [from, to]);

  useEffect(() => {
    const top = ["EUR", "INR", "JPY", "GBP", "AUD"];
    const data = top.map((code) => ({
      code, value: RATES["USD"][code].toFixed(2), symbol: CURRENCIES[code].symbol,
    }));
    setPopular(data);
  }, []);

  const swapCurrencies = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };
  useEffect(() => {
  if (!alertActive) return;
  const checkInterval = setInterval(() => {
    const currentRate = RATES[alertFrom][alertTo];
    if (
      (alertCondition === ">" && currentRate > parseFloat(alertThreshold)) ||
      (alertCondition === "<" && currentRate < parseFloat(alertThreshold))
    ) {
      // Show custom alert UI
      setAlertMessage(`📢 Rate Alert: 1 ${alertFrom} is now ${currentRate} ${alertTo}`);
      setAlertActive(false); // stop after triggering once
    }
  }, 5000);
  return () => clearInterval(checkInterval);
}, [alertActive, alertFrom, alertTo, alertCondition, alertThreshold]);


  const CustomDropdown = ({ value, onChange, isOpen, setIsOpen, label }) => (
    <div style={styles.selectGroup}>
      <label style={isDarkMode ? styles.labelDark : styles.labelLight}>{label}</label>
      <div style={styles.dropdownContainer}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{...(isDarkMode ? styles.dropdownButtonDark : styles.dropdownButtonLight), ...(isOpen ? (isDarkMode ? styles.dropdownButtonOpenDark : styles.dropdownButtonOpenLight) : {})}}
        >
          <div style={styles.dropdownSelected}>
            <span style={styles.currencyCode}>{value}</span>
            <span style={isDarkMode ? styles.currencyNameDark : styles.currencyNameLight}>{CURRENCIES[value].name}</span>
          </div>
          <ChevronDown style={{...(isDarkMode ? styles.chevronIconDark : styles.chevronIconLight), ...(isOpen ? styles.chevronRotated : {})}} />
        </button>
        {isOpen && (
          <div style={isDarkMode ? styles.dropdownMenuDark : styles.dropdownMenuLight}>
            {Object.entries(CURRENCIES).map(([code, curr]) => (
              <button
                key={code}
                onClick={() => {
                  onChange(code);
                  setIsOpen(false);
                }}
                style={{...(isDarkMode ? styles.dropdownItemDark : styles.dropdownItemLight), ...(value === code ? styles.dropdownItemActive : {})}}
              >
                <div style={styles.dropdownItemContent}>
                  <span style={styles.dropdownCode}>{code}</span>
                  <span style={isDarkMode ? styles.dropdownNameDark : styles.dropdownNameLight}>{curr.name}</span>
                </div>
                <span style={isDarkMode ? styles.dropdownSymbolDark : styles.dropdownSymbolLight}>{curr.symbol}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Currency Converter | EventMappr</title>
        <meta name="description" content="Real-time currency conversion for global travelers" />
      </Head>

      {/* CSS Variables for theming */}
      <style jsx global>{`
        :root {
          --bg-primary: #ffffff;
          --bg-secondary: #f8fafc;
          --bg-gradient: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%);
          --text-primary: #1f2937;
          --text-secondary: #6b7280;
          --text-muted: #9ca3af;
          --border-color: #e5e7eb;
          --card-bg: #ffffff;
          --card-border: #e5e7eb;
          --input-bg: #f9fafb;
          --button-bg: #f3f4f6;
        }

        html.dark {
          --bg-primary: #000000;
          --bg-secondary: #111111;
          --bg-gradient: #000000;
          --text-primary: #ffffff;
          --text-secondary: #e5e7eb;
          --text-muted: #9ca3af;
          --border-color: #374151;
          --card-bg: #000000;
          --card-border: #374151;
          --input-bg: #111111;
          --button-bg: #1f2937;
        }
      `}</style>

      <div className={`currency-converter${isDarkMode ? ' dark' : ''}`}>
        <div className="wrapper">
          <div className="header">
            <div className="title-row">
              <DollarSign className="header-icon" />
              <h1 className="title">Currency Exchange</h1>
            </div>
            <p className="subtitle">Real-time currency conversion for global travelers</p>
          </div>
          {alertMessage && (
            <div className="alert-box">
              <span>{alertMessage}</span>
              <button onClick={() => setAlertMessage("")} className="alert-close">
                &times;
              </button>
            </div>
          )}

          <div className="main-grid">
            <div className="left-column">
              <div className="card">
                <h2 style={isDarkMode ? styles.cardTitleDark : styles.cardTitleLight}>
                  <ArrowRightLeft style={styles.cardIcon} />
                  Convert Currency
                </h2>
                <div style={styles.formSection}>
                  <div style={styles.inputGroup}>
                    <label style={isDarkMode ? styles.labelDark : styles.labelLight}>Amount</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      style={isDarkMode ? styles.inputDark : styles.inputLight}
                    />
                  </div>
                  <div style={styles.selectRow}>
                    <CustomDropdown
                      value={from}
                      onChange={setFrom}
                      isOpen={fromDropdownOpen}
                      setIsOpen={setFromDropdownOpen}
                      label="From"
                    />
                    <CustomDropdown
                      value={to}
                      onChange={setTo}
                      isOpen={toDropdownOpen}
                      setIsOpen={setToDropdownOpen}
                      label="To"
                    />
                  </div>
                  <div style={styles.buttonRow}>
                    <button 
                      onClick={swapCurrencies} 
                      style={isDarkMode ? styles.swapButtonDark : styles.swapButtonLight}
                    >
                      <ArrowRightLeft style={styles.buttonIcon} />
                      Swap
                    </button>
                    <button 
                      onClick={convertCurrency} 
                      style={styles.convertButton}
                    >
                      Convert
                    </button>
                  </div>
                  {showResult && (
                    <div style={isDarkMode ? styles.resultCardDark : styles.resultCardLight}>
                      <div style={styles.resultContent}>
                        <p style={isDarkMode ? styles.resultLabelDark : styles.resultLabelLight}>{amount} {from} equals</p>
                        <p style={isDarkMode ? styles.resultAmountDark : styles.resultAmountLight}>
                          {converted} {CURRENCIES[to].symbol}
                        </p>
                        <p style={isDarkMode ? styles.resultRateDark : styles.resultRateLight}>
                          Rate: 1 {from} = {RATES[from][to]} {to}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div style={isDarkMode ? styles.cardDark : styles.cardLight}>
                <h3 style={isDarkMode ? styles.sectionTitleDark : styles.sectionTitleLight}>Popular USD Rates</h3>
                <div style={styles.popularGrid}>
                  {popular.map((p) => (
                    <div 
                      key={p.code} 
                      style={isDarkMode ? styles.popularCardDark : styles.popularCardLight}
                    >
                      <p style={isDarkMode ? styles.popularCodeDark : styles.popularCodeLight}>{p.code}</p>
                      <p style={isDarkMode ? styles.popularValueDark : styles.popularValueLight}>{p.value} {p.symbol}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={styles.rightColumn}>
              <div style={isDarkMode ? styles.cardDark : styles.cardLight}>
                <h2 style={isDarkMode ? styles.cardTitleDark : styles.cardTitleLight}>
                  <TrendingUp style={styles.cardIcon} />
                  {from} → {to} Trend
                </h2>
                <div style={styles.chartContainer}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={graphData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#4a5568" : "#e2e8f0"} />
                      <XAxis dataKey="day" stroke={isDarkMode ? "#a0aec0" : "#6b7280"} />
                      <YAxis stroke={isDarkMode ? "#a0aec0" : "#6b7280"} domain={['dataMin - 0.01', 'dataMax + 0.01']} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDarkMode ? '#2d3748' : '#ffffff',
                          border: isDarkMode ? '1px solid #4a5568' : '1px solid #e2e8f0',
                          borderRadius: '12px',
                          color: isDarkMode ? '#e2e8f0' : '#1f2937',
                          boxShadow: isDarkMode ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#63b3ed"
                        strokeWidth={2}
                        dot={{ fill: '#63b3ed', strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5, stroke: '#63b3ed', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .currency-converter {
          min-height: 100vh;
          background: var(--bg-gradient);
          color: var(--text-primary);
          padding: 32px 16px;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .wrapper {
          max-width: 1400px;
          margin: 0 auto;
        }

        .header {
          text-align: center;
          margin-bottom: 48px;
        }

        .title-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .header-icon {
          width: 32px;
          height: 32px;
          color: #059669;
        }

        .title {
          font-size: 3rem;
          font-weight: 700;
          background: linear-gradient(90deg, #059669, #0ea5e9, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          color: var(--text-secondary);
          font-size: 1.125rem;
        }

        .theme-toggle {
          background: var(--button-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .theme-toggle:hover {
          background: var(--bg-secondary);
          transform: scale(1.05);
        }

        .main-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        .left-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .card {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 32px;
          border: 1px solid var(--card-border);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .alert-box {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: #059669;
          color: white;
          padding: 16px 24px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4);
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 600;
          max-width: 320px;
          z-index: 1000;
        }

        .alert-close {
          background: transparent;
          border: none;
          color: white;
          font-size: 20px;
          font-weight: 700;
          cursor: pointer;
          line-height: 1;
        }

        @media (max-width: 1024px) {
          .main-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .title {
            font-size: 2.5rem;
          }
          .currency-converter {
            padding: 24px 12px;
          }
        }
      `}</style>
    </>
  );
}

const styles = {
  // Light Theme Styles
  containerLight: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)',
    padding: '32px 16px',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    color: '#1f2937'
  },
  // Dark Theme Styles
  containerDark: {
    minHeight: '100vh',
    background: '#000000',
    padding: '32px 16px',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    color: '#ffffff'
  },
  wrapper: {
    maxWidth: '1400px',
    margin: '0 auto'
  },
  // Theme Toggle Button
  themeToggleLight: {
    background: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  themeToggleDark: {
    background: '#374151',
    border: '1px solid #4b5563',
    borderRadius: '8px',
    padding: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: '#f9fafb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  alertBox: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
    color: "white",
    padding: "16px 24px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(5, 150, 105, 0.4)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontWeight: "600",
    maxWidth: "320px",
    zIndex: 1000,
  },
  alertCloseBtn: {
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "20px",
    fontWeight: "700",
    cursor: "pointer",
    lineHeight: "1",
  },
  header: {
    textAlign: 'center',
    marginBottom: '48px'
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '16px'
  },
  headerIcon: {
    width: '32px',
    height: '32px',
    color: '#059669'
  },
  title: {
    fontSize: '3rem',
    fontWeight: '700',
    background: 'linear-gradient(90deg, #059669, #0ea5e9, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  subtitle: {
    color: '#a0a0a0',
    fontSize: '1.125rem'
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '32px',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr'
    }
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column'
  },
  card: {
    background: '#000000',
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid #333333',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
    color: '#ffffff'
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '24px'
  },
  cardIcon: {
    width: '24px',
    height: '24px',
    color: '#3b82f6'
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#e2e8f0',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    padding: '16px',
    background: '#000000',
    border: '1px solid #333333',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '1.125rem',
    outline: 'none',
    transition: 'all 0.2s ease',
    ':focus': {
      borderColor: '#3b82f6',
      backgroundColor: '#111111'
    }
  },
  selectRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  selectGroup: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  dropdownContainer: {
    position: 'relative'
  },
  dropdownButton: {
    width: '100%',
    padding: '16px',
    background: '#000000',
    border: '1px solid #333333',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'left'
  },
  dropdownButtonOpen: {
    borderColor: '#3b82f6',
    backgroundColor: '#111111',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
  },
  dropdownSelected: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  currencyCode: {
    fontWeight: '600',
    fontSize: '1rem'
  },
  currencyName: {
    fontSize: '0.875rem',
    color: '#a0a0a0'
  },
  chevronIcon: {
    width: '20px',
    height: '20px',
    color: '#a0a0a0',
    transition: 'transform 0.2s ease'
  },
  chevronRotated: {
    transform: 'rotate(180deg)'
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: '0',
    right: '0',
    zIndex: 50,
    background: '#000000',
    border: '1px solid #333333',
    borderRadius: '12px',
    marginTop: '4px',
    maxHeight: '200px',
    overflowY: 'auto',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
  },
  dropdownItem: {
    width: '100%',
    padding: '12px 16px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'background-color 0.15s ease',
    textAlign: 'left',
    color: '#ffffff',
    ':hover': {
      backgroundColor: '#111111'
    }
  },
  dropdownItemActive: {
    backgroundColor: '#1e3a8a',
    color: '#93c5fd'
  },
  dropdownItemContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  dropdownCode: {
    fontWeight: '600',
    fontSize: '0.875rem'
  },
  dropdownName: {
    fontSize: '0.8rem',
    color: '#a0a0a0'
  },
  dropdownSymbol: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#e2e8f0'
  },
  select: {
    width: '100%',
    padding: '16px',
    background: '#000000',
    border: '1px solid #333333',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s ease'
  },
  buttonRow: {
    display: 'flex',
    gap: '16px'
  },
  swapButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: '#111111',
    border: '1px solid #333333',
    borderRadius: '12px',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '1rem',
    ':hover': {
      backgroundColor: '#222222'
    }
  },
  buttonIcon: {
    width: '16px',
    height: '16px'
  },
  convertButton: {
    flex: 1,
    padding: '16px',
    background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '1rem',
    boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)',
    ':hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 6px 20px rgba(59, 130, 246, 0.35)'
    }
  },
  resultCard: {
    background: 'linear-gradient(90deg, #001a0d, #001133)',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #059669'
  },
  resultContent: {
    textAlign: 'center'
  },
  resultLabel: {
    color: '#a0a0a0',
    marginBottom: '8px',
    fontSize: '0.875rem'
  },
  resultAmount: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#ffffff'
  },
  resultRate: {
    fontSize: '0.875rem',
    color: '#a0a0a0',
    marginTop: '8px'
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '16px'
  },
  popularGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '16px'
  },
  popularCard: {
    background: '#3a3a3a',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid #555555',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#404040'
    }
  },
  popularCode: {
    color: '#a0a0a0',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  popularValue: {
    color: '#ffffff',
    fontWeight: '600',
    marginTop: '4px'
  },
  chartContainer: {
    height: '320px'
  },
  
  // Light Theme Specific Styles
  subtitleLight: {
    color: '#64748b',
    fontSize: '1.125rem'
  },
  cardLight: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    color: '#1f2937'
  },
  cardTitleLight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '24px'
  },
  labelLight: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px'
  },
  inputLight: {
    width: '100%',
    padding: '16px',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    color: '#1e293b',
    fontSize: '1.125rem',
    outline: 'none',
    transition: 'all 0.2s ease'
  },
  swapButtonLight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    color: '#475569',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '1rem'
  },
  resultCardLight: {
    background: 'linear-gradient(90deg, #ecfdf5, #dbeafe)',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #a7f3d0'
  },
  resultLabelLight: {
    color: '#6b7280',
    marginBottom: '8px',
    fontSize: '0.875rem'
  },
  resultAmountLight: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1e293b'
  },
  resultRateLight: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '8px'
  },
  sectionTitleLight: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '16px'
  },
  popularCardLight: {
    background: '#f8fafc',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid #e2e8f0',
    textAlign: 'center',
    transition: 'all 0.2s ease'
  },
  popularCodeLight: {
    color: '#6b7280',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  popularValueLight: {
    color: '#1e293b',
    fontWeight: '600',
    marginTop: '4px'
  },
  dropdownButtonLight: {
    width: '100%',
    padding: '16px',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    color: '#1e293b',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'left'
  },
  dropdownButtonOpenLight: {
    borderColor: '#3b82f6',
    backgroundColor: 'white',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
  },
  currencyNameLight: {
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  chevronIconLight: {
    width: '20px',
    height: '20px',
    color: '#6b7280',
    transition: 'transform 0.2s ease'
  },
  dropdownMenuLight: {
    position: 'absolute',
    top: '100%',
    left: '0',
    right: '0',
    zIndex: 50,
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    marginTop: '4px',
    maxHeight: '200px',
    overflowY: 'auto',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  },
  dropdownItemLight: {
    width: '100%',
    padding: '12px 16px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'background-color 0.15s ease',
    textAlign: 'left',
    color: '#1f2937'
  },
  dropdownNameLight: {
    fontSize: '0.8rem',
    color: '#6b7280'
  },
  dropdownSymbolLight: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151'
  },

  // Dark Theme Specific Styles
  subtitleDark: {
    color: '#a0a0a0',
    fontSize: '1.125rem'
  },
  cardDark: {
    background: '#000000',
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid #333333',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
    color: '#ffffff'
  },
  cardTitleDark: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '24px'
  },
  labelDark: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#e2e8f0',
    marginBottom: '8px'
  },
  inputDark: {
    width: '100%',
    padding: '16px',
    background: '#000000',
    border: '1px solid #333333',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '1.125rem',
    outline: 'none',
    transition: 'all 0.2s ease'
  },
  swapButtonDark: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: '#111111',
    border: '1px solid #333333',
    borderRadius: '12px',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '1rem'
  },
  resultCardDark: {
    background: 'linear-gradient(90deg, #001a0d, #001133)',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #059669'
  },
  resultLabelDark: {
    color: '#a0a0a0',
    marginBottom: '8px',
    fontSize: '0.875rem'
  },
  resultAmountDark: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#ffffff'
  },
  resultRateDark: {
    fontSize: '0.875rem',
    color: '#a0a0a0',
    marginTop: '8px'
  },
  sectionTitleDark: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '16px'
  },
  popularCardDark: {
    background: '#000000',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid #333333',
    textAlign: 'center',
    transition: 'all 0.2s ease'
  },
  popularCodeDark: {
    color: '#a0a0a0',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  popularValueDark: {
    color: '#ffffff',
    fontWeight: '600',
    marginTop: '4px'
  },
  dropdownButtonDark: {
    width: '100%',
    padding: '16px',
    background: '#000000',
    border: '1px solid #333333',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'left'
  },
  dropdownButtonOpenDark: {
    borderColor: '#3b82f6',
    backgroundColor: '#111111',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
  },
  currencyNameDark: {
    fontSize: '0.875rem',
    color: '#a0a0a0'
  },
  chevronIconDark: {
    width: '20px',
    height: '20px',
    color: '#a0a0a0',
    transition: 'transform 0.2s ease'
  },
  dropdownMenuDark: {
    position: 'absolute',
    top: '100%',
    left: '0',
    right: '0',
    zIndex: 50,
    background: '#000000',
    border: '1px solid #333333',
    borderRadius: '12px',
    marginTop: '4px',
    maxHeight: '200px',
    overflowY: 'auto',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
  },
  dropdownItemDark: {
    width: '100%',
    padding: '12px 16px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'background-color 0.15s ease',
    textAlign: 'left',
    color: '#ffffff'
  },
  dropdownNameDark: {
    fontSize: '0.8rem',
    color: '#a0a0a0'
  },
  dropdownSymbolDark: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#e2e8f0'
  }
};