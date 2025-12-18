/**
 * Modal hiển thị và tìm kiếm văn khấn
 */

import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  vanKhanCollection,
  getVanKhanByCategory,
  searchVanKhan,
  getVanKhanForDate,
  type VanKhanCategory,
  type VanKhanItem,
} from '../../config/vanKhan';

interface VanKhanModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: VanKhanCategory;
  lunarMonth?: number;
  lunarDay?: number;
}

const CATEGORY_LABELS: Record<VanKhanCategory | 'all', string> = {
  all: 'Tất cả',
  tet: 'Tết Nguyên Đán',
  ram_mung_mot: 'Rằm & Mùng 1',
  gio: 'Giỗ',
  cung_ong_tao: 'Ông Công Ông Táo',
  khai_truong: 'Khai trương',
  nhap_trach: 'Nhập trạch',
  dong_tho: 'Động thổ',
  cuoi_hoi: 'Cưới hỏi',
  thanh_minh: 'Thanh Minh',
  vu_lan: 'Vu Lan',
};

const CATEGORIES: (VanKhanCategory | 'all')[] = [
  'all',
  'tet',
  'ram_mung_mot',
  'gio',
  'cung_ong_tao',
  'khai_truong',
  'nhap_trach',
  'dong_tho',
  'thanh_minh',
  'vu_lan',
];

export function VanKhanModal({
  isOpen,
  onClose,
  initialCategory,
  lunarMonth,
  lunarDay,
}: VanKhanModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<VanKhanCategory | 'all'>(
    initialCategory || 'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedVanKhan, setSelectedVanKhan] = useState<VanKhanItem | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (isOpen) {
      setSelectedCategory(initialCategory || 'all');
      setSearchQuery('');
      setSelectedVanKhan(null);
    }
  }, [isOpen, initialCategory]);

  const relevantForDate = useMemo(() => {
    if (lunarMonth && lunarDay) {
      return getVanKhanForDate(lunarMonth, lunarDay);
    }
    return [];
  }, [lunarMonth, lunarDay]);

  const filteredVanKhan = useMemo(() => {
    let results: VanKhanItem[];

    if (debouncedQuery.trim()) {
      results = searchVanKhan(debouncedQuery);
    } else if (selectedCategory === 'all') {
      results = [...vanKhanCollection];
    } else {
      results = getVanKhanByCategory(selectedCategory);
    }

    if (relevantForDate.length > 0) {
      const relevantIds = new Set(relevantForDate.map((v) => v.id));
      results.sort((a, b) => {
        const aRelevant = relevantIds.has(a.id) ? 0 : 1;
        const bRelevant = relevantIds.has(b.id) ? 0 : 1;
        return aRelevant - bRelevant;
      });
    }

    return results;
  }, [debouncedQuery, selectedCategory, relevantForDate]);

  const isRelevantForDate = useCallback(
    (item: VanKhanItem) => {
      return relevantForDate.some((v) => v.id === item.id);
    },
    [relevantForDate]
  );

  const handleCopy = async () => {
    if (!selectedVanKhan) return;

    const textToCopy = `${selectedVanKhan.title}\n\n${selectedVanKhan.content}${
      selectedVanKhan.notes ? `\n\nGhi chú: ${selectedVanKhan.notes}` : ''
    }`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (selectedVanKhan) {
        setSelectedVanKhan(null);
      } else {
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden dark:bg-gray-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 shrink-0">
          <div className="flex items-center gap-3">
            {selectedVanKhan && (
              <button
                onClick={() => setSelectedVanKhan(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors dark:hover:bg-gray-700"
                aria-label="Quay lại"
              >
                <svg
                  className="w-5 h-5 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {selectedVanKhan ? selectedVanKhan.title : '📿 Bộ sưu tập Văn Khấn'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors dark:hover:bg-gray-700"
            aria-label="Đóng"
          >
            <svg className="w-5 h-5 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        {selectedVanKhan ? (
          <div className="flex-1 overflow-y-auto">
            {/* Detail View */}
            <div className="p-4 space-y-4">
              {/* Occasion */}
              <div className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-3">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <span className="font-medium">Dịp sử dụng:</span> {selectedVanKhan.occasion}
                </p>
              </div>

              {/* Content */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Nội dung văn khấn:
                </h3>
                <div className="text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed text-sm">
                  {selectedVanKhan.content}
                </div>
              </div>

              {/* Notes */}
              {selectedVanKhan.notes && (
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <span className="font-medium">📝 Ghi chú:</span> {selectedVanKhan.notes}
                  </p>
                </div>
              )}

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  copySuccess
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {copySuccess ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Đã sao chép!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                    Sao chép văn khấn
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Search & Filter */}
            <div className="p-4 border-b dark:border-gray-700 space-y-3 shrink-0">
              {/* Search Input */}
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm văn khấn..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setSearchQuery('');
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {CATEGORY_LABELS[category]}
                  </button>
                ))}
              </div>

              {/* Context hint */}
              {relevantForDate.length > 0 && (
                <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-2 flex items-center gap-2">
                  <span className="text-green-600 dark:text-green-400">✨</span>
                  <span className="text-sm text-green-800 dark:text-green-200">
                    Có {relevantForDate.length} văn khấn phù hợp với ngày {lunarDay}/{lunarMonth} âm lịch
                  </span>
                </div>
              )}
            </div>

            {/* List View */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredVanKhan.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>Không tìm thấy văn khấn phù hợp</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredVanKhan.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedVanKhan(item)}
                      className={`w-full text-left p-4 rounded-lg border transition-colors hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:hover:border-blue-700 ${
                        isRelevantForDate(item)
                          ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700'
                          : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {isRelevantForDate(item) && (
                              <span className="text-green-500" title="Phù hợp với ngày này">
                                ✨
                              </span>
                            )}
                            <h3 className="font-medium text-gray-800 dark:text-gray-100 truncate">
                              {item.title}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {item.occasion}
                          </p>
                          <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                            {CATEGORY_LABELS[item.category]}
                          </span>
                        </div>
                        <svg
                          className="w-5 h-5 text-gray-400 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 dark:bg-gray-900 dark:border-gray-700 shrink-0">
          <button
            onClick={selectedVanKhan ? () => setSelectedVanKhan(null) : onClose}
            className="w-full py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
          >
            {selectedVanKhan ? 'Quay lại danh sách' : 'Đóng'}
          </button>
        </div>
      </div>
    </div>
  );
}
