/**
 * ShareCardModal - Modal to preview and share/download the share card
 */

import { useRef, useState, useCallback } from 'react';
import { ShareCard } from './ShareCard';
import { downloadElementAsImage, shareElement, canShare, generateFilename } from '../../services/shareService';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
}

export function ShareCardModal({ isOpen, onClose, date }: ShareCardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    
    setIsLoading(true);
    try {
      await downloadElementAsImage(cardRef.current, {
        filename: generateFilename(date),
      });
    } finally {
      setIsLoading(false);
    }
  }, [date]);
  
  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;
    
    setIsLoading(true);
    try {
      await shareElement(cardRef.current, {
        filename: generateFilename(date),
      });
    } finally {
      setIsLoading(false);
    }
  }, [date]);
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  const showShareButton = canShare();
  
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-[650px] w-full max-h-[95vh] overflow-hidden flex flex-col dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            📤 Chia sẻ ngày
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors dark:hover:bg-gray-700"
            aria-label="Close"
          >
            <svg className="w-5 h-5 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Card Preview */}
        <div className="flex-1 overflow-auto p-4 bg-gray-100 dark:bg-gray-900">
          <div className="flex justify-center">
            <div 
              ref={cardRef}
              className="shadow-lg rounded-lg overflow-hidden"
              style={{ transform: 'scale(0.65)', transformOrigin: 'top center' }}
            >
              <ShareCard date={date} />
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="p-4 border-t bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Tải xuống</span>
                </>
              )}
            </button>
            
            {showShareButton && (
              <button
                onClick={handleShare}
                disabled={isLoading}
                className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span>Chia sẻ</span>
                  </>
                )}
              </button>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="w-full mt-3 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
