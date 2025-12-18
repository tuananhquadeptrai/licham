export type MoonPhase = 
  | 'new' 
  | 'waxing_crescent' 
  | 'first_quarter' 
  | 'waxing_gibbous' 
  | 'full' 
  | 'waning_gibbous' 
  | 'last_quarter' 
  | 'waning_crescent';

export interface MoonPhaseInfo {
  phase: MoonPhase;
  age: number;
  illumination: number;
  labelVi: string;
  labelEn: string;
  icon: string;
}

export const MOON_PHASE_INFO: Record<MoonPhase, { labelVi: string; labelEn: string; icon: string }> = {
  new: { labelVi: 'Trăng non', labelEn: 'New Moon', icon: '🌑' },
  waxing_crescent: { labelVi: 'Trăng lưỡi liềm đầu tháng', labelEn: 'Waxing Crescent', icon: '🌒' },
  first_quarter: { labelVi: 'Thượng huyền', labelEn: 'First Quarter', icon: '🌓' },
  waxing_gibbous: { labelVi: 'Trăng khuyết đầu tháng', labelEn: 'Waxing Gibbous', icon: '🌔' },
  full: { labelVi: 'Trăng tròn', labelEn: 'Full Moon', icon: '🌕' },
  waning_gibbous: { labelVi: 'Trăng khuyết cuối tháng', labelEn: 'Waning Gibbous', icon: '🌖' },
  last_quarter: { labelVi: 'Hạ huyền', labelEn: 'Last Quarter', icon: '🌗' },
  waning_crescent: { labelVi: 'Trăng lưỡi liềm cuối tháng', labelEn: 'Waning Crescent', icon: '🌘' },
};
