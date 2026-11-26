export interface StudentDto {
  id?: number;
  admissionNo: string;
  rollNo: string;
  department: string;
  semester?: string;
  gpa?: number;
  firstName: string;
  lastName: string;
  dob?: string;
  gender?: string;
  bloodGroup?: string;
  nationality?: string;
  fatherName?: string;
  motherName?: string;
  fatherOccupation?: string;
  parentPhone?: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  createdAt?: string;
}

const API_BASE_URL = 'http://localhost:8088/api/students';

export const studentApi = {
  // GET all students from PostgreSQL database
  async getAll(): Promise<StudentDto[]> {
    const res = await fetch(API_BASE_URL);
    if (!res.ok) {
      throw new Error(`Failed to fetch students from DB: ${res.statusText}`);
    }
    return res.json();
  },

  // GET student by ID
  async getById(id: number): Promise<StudentDto> {
    const res = await fetch(`${API_BASE_URL}/${id}`);
    if (!res.ok) {
      throw new Error(`Student #${id} not found in DB`);
    }
    return res.json();
  },

  // POST create new student in DB
  async create(student: StudentDto): Promise<StudentDto> {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    });

    if (!res.ok) {
      const errorMsg = await res.text();
      throw new Error(errorMsg || 'Failed to save student in PostgreSQL database');
    }
    return res.json();
  },

  // PUT update student by ID
  async update(id: number, student: Partial<StudentDto>): Promise<StudentDto> {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    });

    if (!res.ok) {
      const errorMsg = await res.text();
      throw new Error(errorMsg || `Failed to update student #${id}`);
    }
    return res.json();
  },

  // DELETE student by ID
  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error(`Failed to delete student #${id}`);
    }
  },
};
