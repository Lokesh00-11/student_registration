export interface StudentRecord {
  id: string; // unique key (e.g. DB-12)
  numericId?: number; // Database ID in PostgreSQL
  admissionNo: string;
  rollNo: string;
  name: string;
  course: string;
  date: string;
  gpa: number;
  gender: string;
  email: string;
  phone: string;
}

export interface StudentFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  nationality: string;

  // Academic Information
  admissionNumber: string;
  rollNumber: string;
  department: string;
  semester: string;
  gpa: string;

  // Parent / Guardian Information
  fatherName: string;
  motherName: string;
  fatherOccupation: string;
  parentPhone: string;

  // Contact Information
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export const initialStudentFormData: StudentFormData = {
  firstName: '',
  lastName: '',
  dob: '',
  gender: 'Male',
  bloodGroup: 'O+',
  nationality: 'Indian',
  admissionNumber: '',
  rollNumber: '',
  department: 'Computer Science & Engineering',
  semester: '1st Semester',
  gpa: '9.20',
  fatherName: '',
  motherName: '',
  fatherOccupation: '',
  parentPhone: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: 'Telangana',
  pincode: '',
};
