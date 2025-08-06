import React, { useState, useEffect } from "react";
import Head from "next/head";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const CURRENCIES = {
  USD: { name: "US Dollar", symbol: "$" },
  EUR: { name: "Euro", symbol: "€" },
  GBP: { name: "British Pound", symbol: "£" },
  JPY: { name: "Japanese Yen", symbol: "¥" },
  AUD: { name: "Australian Dollar", symbol: "A$" },
  CAD: { name: "Canadian Dollar", symbol: "C$" },
  CHF: { name: "Swiss Franc", symbol: "Fr" },
  CNY: { name: "Chinese Yuan", symbol: "¥" },
  INR: { name: "Indian Rupee", symbol: "₹" },
  BRL: { name: "Brazilian Real", symbol: "R$" },
  RUB: { name: "Russian Ruble", symbol: "₽" },
  ZAR: { name: "South African Rand", symbol: "R" },
  MXN: { name: "Mexican Peso", symbol: "$" },
  SGD: { name: "Singapore Dollar", symbol: "S$" },
  NZD: { name: "New Zealand Dollar", symbol: "NZ$" },
  SEK: { name: "Swedish Krona", symbol: "kr" },
  NOK: { name: "Norwegian Krone", symbol: "kr" },
  DKK: { name: "Danish Krone", symbol: "kr" },
  PLN: { name: "Polish Złoty", symbol: "zł" },
  HKD: { name: "Hong Kong Dollar", symbol: "HK$" }
};


const FLAG_MAP = {
  USD: "us",
  EUR: "eu",
  GBP: "gb",
  JPY: "jp",
  AUD: "au",
  CAD: "ca",
  CHF: "ch",
  CNY: "cn",
  INR: "in",
  BRL: "br",
  RUB: "ru",
  ZAR: "za",
  MXN: "mx",
  SGD: "sg",
  NZD: "nz",
  SEK: "se",
  NOK: "no",
  DKK: "dk",
  PLN: "pl",
  HKD: "hk"
};


const USD_RATES = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 155.5, AUD: 1.51, CAD: 1.37,
  CHF: 0.87, CNY: 7.23, INR: 83.3, BRL: 5.27, RUB: 92.4, ZAR: 18.1,
  MXN: 16.7, SGD: 1.36, NZD: 1.62, SEK: 10.4, NOK: 10.5, DKK: 6.85,
  PLN: 4.05, HKD: 7.8
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
      code,
      value: RATES["USD"][code].toFixed(2),
      symbol: CURRENCIES[code].symbol,
    }));
    setPopular(data);
  }, []);

  return (
    <div className="currency-page">
      <Head>
        <title>Travel Currency Converter</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <div className="overlay">
        <div className="content-container">
          {/* Left: Graph */}
          <div className="chart-container">
            <h2 className="chart-title">{from} → {to} (7-Day Trend)</h2>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={graphData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#aaa" />
                <XAxis dataKey="day" stroke="#fff" />
                <YAxis stroke="#fff" domain={['dataMin - 0.01', 'dataMax + 0.01']} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Right: Converter */}
          <div className="converter-wrapper">
            <h1 className="title">Travel Currency Converter</h1>
            <p className="subtitle">Instantly plan your conversions for trips</p>

            <div className="converter-card">
              <div className="field-row">
                <div className="field">
                  <label>Amount</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    min="0"
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>From</label>
                  <div className="custom-select">
                    <img
                      src={`https://flagcdn.com/w40/${FLAG_MAP[from]}.png`}
                      alt={from}
                      className="flag"
                    />
                    <select value={from} onChange={(e) => setFrom(e.target.value)}>
                      {Object.keys(CURRENCIES).map((code) => (
                        <option key={code} value={code}>
                          {code} - {CURRENCIES[code].name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label>To</label>
                  <div className="custom-select">
                    <img
                      src={`https://flagcdn.com/w40/${FLAG_MAP[to]}.png`}
                      alt={to}
                      className="flag"
                    />
                    <select value={to} onChange={(e) => setTo(e.target.value)}>
                      {Object.keys(CURRENCIES).map((code) => (
                        <option key={code} value={code}>
                          {code} - {CURRENCIES[code].name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button className="convert-btn" onClick={convertCurrency}>
                Convert
              </button>

              {showResult && (
                <div className="credit-card-box">
                  <div className="credit-header">
                    <img src="https://cdn-icons-png.flaticon.com/512/2331/2331948.png" alt="card" className="card-icon" />
                    <h4>{from} → {to}</h4>
                  </div>
                  <div className="credit-body">
                    <h2>{converted} {CURRENCIES[to].symbol}</h2>
                    <p>{amount} {from} = {converted} {to}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Popular Conversions */}
            <div className="popular-section">
              <h3>Popular Conversions (1 USD)</h3>
              <div className="popular-grid">
                {popular.map((p) => (
                  <div key={p.code} className="pop-card">
                    <img
                      src={`https://flagcdn.com/w40/${FLAG_MAP[p.code]}.png`}
                      alt={p.code}
                      className="flag"
                      style={{ width: "24px", height: "18px", marginBottom: "4px" }}
                    />
                    <h4>{p.code}</h4>
                    <p>{p.value} {p.symbol}</p>
                  </div>

                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        .currency-page {
          min-height: 100vh;
          background: url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80")
            no-repeat center center / cover;
          font-family: 'Poppins', sans-serif;
        }
        .overlay {
          background: rgba(0,0,50,0.7);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
        }
        .content-container {
          display: flex;
          gap: 40px;
          max-width: 1200px;
          flex-wrap: nowrap;
          color: white;
        }
        .chart-container {
          flex: 1;
          min-width: 400px;
          background: rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 20px;
          backdrop-filter: blur(8px);
        }
        .converter-wrapper {
          flex: 1;
          text-align: center;
          min-width: 400px;
        }
        .title {
          font-size: 2.2rem;
          background: linear-gradient(90deg, #7dd3fc, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .subtitle {
          margin-bottom: 20px;
          color: #ccc;
        }
        .converter-card {
          background: rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 25px;
          margin-bottom: 20px;
          backdrop-filter: blur(10px);
        }
        .field-row {
          display: flex;
          gap: 15px;
          justify-content: space-between;
        }
        .field {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        input, select {
          padding: 12px;
          border-radius: 8px;
          border: none;
          font-size: 1rem;
          background: rgba(255,255,255,0.9);
          width: 100%;
        }
        .custom-select {
          position: relative;
          display: flex;
          align-items: center;
        }

        .custom-select .flag {
          width: 24px;
          height: 18px;
          margin-right: 8px;
          border-radius: 3px;
        }

        .convert-btn {
          margin-top: 20px;
          width: 100%;
          padding: 12px;
          background: linear-gradient(90deg, #38bdf8, #7c3aed);
          border: none;
          border-radius: 10px;
          color: white;
          font-weight: bold;
          cursor: pointer;
        }
        .credit-card-box {
          margin-top: 25px;
          padding: 20px;
          background: linear-gradient(135deg, #4f46e5, #06b6d4);
          color: white;
          border-radius: 15px;
          text-align: left;
        }
        .credit-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .card-icon {
          height: 30px;
        }
        .credit-body h2 {
          margin: 0;
          font-size: 2rem;
        }
        .popular-section {
          margin-top: 20px;
        }
        .popular-grid {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .pop-card {
          flex: 1;
          min-width: 100px;
          background: rgba(255,255,255,0.1);
          padding: 10px;
          border-radius: 8px;
          text-align: center;
          backdrop-filter: blur(6px);
        }
      `}</style>
    </div>
  );
}
