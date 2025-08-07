import React, { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, ArrowRightLeft, DollarSign, ChevronDown } from "lucide-react";

// --- DATA & HELPERS ---

// An expanded dictionary of supported currencies with names, symbols, and country codes for flags.
const CURRENCIES = {
    USD: { name: "US Dollar", symbol: "$", countryCode: "us" },
    EUR: { name: "Euro", symbol: "€", countryCode: "eu" },
    JPY: { name: "Japanese Yen", symbol: "¥", countryCode: "jp" },
    GBP: { name: "British Pound", symbol: "£", countryCode: "gb" },
    AUD: { name: "Australian Dollar", symbol: "A$", countryCode: "au" },
    CAD: { name: "Canadian Dollar", symbol: "C$", countryCode: "ca" },
    CHF: { name: "Swiss Franc", symbol: "Fr", countryCode: "ch" },
    CNY: { name: "Chinese Yuan", symbol: "¥", countryCode: "cn" },
    INR: { name: "Indian Rupee", symbol: "₹", countryCode: "in" },
    BRL: { name: "Brazilian Real", symbol: "R$", countryCode: "br" },
    RUB: { name: "Russian Ruble", symbol: "₽", countryCode: "ru" },
    KRW: { name: "South Korean Won", symbol: "₩", countryCode: "kr" },
    SGD: { name: "Singapore Dollar", symbol: "S$", countryCode: "sg" },
    MXN: { name: "Mexican Peso", symbol: "$", countryCode: "mx" },
    NZD: { name: "New Zealand Dollar", symbol: "$", countryCode: "nz" },
    HKD: { name: "Hong Kong Dollar", symbol: "$", countryCode: "hk" },
    NOK: { name: "Norwegian Krone", symbol: "kr", countryCode: "no" },
    SEK: { name: "Swedish Krona", symbol: "kr", countryCode: "se" },
    ZAR: { name: "South African Rand", symbol: "R", countryCode: "za" },
    TRY: { name: "Turkish Lira", symbol: "₺", countryCode: "tr" },
    AED: { name: "UAE Dirham", symbol: "د.إ", countryCode: "ae" },
    AFN: { name: "Afghan Afghani", symbol: "؋", countryCode: "af" },
    ALL: { name: "Albanian Lek", symbol: "L", countryCode: "al" },
    AMD: { name: "Armenian Dram", symbol: "֏", countryCode: "am" },
    ANG: { name: "Netherlands Antillean Guilder", symbol: "ƒ", countryCode: "cw" },
    AOA: { name: "Angolan Kwanza", symbol: "Kz", countryCode: "ao" },
    ARS: { name: "Argentine Peso", symbol: "$", countryCode: "ar" },
    AZN: { name: "Azerbaijani Manat", symbol: "₼", countryCode: "az" },
    BAM: { name: "Bosnia-Herzegovina Convertible Mark", symbol: "KM", countryCode: "ba" },
    BBD: { name: "Barbadian Dollar", symbol: "$", countryCode: "bb" },
    BDT: { name: "Bangladeshi Taka", symbol: "৳", countryCode: "bd" },
    BGN: { name: "Bulgarian Lev", symbol: "лв", countryCode: "bg" },
    BHD: { name: "Bahraini Dinar", symbol: ".د.ب", countryCode: "bh" },
    BIF: { name: "Burundian Franc", symbol: "FBu", countryCode: "bi" },
    BMD: { name: "Bermudan Dollar", symbol: "$", countryCode: "bm" },
    BND: { name: "Brunei Dollar", symbol: "$", countryCode: "bn" },
    BOB: { name: "Bolivian Boliviano", symbol: "Bs.", countryCode: "bo" },
    BSD: { name: "Bahamian Dollar", symbol: "$", countryCode: "bs" },
    BTN: { name: "Bhutanese Ngultrum", symbol: "Nu.", countryCode: "bt" },
    BWP: { name: "Botswanan Pula", symbol: "P", countryCode: "bw" },
    BYN: { name: "Belarusian Ruble", symbol: "Br", countryCode: "by" },
    BZD: { name: "Belize Dollar", symbol: "BZ$", countryCode: "bz" },
    CDF: { name: "Congolese Franc", symbol: "FC", countryCode: "cd" },
    CLP: { name: "Chilean Peso", symbol: "$", countryCode: "cl" },
    COP: { name: "Colombian Peso", symbol: "$", countryCode: "co" },
    CRC: { name: "Costa Rican Colón", symbol: "₡", countryCode: "cr" },
    CUP: { name: "Cuban Peso", symbol: "$", countryCode: "cu" },
    CVE: { name: "Cape Verdean Escudo", symbol: "$", countryCode: "cv" },
    CZK: { name: "Czech Koruna", symbol: "Kč", countryCode: "cz" },
    DJF: { name: "Djiboutian Franc", symbol: "Fdj", countryCode: "dj" },
    DKK: { name: "Danish Krone", symbol: "kr", countryCode: "dk" },
    DOP: { name: "Dominican Peso", symbol: "RD$", countryCode: "do" },
    DZD: { name: "Algerian Dinar", symbol: "د.ج", countryCode: "dz" },
    EGP: { name: "Egyptian Pound", symbol: "£", countryCode: "eg" },
    ERN: { name: "Eritrean Nakfa", symbol: "Nfk", countryCode: "er" },
    ETB: { name: "Ethiopian Birr", symbol: "Br", countryCode: "et" },
    FJD: { name: "Fijian Dollar", symbol: "$", countryCode: "fj" },
    FKP: { name: "Falkland Islands Pound", symbol: "£", countryCode: "fk" },
    FOK: { name: "Faroese Króna", symbol: "kr", countryCode: "fo" },
    GEL: { name: "Georgian Lari", symbol: "₾", countryCode: "ge" },
    GGP: { name: "Guernsey Pound", symbol: "£", countryCode: "gg" },
    GHS: { name: "Ghanaian Cedi", symbol: "₵", countryCode: "gh" },
    GIP: { name: "Gibraltar Pound", symbol: "£", countryCode: "gi" },
    GMD: { name: "Gambian Dalasi", symbol: "D", countryCode: "gm" },
    GNF: { name: "Guinean Franc", symbol: "FG", countryCode: "gn" },
    GTQ: { name: "Guatemalan Quetzal", symbol: "Q", countryCode: "gt" },
    GYD: { name: "Guyanaese Dollar", symbol: "$", countryCode: "gy" },
    HNL: { name: "Honduran Lempira", symbol: "L", countryCode: "hn" },
    HRK: { name: "Croatian Kuna", symbol: "kn", countryCode: "hr" },
    HTG: { name: "Haitian Gourde", symbol: "G", countryCode: "ht" },
    HUF: { name: "Hungarian Forint", symbol: "Ft", countryCode: "hu" },
    IDR: { name: "Indonesian Rupiah", symbol: "Rp", countryCode: "id" },
    ILS: { name: "Israeli New Shekel", symbol: "₪", countryCode: "il" },
    IMP: { name: "Isle of Man Pound", symbol: "£", countryCode: "im" },
    IQD: { name: "Iraqi Dinar", symbol: "ع.د", countryCode: "iq" },
    IRR: { name: "Iranian Rial", symbol: "﷼", countryCode: "ir" },
    ISK: { name: "Icelandic Króna", symbol: "kr", countryCode: "is" },
    JEP: { name: "Jersey Pound", symbol: "£", countryCode: "je" },
    JMD: { name: "Jamaican Dollar", symbol: "J$", countryCode: "jm" },
    JOD: { name: "Jordanian Dinar", symbol: "JD", countryCode: "jo" },
    KES: { name: "Kenyan Shilling", symbol: "KSh", countryCode: "ke" },
    KGS: { name: "Kyrgystani Som", symbol: "с", countryCode: "kg" },
    KHR: { name: "Cambodian Riel", symbol: "៛", countryCode: "kh" },
    KID: { name: "Kiribati Dollar", symbol: "$", countryCode: "ki" },
    KMF: { name: "Comorian Franc", symbol: "CF", countryCode: "km" },
    KWD: { name: "Kuwaiti Dinar", symbol: "د.ك", countryCode: "kw" },
    KYD: { name: "Cayman Islands Dollar", symbol: "$", countryCode: "ky" },
    KZT: { name: "Kazakhstani Tenge", symbol: "₸", countryCode: "kz" },
    LAK: { name: "Laotian Kip", symbol: "₭", countryCode: "la" },
    LBP: { name: "Lebanese Pound", symbol: "ل.ل", countryCode: "lb" },
    LKR: { name: "Sri Lankan Rupee", symbol: "Rs", countryCode: "lk" },
    LRD: { name: "Liberian Dollar", symbol: "$", countryCode: "lr" },
    LSL: { name: "Lesotho Loti", symbol: "L", countryCode: "ls" },
    LYD: { name: "Libyan Dinar", symbol: "ل.د", countryCode: "ly" },
    MAD: { name: "Moroccan Dirham", symbol: "د.م.", countryCode: "ma" },
    MDL: { name: "Moldovan Leu", symbol: "L", countryCode: "md" },
    MGA: { name: "Malagasy Ariary", symbol: "Ar", countryCode: "mg" },
    MKD: { name: "Macedonian Denar", symbol: "ден", countryCode: "mk" },
    MMK: { name: "Myanma Kyat", symbol: "K", countryCode: "mm" },
    MNT: { name: "Mongolian Tugrik", symbol: "₮", countryCode: "mn" },
    MOP: { name: "Macanese Pataca", symbol: "MOP$", countryCode: "mo" },
    MRU: { name: "Mauritanian Ouguiya", symbol: "UM", countryCode: "mr" },
    MUR: { name: "Mauritian Rupee", symbol: "₨", countryCode: "mu" },
    MVR: { name: "Maldivian Rufiyaa", symbol: ".ރ", countryCode: "mv" },
    MWK: { name: "Malawian Kwacha", symbol: "MK", countryCode: "mw" },
    MYR: { name: "Malaysian Ringgit", symbol: "RM", countryCode: "my" },
    MZN: { name: "Mozambican Metical", symbol: "MT", countryCode: "mz" },
    NAD: { name: "Namibian Dollar", symbol: "$", countryCode: "na" },
    NGN: { name: "Nigerian Naira", symbol: "₦", countryCode: "ng" },
    NIO: { name: "Nicaraguan Córdoba", symbol: "C$", countryCode: "ni" },
    NPR: { name: "Nepalese Rupee", symbol: "₨", countryCode: "np" },
    OMR: { name: "Omani Rial", symbol: "ر.ع.", countryCode: "om" },
    PAB: { name: "Panamanian Balboa", symbol: "B/.", countryCode: "pa" },
    PEN: { name: "Peruvian Nuevo Sol", symbol: "S/.", countryCode: "pe" },
    PGK: { name: "Papua New Guinean Kina", symbol: "K", countryCode: "pg" },
    PHP: { name: "Philippine Peso", symbol: "₱", countryCode: "ph" },
    PKR: { name: "Pakistani Rupee", symbol: "₨", countryCode: "pk" },
    PLN: { name: "Polish Zloty", symbol: "zł", countryCode: "pl" },
    PYG: { name: "Paraguayan Guarani", symbol: "₲", countryCode: "py" },
    QAR: { name: "Qatari Rial", symbol: "ر.ق", countryCode: "qa" },
    RON: { name: "Romanian Leu", symbol: "lei", countryCode: "ro" },
    RSD: { name: "Serbian Dinar", symbol: "дин.", countryCode: "rs" },
    RWF: { name: "Rwandan Franc", symbol: "FRw", countryCode: "rw" },
    SAR: { name: "Saudi Riyal", symbol: "ر.س", countryCode: "sa" },
    SBD: { name: "Solomon Islands Dollar", symbol: "$", countryCode: "sb" },
    SCR: { name: "Seychellois Rupee", symbol: "₨", countryCode: "sc" },
    SDG: { name: "Sudanese Pound", symbol: "ج.س.", countryCode: "sd" },
    SHP: { name: "Saint Helena Pound", symbol: "£", countryCode: "sh" },
    SLE: { name: "Sierra Leonean Leone", symbol: "Le", countryCode: "sl" },
    SOS: { name: "Somali Shilling", symbol: "S", countryCode: "so" },
    SRD: { name: "Surinamese Dollar", symbol: "$", countryCode: "sr" },
    SSP: { name: "South Sudanese Pound", symbol: "£", countryCode: "ss" },
    STN: { name: "São Tomé and Príncipe Dobra", symbol: "Db", countryCode: "st" },
    SYP: { name: "Syrian Pound", symbol: "£", countryCode: "sy" },
    SZL: { name: "Swazi Lilangeni", symbol: "L", countryCode: "sz" },
    THB: { name: "Thai Baht", symbol: "฿", countryCode: "th" },
    TJS: { name: "Tajikistani Somoni", symbol: "SM", countryCode: "tj" },
    TMT: { name: "Turkmenistani Manat", symbol: "m", countryCode: "tm" },
    TND: { name: "Tunisian Dinar", symbol: "د.ت", countryCode: "tn" },
    TOP: { name: "Tongan Paʻanga", symbol: "T$", countryCode: "to" },
    TTD: { name: "Trinidad and Tobago Dollar", symbol: "TT$", countryCode: "tt" },
    TWD: { name: "New Taiwan Dollar", symbol: "NT$", countryCode: "tw" },
    TZS: { name: "Tanzanian Shilling", symbol: "TSh", countryCode: "tz" },
    UAH: { name: "Ukrainian Hryvnia", symbol: "₴", countryCode: "ua" },
    UGX: { name: "Ugandan Shilling", symbol: "USh", countryCode: "ug" },
    UYU: { name: "Uruguayan Peso", symbol: "$U", countryCode: "uy" },
    UZS: { name: "Uzbekistan Som", symbol: "so'm", countryCode: "uz" },
    VES: { name: "Venezuelan Bolívar", symbol: "Bs.", countryCode: "ve" },
    VND: { name: "Vietnamese Dong", symbol: "₫", countryCode: "vn" },
    VUV: { name: "Vanuatu Vatu", symbol: "VT", countryCode: "vu" },
    WST: { name: "Samoan Tala", symbol: "T", countryCode: "ws" },
    XAF: { name: "CFA Franc BEAC", symbol: "FCFA", countryCode: "cm" },
    XCD: { name: "East Caribbean Dollar", symbol: "$", countryCode: "ag" },
    XDR: { name: "Special Drawing Rights", symbol: "SDR", countryCode: "un" },
    XOF: { name: "CFA Franc BCEAO", symbol: "CFA", countryCode: "sn" },
    XPF: { name: "CFP Franc", symbol: "₣", countryCode: "pf" },
    YER: { name: "Yemeni Rial", symbol: "﷼", countryCode: "ye" },
    ZMW: { name: "Zambian Kwacha", symbol: "ZK", countryCode: "zm" },
    ZWL: { name: "Zimbabwean Dollar", symbol: "$", countryCode: "zw" },
};

// Base exchange rates against the US Dollar. In a real app, this would come from an API.
const USD_RATES = {
    USD: 1.0, EUR: 0.92, JPY: 155.52, GBP: 0.79, AUD: 1.51, CAD: 1.37, CHF: 0.91, CNY: 7.24, INR: 83.48, BRL: 5.14,
    RUB: 91.55, KRW: 1361.33, SGD: 1.35, MXN: 16.67, NZD: 1.64, HKD: 7.82, NOK: 10.54, SEK: 10.68, ZAR: 18.45,
    TRY: 32.27, AED: 3.67, AFN: 72.25, ALL: 92.5, AMD: 387.17, ANG: 1.79, AOA: 830.0, ARS: 878.5, AZN: 1.7,
    BAM: 1.8, BBD: 2.0, BDT: 117.0, BGN: 1.8, BHD: 0.38, BIF: 2850.0, BMD: 1.0, BND: 1.35, BOB: 6.91,
    BSD: 1.0, BTN: 83.48, BWP: 13.6, BYN: 3.28, BZD: 2.0, CDF: 2785.0, CLP: 965.0, COP: 3900.0, CRC: 512.0,
    CUP: 24.0, CVE: 101.5, CZK: 23.0, DJF: 177.72, DKK: 6.86, DOP: 58.5, DZD: 134.5, EGP: 47.3, ERN: 15.0,
    ETB: 56.8, FJD: 2.25, FKP: 0.79, FOK: 6.86, GEL: 2.68, GGP: 0.79, GHS: 13.5, GIP: 0.79, GMD: 65.0,
    GNF: 8600.0, GTQ: 7.78, GYD: 209.0, HNL: 24.7, HRK: 7.0, HTG: 132.5, HUF: 360.0, IDR: 16050.0, ILS: 3.7,
    IMP: 0.79, IQD: 1310.0, IRR: 42000.0, ISK: 138.0, JEP: 0.79, JMD: 155.0, JOD: 0.71, KES: 131.0, KGS: 88.5,
    KHR: 4100.0, KID: 1.51, KMF: 452.0, KWD: 0.31, KYD: 0.83, KZT: 445.0, LAK: 21500.0, LBP: 89500.0, LKR: 300.0,
    LRD: 193.0, LSL: 18.45, LYD: 4.85, MAD: 10.0, MDL: 17.7, MGA: 4450.0, MKD: 56.5, MMK: 2100.0, MNT: 3400.0,
    MOP: 8.05, MRU: 39.5, MUR: 46.5, MVR: 15.4, MWK: 1750.0, MYR: 4.7, MZN: 63.5, NAD: 18.45, NGN: 1450.0,
    NIO: 36.8, NPR: 133.5, OMR: 0.38, PAB: 1.0, PEN: 3.75, PGK: 3.8, PHP: 58.0, PKR: 278.0, PLN: 3.95,
    PYG: 7450.0, QAR: 3.64, RON: 4.58, RSD: 108.0, RWF: 1300.0, SAR: 3.75, SBD: 8.3, SCR: 13.5, SDG: 600.0,
    SHP: 0.79, SLE: 22.5, SOS: 570.0, SRD: 32.5, SSP: 1300.0, STN: 24.5, SYP: 13000.0, SZL: 18.45, THB: 36.5,
    TJS: 10.9, TMT: 3.5, TND: 3.1, TOP: 2.3, TTD: 6.8, TWD: 32.3, TZS: 2580.0, UAH: 39.5, UGX: 3750.0,
    UYU: 39.0, UZS: 12600.0, VES: 36.3, VND: 25400.0, VUV: 120.0, WST: 2.7, XAF: 603.0, XCD: 2.7, XDR: 0.75,
    XOF: 603.0, XPF: 110.0, YER: 250.0, ZMW: 25.5, ZWL: 13.5,
};

/**
 * Builds a complete rate matrix from the base USD rates.
 * This allows for direct conversion between any two supported currencies.
 * @returns {object} A nested object with exchange rates, e.g., RATES['USD']['EUR'].
 */
function buildRates() {
  const rates = {};
  for (const from in USD_RATES) {
    rates[from] = {};
    for (const to in USD_RATES) {
      // The rate is calculated by converting 'from' to USD, then USD to 'to'.
      rates[from][to] = +(USD_RATES[to] / USD_RATES[from]).toFixed(4);
    }
  }
  return rates;
}

// The complete, pre-calculated exchange rate matrix.
const RATES = buildRates();


// --- CUSTOM DROPDOWN COMPONENT ---

const CustomDropdown = ({ value, onChange, isOpen, setIsOpen, label }) => {
  const dropdownRef = useRef(null);

  // Effect to handle clicks outside the dropdown to close it.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  const selectedCurrency = CURRENCIES[value];

  return (
    <div className="flex flex-col relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-base outline-none transition-all cursor-pointer flex items-center justify-between text-left ${isOpen ? 'ring-2 ring-blue-500 border-blue-500 bg-white' : ''}`}
        >
          <div className="flex items-center gap-3">
            <img 
              src={`https://flagcdn.com/w20/${selectedCurrency.countryCode}.png`}
              width="20"
              alt={`${selectedCurrency.name} flag`}
            />
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-base">{value}</span>
              <span className="text-sm text-slate-500">{selectedCurrency.name}</span>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 bg-white border border-slate-200 rounded-xl mt-1 max-h-60 overflow-y-auto shadow-lg">
            {Object.entries(CURRENCIES).map(([code, curr]) => (
              <button
                key={code}
                onClick={() => {
                  onChange(code);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 border-none bg-transparent cursor-pointer flex items-center justify-between transition-colors duration-150 text-left hover:bg-slate-50 ${value === code ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                   <img 
                    src={`https://flagcdn.com/w20/${curr.countryCode}.png`}
                    width="20"
                    alt={`${curr.name} flag`}
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className={`font-semibold text-sm ${value === code ? 'text-blue-600' : ''}`}>{code}</span>
                    <span className="text-xs text-slate-500">{curr.name}</span>
                  </div>
                </div>
                <span className="text-base font-semibold text-slate-700">{curr.symbol}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


// --- MAIN APP COMPONENT ---

export default function App() {
  // --- STATE MANAGEMENT ---
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [converted, setConverted] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [popular, setPopular] = useState([]);
  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);

  // --- CORE FUNCTIONS ---

  /**
   * Converts the input amount from the 'from' currency to the 'to' currency.
   */
  const convertCurrency = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setConverted("");
      setShowResult(false);
      return;
    }
    const rate = RATES[from][to];
    const result = (amt * rate).toFixed(2);
    setConverted(result);
    setShowResult(true);
  };

  /**
   * Swaps the 'from' and 'to' currencies.
   */
  const swapCurrencies = () => {
    const tempFrom = from;
    setFrom(to);
    setTo(tempFrom);
  };

  // --- EFFECTS ---

  // Re-run conversion automatically if currencies change after a result is shown.
  useEffect(() => {
    if (showResult) {
      convertCurrency();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

  // Generate mock historical data for the chart when currencies change.
  useEffect(() => {
    const rate = RATES[from][to];
    const newData = Array.from({ length: 7 }, (_, i) => ({
      day: `Day ${i + 1}`,
      // Simulate small daily fluctuations around the current rate.
      value: +(rate * (1 + (Math.random() - 0.5) * 0.05)).toFixed(4),
    }));
    setGraphData(newData);
  }, [from, to]);

  // Set up the popular currencies list on initial component mount.
  useEffect(() => {
    const top = ["EUR", "INR", "JPY", "GBP", "AUD"];
    const data = top.map((code) => ({
      code,
      value: RATES["USD"][code].toFixed(2),
      symbol: CURRENCIES[code].symbol,
    }));
    setPopular(data);
  }, []);


  // --- RENDER ---

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-4 sm:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <DollarSign className="w-8 h-8 text-emerald-600" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 text-transparent bg-clip-text">
              Currency Exchange
            </h1>
          </div>
          <p className="text-slate-500 text-base md:text-lg">
            Real-time currency conversion for global travelers
          </p>
        </header>

        {/* Main Content Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Converter & Popular Rates */}
          <div className="flex flex-col gap-6">
            {/* Converter Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-800 mb-6">
                <ArrowRightLeft className="w-6 h-6 text-blue-500" />
                Convert Currency
              </h2>
              
              <div className="flex flex-col gap-6">
                <div className="flex flex-col">
                  <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-2">Amount</label>
                  <input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div className="flex gap-4">
                  <button onClick={swapCurrencies} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 border border-slate-300 rounded-xl text-slate-600 cursor-pointer transition-colors duration-200 text-base hover:bg-slate-300">
                    <ArrowRightLeft className="w-4 h-4" />
                    Swap
                  </button>
                  <button onClick={convertCurrency} className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-blue-700 border-none rounded-xl text-white font-semibold cursor-pointer transition-all duration-200 text-base shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5">
                    Convert
                  </button>
                </div>

                {showResult && (
                  <div className="bg-gradient-to-r from-emerald-50 to-blue-100 rounded-xl p-6 border border-emerald-200 text-center">
                    <p className="text-slate-600 mb-2 text-sm">{amount} {from} equals</p>
                    <p className="text-3xl font-bold text-slate-800">
                      {converted} {CURRENCIES[to].symbol}
                    </p>
                    <p className="text-sm text-slate-600 mt-2">
                      Rate: 1 {from} = {RATES[from][to]} {to}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Popular Rates Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Popular USD Rates</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {popular.map((p) => (
                  <div key={p.code} className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-center transition-all duration-200 hover:bg-slate-100 hover:shadow-sm">
                    <p className="text-slate-500 text-sm font-medium">{p.code}</p>
                    <p className="text-slate-800 font-semibold mt-1">{p.value} {p.symbol}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Chart */}
          <div className="flex flex-col">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm h-full">
              <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-800 mb-6">
                <TrendingUp className="w-6 h-6 text-blue-500" />
                {from} → {to} Trend
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={graphData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" stroke="#64748b" />
                    <YAxis stroke="#64748b" domain={['dataMin - 0.01', 'dataMax + 0.01']} tickFormatter={(tick) => tick.toFixed(3)} />
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
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
