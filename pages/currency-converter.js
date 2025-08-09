import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, ArrowRightLeft, DollarSign, ChevronDown } from "lucide-react";
import { Bell } from "lucide-react"; // New icon for alert feature

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


  const [alertFrom, setAlertFrom] = useState("USD");
  const [alertTo, setAlertTo] = useState("EUR");
  const [alertCondition, setAlertCondition] = useState(">");
  const [alertThreshold, setAlertThreshold] = useState("");
  const [alertEmail, setAlertEmail] = useState("");
  const [alertActive, setAlertActive] = useState(false);


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
      <label style={styles.label}>{label}</label>
      <div style={styles.dropdownContainer}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{...styles.dropdownButton, ...(isOpen ? styles.dropdownButtonOpen : {})}}
        >
          <div style={styles.dropdownSelected}>
            <span style={styles.currencyCode}>{value}</span>
            <span style={styles.currencyName}>{CURRENCIES[value].name}</span>
          </div>
          <ChevronDown style={{...styles.chevronIcon, ...(isOpen ? styles.chevronRotated : {})}} />
        </button>
        {isOpen && (
          <div style={styles.dropdownMenu}>
            {Object.entries(CURRENCIES).map(([code, curr]) => (
              <button
                key={code}
                onClick={() => {
                  onChange(code);
                  setIsOpen(false);
                }}
                style={{...styles.dropdownItem, ...(value === code ? styles.dropdownItemActive : {})}}
              >
                <div style={styles.dropdownItemContent}>
                  <span style={styles.dropdownCode}>{code}</span>
                  <span style={styles.dropdownName}>{curr.name}</span>
                </div>
                <span style={styles.dropdownSymbol}>{curr.symbol}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div style={styles.container}>
        <div style={styles.wrapper}>
          <div style={styles.header}>
            <div style={styles.titleRow}>
              <DollarSign style={styles.headerIcon} />
              <h1 style={styles.title}>Currency Exchange</h1>
            </div>
            <p style={styles.subtitle}>Real-time currency conversion for global travelers</p>
          </div>
          {alertMessage && (
  <div style={styles.alertBox}>
    <span>{alertMessage}</span>
    <button onClick={() => setAlertMessage("")} style={styles.alertCloseBtn}>
      &times;
    </button>
  </div>
)}

          <div style={styles.mainGrid}>
            <div style={styles.leftColumn}>
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>
                  <ArrowRightLeft style={styles.cardIcon} />
                  Convert Currency
                </h2>
                
                <div style={styles.formSection}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Amount</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      style={styles.input}
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
                    <button onClick={swapCurrencies} style={styles.swapButton}>
                      <ArrowRightLeft style={styles.buttonIcon} />
                      Swap
                    </button>
                    <button onClick={convertCurrency} style={styles.convertButton}>
                      Convert
                    </button>
                  </div>

                  {showResult && (
                    <div style={styles.resultCard}>
                      <div style={styles.resultContent}>
                        <p style={styles.resultLabel}>{amount} {from} equals</p>
                        <p style={styles.resultAmount}>
                          {converted} {CURRENCIES[to].symbol}
                        </p>
                        <p style={styles.resultRate}>
                          Rate: 1 {from} = {RATES[from][to]} {to}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={styles.card}>
                <h3 style={styles.sectionTitle}>Popular USD Rates</h3>
                <div style={styles.popularGrid}>
                  {popular.map((p) => (
                    <div key={p.code} style={styles.popularCard}>
                      <p style={styles.popularCode}>{p.code}</p>
                      <p style={styles.popularValue}>{p.value} {p.symbol}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={styles.rightColumn}>
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>
                  <TrendingUp style={styles.cardIcon} />
                  {from} → {to} Trend
                </h2>
                <div style={styles.chartContainer}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={graphData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="day" stroke="#64748b" />
                      <YAxis stroke="#64748b" domain={['dataMin - 0.01', 'dataMax + 0.01']} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          color: '#334155',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5, stroke: '#3b82f6', strokeWidth: 2 }}
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
      `}</style>
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)',
    padding: '32px 16px',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
  },
  wrapper: {
    maxWidth: '1400px',
    margin: '0 auto'
  },
  alertBox: {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  backgroundColor: "#059669",
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
    color: '#64748b',
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
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
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
    color: '#374151',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    padding: '16px',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    color: '#1e293b',
    fontSize: '1.125rem',
    outline: 'none',
    transition: 'all 0.2s ease',
    ':focus': {
      borderColor: '#3b82f6',
      backgroundColor: 'white'
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
  dropdownButtonOpen: {
    borderColor: '#3b82f6',
    backgroundColor: 'white',
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
    color: '#6b7280'
  },
  chevronIcon: {
    width: '20px',
    height: '20px',
    color: '#6b7280',
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
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    marginTop: '4px',
    maxHeight: '200px',
    overflowY: 'auto',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
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
    ':hover': {
      backgroundColor: '#f8fafc'
    }
  },
  dropdownItemActive: {
    backgroundColor: '#eff6ff',
    color: '#2563eb'
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
    color: '#6b7280'
  },
  dropdownSymbol: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151'
  },
  select: {
    width: '100%',
    padding: '16px',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    color: '#1e293b',
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
    background: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    color: '#475569',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '1rem',
    ':hover': {
      backgroundColor: '#e2e8f0'
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
    background: 'linear-gradient(90deg, #ecfdf5, #dbeafe)',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #a7f3d0'
  },
  resultContent: {
    textAlign: 'center'
  },
  resultLabel: {
    color: '#6b7280',
    marginBottom: '8px',
    fontSize: '0.875rem'
  },
  resultAmount: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1e293b'
  },
  resultRate: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '8px'
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '16px'
  },
  popularGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '16px'
  },
  popularCard: {
    background: '#f8fafc',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid #e2e8f0',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#f1f5f9'
    }
  },
  popularCode: {
    color: '#6b7280',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  popularValue: {
    color: '#1e293b',
    fontWeight: '600',
    marginTop: '4px'
  },
  chartContainer: {
    height: '320px'
  }
};