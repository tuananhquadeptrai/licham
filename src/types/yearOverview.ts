export interface YearFestivalItem {
  date: Date;
  solarDate: { year: number; month: number; day: number };
  lunarDate: { year: number; month: number; day: number };
  name: string;
  type: 'public' | 'traditional' | 'religious' | 'commemorative' | 'personal' | 'gio';
  description?: string;
}

export interface YearOverview {
  year: number;
  items: YearFestivalItem[];
}
