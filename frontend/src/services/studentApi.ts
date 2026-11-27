export interface StudentDto {
  id?: number;
  firstName: string;
  lastName: string;
  dob?: string;
  gender?: string;
  department: string;
  year?: string;
  fatherName?: string;
  parentPhone?: string;
  email: string;
  phone: string;
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
      const errText = await res.text();
      throw new Error(errText || 'Failed to save student to database');
    }

    return res.json();
  },

  // PUT update student in DB
  async update(id: number, student: StudentDto): Promise<StudentDto> {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `Failed to update student #${id}`);
    }

    return res.json();
  },

  // DELETE student from DB
  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `Failed to delete student #${id}`);
    }
  },
};
