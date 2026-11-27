import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { StudentRegistrationForm } from './components/StudentRegistrationForm';
import { StudentDetailsModal } from './components/StudentDetailsModal';
import { StudentTable } from './components/StudentTable';
import { studentApi, type StudentDto } from './services/studentApi';
import { type StudentRecord } from './types/student';
import './App.css';

export type { StudentRecord };

export function App() {
  // Exactly 2 pages: 'students' (Student Details) and 'registration' (Student Registration)
  const [activeTab, setActiveTab] = useState<'students' | 'registration'>('students');

  // Database Students (fetched from Spring Boot -> PostgreSQL)
  const [dbStudents, setDbStudents] = useState<StudentRecord[]>([]);

  // Currently Editing Student for CRUD Update
  const [editingStudent, setEditingStudent] = useState<StudentDto | null>(null);

  // View Details Modal State
  const [viewingStudent, setViewingStudent] = useState<StudentDto | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isLoadingView, setIsLoadingView] = useState(false);

  // Sync / Load Students from Spring Boot Backend (Real Data Only)
  const loadDbStudents = useCallback(async () => {
    try {
      const data = await studentApi.getAll();

      const formatted: StudentRecord[] = data.map((s) => ({
        id: `DB-${s.id}`,
        numericId: s.id,
        name: `${s.firstName} ${s.lastName}`.trim(),
        dob: s.dob || '—',
        gender: s.gender || 'Other',
        course: s.department,
        year: s.year || '1st Year',
        fatherName: s.fatherName || '—',
        parentPhone: s.parentPhone || '',
        email: s.email || '',
        phone: s.phone || '',
      })).sort((a, b) => (a.numericId || 0) - (b.numericId || 0));

      setDbStudents(formatted);
    } catch (err) {
      console.error('Failed to load students from database:', err);
    }
  }, []);

  useEffect(() => {
    loadDbStudents();
  }, [loadDbStudents]);

  // Combined students (all students from PostgreSQL database)
  const students: StudentRecord[] = dbStudents;

  const handleStudentAdded = () => {
    setEditingStudent(null);
    loadDbStudents();
    setActiveTab('students');
  };

  // View Student Full Details Action
  const handleViewStudent = async (student: StudentRecord) => {
    setIsViewModalOpen(true);
    if (student.numericId) {
      setIsLoadingView(true);
      try {
        const fullDto = await studentApi.getById(student.numericId);
        setViewingStudent(fullDto);
      } catch (err) {
        console.warn('Could not fetch full student details, falling back to basic data:', err);
        const parts = (student.name || '').trim().split(' ');
        setViewingStudent({
          id: student.numericId,
          firstName: parts[0] || '',
          lastName: parts.slice(1).join(' ') || '',
          dob: student.dob,
          gender: student.gender,
          department: student.course,
          year: student.year,
          fatherName: student.fatherName,
          parentPhone: student.parentPhone,
          email: student.email,
          phone: student.phone,
        });
      } finally {
        setIsLoadingView(false);
      }
    } else {
      const parts = (student.name || '').trim().split(' ');
      setViewingStudent({
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        dob: student.dob,
        gender: student.gender,
        department: student.course,
        year: student.year,
        fatherName: student.fatherName,
        parentPhone: student.parentPhone,
        email: student.email,
        phone: student.phone,
      });
      setIsLoadingView(false);
    }
  };

  // CRUD: Edit Student
  const handleEditStudent = async (student: StudentRecord) => {
    if (student.numericId) {
      try {
        const fullDto = await studentApi.getById(student.numericId);
        setEditingStudent(fullDto);
        setActiveTab('registration');
        return;
      } catch (err) {
        console.warn('Could not fetch full student details for edit, using basic data:', err);
      }
    }

    const parts = (student.name || '').trim().split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';

    const dto: StudentDto = {
      id: student.numericId,
      firstName: firstName,
      lastName: lastName,
      dob: student.dob,
      gender: student.gender,
      department: student.course,
      year: student.year,
      fatherName: student.fatherName,
      parentPhone: student.parentPhone,
      email: student.email,
      phone: student.phone,
    };

    setEditingStudent(dto);
    setActiveTab('registration');
  };

  // CRUD: Delete Student
  const handleDeleteStudent = async (student: StudentRecord) => {
    if (!window.confirm(`Are you sure you want to delete ${student.name} from PostgreSQL database?`)) {
      return;
    }

    if (student.numericId) {
      try {
        await studentApi.delete(student.numericId);
        setDbStudents((prev) => prev.filter((s) => s.numericId !== student.numericId));
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to delete student from database';
        alert(errorMsg);
      }
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar Navigation (2 Pages: Student Details & Registration) */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          if (tab === 'registration') {
            setEditingStudent(null);
          }
          setActiveTab(tab as 'students' | 'registration');
        }} 
      />

      {/* Main Content Area */}
      <div className="main-wrapper headerless-main">
        <main className="content-container">
          {/* Top Page Title Bar */}
          <div className="page-top-bar">
            <div>
              <h1 className="page-main-heading">
                {activeTab === 'registration'
                  ? (editingStudent ? 'Edit Student Details' : 'Student Registration')
                  : 'Student Details'}
              </h1>
              <p className="page-sub-heading">
                {activeTab === 'registration'
                  ? 'Enter personal, academic, parent and contact information'
                  : 'View, edit, and manage all enrolled students'}
              </p>
            </div>
          </div>

          {activeTab === 'registration' ? (
            /* PAGE 2: STUDENT REGISTRATION / EDIT FORM */
            <StudentRegistrationForm 
              onSuccess={handleStudentAdded} 
              existingCount={students.length}
              editingStudent={editingStudent}
              onCancelEdit={() => {
                setEditingStudent(null);
                setActiveTab('students');
              }}
            />
          ) : (
            /* PAGE 1: STUDENT DETAILS DIRECTORY */
            <div className="panel fullwidth-directory-panel">
              {/* Student Details Table */}
              <StudentTable
                students={students}
                emptyMessage="No students registered yet in the database."
                onView={handleViewStudent}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
              />
            </div>
          )}
        </main>
      </div>

      {/* Student Details View Modal */}
      <StudentDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        student={viewingStudent}
        isLoading={isLoadingView}
        onEdit={(dto) => {
          setEditingStudent(dto);
          setActiveTab('registration');
        }}
      />
    </div>
  );
}

export default App;
