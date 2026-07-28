export interface Subject {
  id: number;
  subjectName: string;
}

export interface TimetableEntry {
  id: number;
  day: string;
  /** 백엔드가 문자열로 반환 */
  period: string;
  subjectDto?: { subjectName?: string } | null;
}

export interface SelectedCell {
  day: string | null;
  period: number | null;
}

export interface TimetableTemplate {
  id: number;
  templateName: string;
  grade: string;
  semester: string;
  default?: boolean;
}

export const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
] as const;

export const DAY_LABELS: Record<string, string> = {
  MONDAY: "월",
  TUESDAY: "화",
  WEDNESDAY: "수",
  THURSDAY: "목",
  FRIDAY: "금",
};

export const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

export const GRADES = [
  { value: "SOPHOMORE", label: "1학년" },
  { value: "JUNIOR", label: "2학년" },
  { value: "SENIOR", label: "3학년" },
];

export const SEMESTERS = [
  { value: "FIRST", label: "1학기" },
  { value: "SECOND", label: "2학기" },
];
