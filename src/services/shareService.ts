/**
 * Share Service - Convert DOM to image and share/download
 */

import html2canvas from 'html2canvas';

export interface ShareOptions {
  filename?: string;
  quality?: number;
}

/**
 * Convert a DOM element to a canvas
 */
export async function elementToCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
    logging: false,
    allowTaint: true,
  } as Parameters<typeof html2canvas>[1]);
  return canvas;
}

/**
 * Convert a DOM element to a Blob (PNG image)
 */
export async function elementToBlob(element: HTMLElement): Promise<Blob> {
  const canvas = await elementToCanvas(element);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      },
      'image/png',
      1.0
    );
  });
}

/**
 * Download an element as a PNG image
 */
export async function downloadElementAsImage(
  element: HTMLElement,
  options: ShareOptions = {}
): Promise<void> {
  const { filename = 'lich-am-duong.png' } = options;
  
  const canvas = await elementToCanvas(element);
  const dataUrl = canvas.toDataURL('image/png');
  
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

/**
 * Check if Web Share API is available
 */
export function canShare(): boolean {
  return typeof navigator !== 'undefined' && 
         typeof navigator.share === 'function' &&
         typeof navigator.canShare === 'function';
}

/**
 * Share an element using Web Share API
 * Falls back to download if Web Share is not available
 */
export async function shareElement(
  element: HTMLElement,
  options: ShareOptions = {}
): Promise<boolean> {
  const { filename = 'lich-am-duong.png' } = options;
  
  try {
    const blob = await elementToBlob(element);
    const file = new File([blob], filename, { type: 'image/png' });
    
    if (canShare()) {
      const shareData = {
        files: [file],
        title: 'Lịch Âm Dương',
        text: 'Xem ngày tốt - Lịch Âm Dương',
      };
      
      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return true;
      }
    }
    
    await downloadElementAsImage(element, options);
    return false;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      return false;
    }
    await downloadElementAsImage(element, options);
    return false;
  }
}

/**
 * Generate filename with date
 */
export function generateFilename(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `lich-am-duong-${day}-${month}-${year}.png`;
}
