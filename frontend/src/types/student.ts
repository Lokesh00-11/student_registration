export interface StudentRecord {
  id: string; // unique key (e.g. DB-12)
  numericId?: number; // Database ID in PostgreSQL
  name: string;
  dob: string;
  gender: string;
  course: string;
  year: string;
  fatherName: string;
  parentPhone: string;
  email: string;
  phone: string;
}

export interface StudentFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;

  // Academic Information
  department: string;
  year: string;

  // Parent / Guardian Information
  fatherName: string;
  parentPhone: string;

  // Contact Information
  email: string;
  phone: string;
}

export const ACADEMIC_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'] as const;

export const initialStudentFormData: StudentFormData = {
  firstName: '',
  lastName: '',
  dob: '',
  gender: 'Male',
  department: 'Computer Science & Engineering',
  year: '1st Year',
  fatherName: '',
  parentPhone: '',
  email: '',
  phone: '',
};
