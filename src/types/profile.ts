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

export interface OwnerParticipant {
  id: string;
  name: string;
  gender: 'male' | 'female';
  birth: {
    year: number;
    month: number;
    day: number;
  };
}

export function hasFullBirthday(profile: FamilyProfile): boolean {
  return (
    typeof profile.birthYear === 'number' &&
    typeof profile.birthMonth === 'number' &&
    typeof profile.birthDay === 'number' &&
    profile.birthYear >= 1900 &&
    profile.birthYear <= 2100 &&
    profile.birthMonth >= 1 &&
    profile.birthMonth <= 12 &&
    profile.birthDay >= 1 &&
    profile.birthDay <= 31
  );
}

export function profileToOwner(profile: FamilyProfile): OwnerParticipant | null {
  if (!hasFullBirthday(profile)) return null;
  return {
    id: profile.id,
    name: profile.name,
    gender: profile.gender,
    birth: {
      year: profile.birthYear,
      month: profile.birthMonth!,
      day: profile.birthDay!,
    },
  };
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
