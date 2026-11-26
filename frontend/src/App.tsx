import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardCard } from './components/DashboardCard';
import { StudentRegistrationForm, type StudentFormData } from './components/StudentRegistrationForm';
import { Users, Award, BookOpen, TrendingUp } from 'lucide-react';
import './App.css';

export interface StudentRecord {
  id: string;
  name: string;
  course: string;
  date: string;
  gpa: number;
  gender: string;
  email: string;
  phone: string;
}

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // 10 Students dataset with accurate GPAs
  const [students, setStudents] = useState<StudentRecord[]>([
    {
      id: 'ADM-2026-001',
      name: 'Aarav Sharma',
      course: 'Computer Science & Engineering',
      date: '26 Nov 2026',
      gpa: 9.85,
      gender: 'Male',
      email: 'aarav.sharma@example.com',
      phone: '9876543210',
    },
    {
      id: 'ADM-2026-002',
      name: 'Sneha Patil',
      course: 'Information Technology',
      date: '26 Nov 2026',
      gpa: 9.40,
      gender: 'Female',
      email: 'sneha.patil@example.com',
      phone: '9823456789',
    },
    {
      id: 'ADM-2026-003',
      name: 'Rahul Reddy',
      course: 'Data Science & AI',
      date: '25 Nov 2026',
      gpa: 8.90,
      gender: 'Male',
      email: 'rahul.reddy@example.com',
      phone: '9812345678',
    },
    {
      id: 'ADM-2026-004',
      name: 'Pooja Verma',
      course: 'Electronics & Communication',
      date: '25 Nov 2026',
      gpa: 9.15,
      gender: 'Female',
      email: 'pooja.verma@example.com',
      phone: '9789012345',
    },
    {
      id: 'ADM-2026-005',
      name: 'Karthik Raman',
      course: 'Mechanical Engineering',
      date: '24 Nov 2026',
      gpa: 8.45,
      gender: 'Male',
      email: 'karthik.raman@example.com',
      phone: '9765432109',
    },
    {
      id: 'ADM-2026-006',
      name: 'Ananya Iyer',
      course: 'Computer Science & Engineering',
      date: '24 Nov 2026',
      gpa: 9.60,
      gender: 'Female',
      email: 'ananya.iyer@example.com',
      phone: '9712345678',
    },
    {
      id: 'ADM-2026-007',
      name: 'Rohan Gupta',
      course: 'Information Technology',
      date: '23 Nov 2026',
      gpa: 8.75,
      gender: 'Male',
      email: 'rohan.gupta@example.com',
      phone: '9654321098',
    },
    {
      id: 'ADM-2026-008',
      name: 'Divya Nair',
      course: 'Data Science & AI',
      date: '22 Nov 2026',
      gpa: 9.30,
      gender: 'Female',
      email: 'divya.nair@example.com',
      phone: '9612345678',
    },
    {
      id: 'ADM-2026-009',
      name: 'Vikram Joshi',
      course: 'Electronics & Communication',
      date: '21 Nov 2026',
      gpa: 8.10,
      gender: 'Male',
      email: 'vikram.joshi@example.com',
      phone: '9543210987',
    },
    {
      id: 'ADM-2026-010',
      name: 'Meera Deshmukh',
      course: 'Computer Science & Engineering',
      date: '20 Nov 2026',
      gpa: 9.50,
      gender: 'Female',
      email: 'meera.d@example.com',
      phone: '9512345678',
    },
  ]);

  // Accurate Dynamic Calculations
  const totalStudents = students.length;
  const highestGPA = students.length > 0 ? Math.max(...students.map((s) => s.gpa)) : 0;
  const topStudent = students.find((s) => s.gpa === highestGPA);
  const averageGPA = students.length > 0 
    ? (students.reduce((acc, s) => acc + s.gpa, 0) / totalStudents).toFixed(2) 
    : '0.00';
  const uniqueDepartmentsCount = new Set(students.map((s) => s.course)).size;

  const handleStudentAdded = (newStudent: StudentFormData) => {
    const formatted: StudentRecord = {
      id: newStudent.admissionNumber.startsWith('#')
        ? newStudent.admissionNumber.replace('#', '')
        : newStudent.admissionNumber,
      name: newStudent.fullName,
      course: newStudent.department,
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      gpa: parseFloat(newStudent.gpa) || 8.0,
      gender: newStudent.gender,
      email: newStudent.email,
      phone: newStudent.phone,
    };

    setStudents((prev) => [formatted, ...prev]);
  };

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header
          title={
            activeTab === 'dashboard'
              ? 'Student Academic Dashboard'
              : activeTab === 'students'
              ? 'All Registered Students'
              : activeTab === 'registration'
              ? 'Student Registration'
              : activeTab.toUpperCase()
          }
        />

        <main className="content-container">
          {activeTab === 'registration' ? (
            <StudentRegistrationForm onSuccess={handleStudentAdded} />
          ) : (
            <>
              {/* Dynamic Accurate Metric Cards */}
              <section className="cards-grid">
                <DashboardCard
                  title="Total Students"
                  value={totalStudents}
                  icon={Users}
                  change="Enrolled students"
                  isPositive={true}
                  color="#3b82f6"
                />

                <DashboardCard
                  title="Highest GPA in Institute"
                  value={`${highestGPA} / 10`}
                  icon={Award}
                  change={topStudent ? `Rank #1: ${topStudent.name}` : 'Top Performer'}
                  isPositive={true}
                  color="#10b981"
                />

                <DashboardCard
                  title="Average Institute GPA"
                  value={`${averageGPA} / 10`}
                  icon={TrendingUp}
                  change="Batch Performance"
                  isPositive={true}
                  color="#f59e0b"
                />

                <DashboardCard
                  title="Academic Departments"
                  value={uniqueDepartmentsCount}
                  icon={BookOpen}
                  change={`${uniqueDepartmentsCount} active branches`}
                  isPositive={true}
                  color="#8b5cf6"
                />
              </section>

              {/* Students Table Section */}
              <section className="dashboard-sections">
                <div
                  className="panel recent-registrations"
                  style={{ gridColumn: activeTab === 'students' ? '1 / -1' : undefined }}
                >
                  <div className="panel-header">
                    <h2>
                      {activeTab === 'students' ? 'Student Directory' : 'Student Registrations'}
                    </h2>
                    <span className="badge">{totalStudents} Students</span>
                  </div>

                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Admission No</th>
                          <th>Student Name</th>
                          <th>Gender</th>
                          <th>Department</th>
                          <th>GPA</th>
                          <th>Contact Email</th>
                          <th>Reg Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.id}>
                            <td>
                              <strong style={{ color: 'var(--primary-color)' }}>
                                #{student.id}
                              </strong>
                            </td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{student.name}</div>
                            </td>
                            <td>{student.gender}</td>
                            <td>{student.course}</td>
                            <td>
                              <span
                                className={`gpa-pill ${
                                  student.gpa >= 9.5
                                    ? 'gpa-top'
                                    : student.gpa >= 9.0
                                    ? 'gpa-high'
                                    : 'gpa-standard'
                                }`}
                              >
                                {student.gpa.toFixed(2)}
                              </span>
                            </td>
                            <td>
                              <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                                {student.email}
                              </div>
                            </td>
                            <td>{student.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {activeTab !== 'students' && (
                  <div className="panel quick-actions">
                    <div className="panel-header">
                      <h2>Academic Summary</h2>
                    </div>
                    <div className="quick-info-box">
                      <p>
                        <strong>Total Enrolled:</strong> {totalStudents} Students
                      </p>
                      <p>
                        <strong>Highest GPA:</strong> {highestGPA} (
                        {topStudent?.name})
                      </p>
                      <p>
                        <strong>Average GPA:</strong> {averageGPA}
                      </p>
                      <p>
                        <strong>Departments:</strong> {uniqueDepartmentsCount}
                      </p>
                      <hr className="divider" />
                      <button
                        className="primary-btn"
                        onClick={() => setActiveTab('registration')}
                      >
                        + Register New Student
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
