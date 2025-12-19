import { useState, useMemo } from 'react';
import { useCalendarStore } from '../../store/useCalendarStore';
import { getTranslations } from '../../i18n';
import { getLunarService } from '../../services/LunarServiceImpl';
import type { SolarDate, LunarDate } from '../../lib/amlich/types';

interface Props {
  className?: string;
}

interface ConversionResult {
  solar: SolarDate;
  lunar: LunarDate;
  canChi: {
    day: string;
    month: string;
    year: string;
  };
}

const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

export function DateConversionForm({ className = '' }: Props) {
  const { locale } = useCalendarStore();
  const t = getTranslations(locale);
  const service = getLunarService();

  const [mode, setMode] = useState<'solarToLunar' | 'lunarToSolar'>('solarToLunar');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [isLeapMonth, setIsLeapMonth] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ConversionResult | null>(null);

  const labels = useMemo(() => ({
    title: locale === 'vi' ? 'Chuyển đổi ngày' : 'Date Conversion',
    solarToLunar: locale === 'vi' ? 'Dương → Âm' : 'Solar → Lunar',
    lunarToSolar: locale === 'vi' ? 'Âm → Dương' : 'Lunar → Solar',
    day: locale === 'vi' ? 'Ngày' : 'Day',
    month: locale === 'vi' ? 'Tháng' : 'Month',
    year: locale === 'vi' ? 'Năm' : 'Year',
    leapMonth: locale === 'vi' ? 'Tháng nhuận' : 'Leap Month',
    convert: locale === 'vi' ? 'Chuyển đổi' : 'Convert',
    result: locale === 'vi' ? 'Kết quả' : 'Result',
    solarDate: locale === 'vi' ? 'Ngày dương' : 'Solar Date',
    lunarDate: locale === 'vi' ? 'Ngày âm' : 'Lunar Date',
    canChi: locale === 'vi' ? 'Can Chi' : 'Sexagenary Cycle',
    invalidDate: locale === 'vi' ? 'Ngày không hợp lệ' : 'Invalid date',
    yearRange: locale === 'vi' 
      ? `Năm phải từ ${MIN_YEAR} đến ${MAX_YEAR}` 
      : `Year must be between ${MIN_YEAR} and ${MAX_YEAR}`,
    invalidLunar: locale === 'vi' ? 'Ngày âm lịch không tồn tại' : 'Lunar date does not exist',
    leapMonthNote: locale === 'vi' ? '(Nhuận)' : '(Leap)',
  }), [locale]);

  const validateInput = (): boolean => {
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    if (isNaN(d) || isNaN(m) || isNaN(y)) {
      setError(labels.invalidDate);
      return false;
    }

    if (y < MIN_YEAR || y > MAX_YEAR) {
      setError(labels.yearRange);
      return false;
    }

    if (m < 1 || m > 12) {
      setError(labels.invalidDate);
      return false;
    }

    if (d < 1 || d > 31) {
      setError(labels.invalidDate);
      return false;
    }

    if (mode === 'solarToLunar') {
      const daysInMonth = new Date(y, m, 0).getDate();
      if (d > daysInMonth) {
        setError(labels.invalidDate);
        return false;
      }
    }

    return true;
  };

  const handleConvert = () => {
    setError('');
    setResult(null);

    if (!validateInput()) {
      return;
    }

    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    try {
      if (mode === 'solarToLunar') {
        const solar: SolarDate = { year: y, month: m, day: d };
        const lunar = service.getLunarDate(solar);
        const canChi = service.getCanChi(solar);

        setResult({
          solar,
          lunar: {
            year: lunar.year,
            month: lunar.month,
            day: lunar.day,
            isLeapMonth: lunar.isLeapMonth,
            jd: lunar.jd,
          },
          canChi: {
            day: `${canChi.ngay.can} ${canChi.ngay.chi}`,
            month: `${canChi.thang.can} ${canChi.thang.chi}`,
            year: `${canChi.nam.can} ${canChi.nam.chi}`,
          },
        });
      } else {
        const lunar: LunarDate = {
          year: y,
          month: m,
          day: d,
          isLeapMonth,
          jd: 0,
        };
        const solar = service.lunarToSolar(lunar);

        if (solar.year === 0 && solar.month === 0 && solar.day === 0) {
          setError(labels.invalidLunar);
          return;
        }

        const canChi = service.getCanChi(solar);

        setResult({
          solar,
          lunar,
          canChi: {
            day: `${canChi.ngay.can} ${canChi.ngay.chi}`,
            month: `${canChi.thang.can} ${canChi.thang.chi}`,
            year: `${canChi.nam.can} ${canChi.nam.chi}`,
          },
        });
      }
    } catch {
      setError(labels.invalidDate);
    }
  };

  const handleModeChange = (newMode: 'solarToLunar' | 'lunarToSolar') => {
    setMode(newMode);
    setResult(null);
    setError('');
    setIsLeapMonth(false);
  };

  const formatLunarMonth = (m: number, isLeap: boolean) => {
    const monthName = t.lunarMonths[m - 1] || `Tháng ${m}`;
    return isLeap ? `${monthName} ${labels.leapMonthNote}` : monthName;
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-4 md:p-6 dark:bg-gray-800 dark:border-gray-700 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:text-gray-100">{labels.title}</h3>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => handleModeChange('solarToLunar')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            mode === 'solarToLunar'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {labels.solarToLunar}
        </button>
        <button
          onClick={() => handleModeChange('lunarToSolar')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            mode === 'lunarToSolar'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {labels.lunarToSolar}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1 dark:text-gray-400">{labels.day}</label>
          <input
            type="number"
            min={1}
            max={31}
            value={day}
            onChange={(e) => setDay(e.target.value)}
            placeholder="1-31"
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1 dark:text-gray-400">{labels.month}</label>
          <input
            type="number"
            min={1}
            max={12}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder="1-12"
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1 dark:text-gray-400">{labels.year}</label>
          <input
            type="number"
            min={MIN_YEAR}
            max={MAX_YEAR}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder={`${MIN_YEAR}-${MAX_YEAR}`}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
          />
        </div>
      </div>

      {mode === 'lunarToSolar' && (
        <label className="flex items-center gap-2 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={isLeapMonth}
            onChange={(e) => setIsLeapMonth(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">{labels.leapMonth}</span>
        </label>
      )}

      <button
        onClick={handleConvert}
        className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-400"
      >
        {labels.convert}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/30 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{labels.result}</h4>
          
          <div className="bg-blue-50 rounded-lg p-3 dark:bg-blue-900/30">
            <p className="text-xs text-gray-500 mb-1 dark:text-gray-400">{labels.solarDate}</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {result.solar.day}/{result.solar.month}/{result.solar.year}
            </p>
          </div>

          <div className="bg-amber-50 rounded-lg p-3 dark:bg-amber-900/30">
            <p className="text-xs text-gray-500 mb-1 dark:text-gray-400">{labels.lunarDate}</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {result.lunar.day} {formatLunarMonth(result.lunar.month, result.lunar.isLeapMonth)}, {result.lunar.year}
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-3 dark:bg-green-900/30">
            <p className="text-xs text-gray-500 mb-2 dark:text-gray-400">{labels.canChi}</p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">{t.dayDetail.dayCanChi}:</span>
                <p className="font-medium dark:text-gray-200">{result.canChi.day}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">{t.dayDetail.monthCanChi}:</span>
                <p className="font-medium dark:text-gray-200">{result.canChi.month}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">{t.dayDetail.yearCanChi}:</span>
                <p className="font-medium dark:text-gray-200">{result.canChi.year}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
