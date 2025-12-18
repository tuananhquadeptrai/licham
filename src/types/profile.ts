export interface FamilyProfile {
  id: string;
  name: string;
  birthYear: number;
  birthMonth?: number;
  birthDay?: number;
  gender: 'male' | 'female';
  relationship?: string;
  createdAt: string;
}

export const RELATIONSHIP_OPTIONS = [
  { value: 'cha', label: 'Cha' },
  { value: 'me', label: 'Mẹ' },
  { value: 'ong', label: 'Ông' },
  { value: 'ba', label: 'Bà' },
  { value: 'con_trai', label: 'Con trai' },
  { value: 'con_gai', label: 'Con gái' },
  { value: 'anh', label: 'Anh' },
  { value: 'chi', label: 'Chị' },
  { value: 'em', label: 'Em' },
  { value: 'vo', label: 'Vợ' },
  { value: 'chong', label: 'Chồng' },
  { value: 'khac', label: 'Khác' },
] as const;
