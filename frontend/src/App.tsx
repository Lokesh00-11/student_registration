import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardCard } from './components/DashboardCard';
import { StudentRegistrationForm, type StudentFormData } from './components/StudentRegistrationForm';
import { Users, UserPlus, BookOpen, Clock, CheckCircle } from 'lucide-react';
import './App.css';

export interface StudentRecord {
  id: string;
  name: string;
  course: string;
  date: string;
  status: 'Registered' | 'Pending';
  gender: string;
  email: string;
  phone: string;
}

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // 10 Initial Student Records
  const [students, setStudents] = useState<StudentRecord[]>([
    {
      id: 'ADM-2026-001',
      name: 'Aarav Sharma',
      course: 'Computer Science & Engineering',
      date: '26 Nov 2026',
      status: 'Registered',
      gender: 'Male',
      email: 'aarav.sharma@example.com',
      phone: '9876543210',
    },
    {
      id: 'ADM-2026-002',
      name: 'Sneha Patil',
      course: 'Information Technology',
      date: '26 Nov 2026',
      status: 'Registered',
      gender: 'Female',
      email: 'sneha.patil@example.com',
      phone: '9823456789',
    },
    {
      id: 'ADM-2026-003',
      name: 'Rahul Reddy',
      course: 'Data Science & AI',
      date: '25 Nov 2026',
      status: 'Pending',
      gender: 'Male',
      email: 'rahul.reddy@example.com',
      phone: '9812345678',
    },
    {
      id: 'ADM-2026-004',
      name: 'Pooja Verma',
      course: 'Electronics & Communication',
      date: '25 Nov 2026',
      status: 'Registered',
      gender: 'Female',
      email: 'pooja.verma@example.com',
      phone: '9789012345',
    },
    {
      id: 'ADM-2026-005',
      name: 'Karthik Raman',
      course: 'Mechanical Engineering',
      date: '24 Nov 2026',
      status: 'Registered',
      gender: 'Male',
      email: 'karthik.raman@example.com',
      phone: '9765432109',
    },
    {
      id: 'ADM-2026-006',
      name: 'Ananya Iyer',
      course: 'Computer Science & Engineering',
      date: '24 Nov 2026',
      status: 'Pending',
      gender: 'Female',
      email: 'ananya.iyer@example.com',
      phone: '9712345678',
    },
    {
      id: 'ADM-2026-007',
      name: 'Rohan Gupta',
      course: 'Information Technology',
      date: '23 Nov 2026',
      status: 'Registered',
      gender: 'Male',
      email: 'rohan.gupta@example.com',
      phone: '9654321098',
    },
    {
      id: 'ADM-2026-008',
      name: 'Divya Nair',
      course: 'Data Science & AI',
      date: '22 Nov 2026',
      status: 'Registered',
      gender: 'Female',
      email: 'divya.nair@example.com',
      phone: '9612345678',
    },
    {
      id: 'ADM-2026-009',
      name: 'Vikram Joshi',
      course: 'Electronics & Communication',
      date: '21 Nov 2026',
      status: 'Pending',
      gender: 'Male',
      email: 'vikram.joshi@example.com',
      phone: '9543210987',
    },
    {
      id: 'ADM-2026-010',
      name: 'Meera Deshmukh',
      course: 'Computer Science & Engineering',
      date: '20 Nov 2026',
      status: 'Registered',
      gender: 'Female',
      email: 'meera.d@example.com',
      phone: '9512345678',
    },
  ]);

  // Exact dynamic calculations from the data
  const totalStudents = students.length;
  const registeredCount = students.filter((s) => s.status === 'Registered').length;
  const pendingCount = students.filter((s) => s.status === 'Pending').length;
  const uniqueCoursesCount = new Set(students.map((s) => s.course)).size;

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
      status: 'Registered',
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
              ? 'Student Registration Dashboard'
              : activeTab === 'students'
              ? 'All Registered Students'
              : activeTab === 'registration'
              ? 'New Student Registration'
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
                  change="Total records in database"
                  isPositive={true}
                  color="#3b82f6"
                />
                <DashboardCard
                  title="Verified Registrations"
                  value={registeredCount}
                  icon={UserPlus}
                  change={`${Math.round((registeredCount / totalStudents) * 100)}% verified`}
                  isPositive={true}
                  color="#10b981"
                />
                <DashboardCard
                  title="Active Departments"
                  value={uniqueCoursesCount}
                  icon={BookOpen}
                  change={`${uniqueCoursesCount} academic branches`}
                  isPositive={true}
                  color="#8b5cf6"
                />
                <DashboardCard
                  title="Pending Verification"
                  value={pendingCount}
                  icon={Clock}
                  change={`${Math.round((pendingCount / totalStudents) * 100)}% pending`}
                  isPositive={false}
                  color="#f59e0b"
                />
              </section>

              {/* Students Table Section */}
              <section className="dashboard-sections">
                <div className="panel recent-registrations" style={{ gridColumn: activeTab === 'students' ? '1 / -1' : undefined }}>
                  <div className="panel-header">
                    <h2>
                      {activeTab === 'students' ? 'Complete Student Directory' : 'Recent Student Registrations'}
                    </h2>
                    <span className="badge">{students.length} Total Students</span>
                  </div>
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Admission No</th>
                          <th>Student Name</th>
                          <th>Gender</th>
                          <th>Department / Course</th>
                          <th>Contact (Email / Phone)</th>
                          <th>Reg Date</th>
                          <th>Status</th>
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
                              <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                                {student.email}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                +91 {student.phone}
                              </div>
                            </td>
                            <td>{student.date}</td>
                            <td>
                              <span
                                className={`status-tag ${
                                  student.status === 'Registered'
                                    ? 'status-success'
                                    : 'status-pending'
                                }`}
                              >
                                {student.status === 'Registered' ? (
                                  <CheckCircle size={14} />
                                ) : (
                                  <Clock size={14} />
                                )}
                                {student.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {activeTab !== 'students' && (
                  <div className="panel quick-actions">
                    <div className="panel-header">
                      <h2>System Metrics</h2>
                    </div>
                    <div className="quick-info-box">
                      <p>
                        <strong>Total Records:</strong> {totalStudents}
                      </p>
                      <p>
                        <strong>Active Status:</strong> {registeredCount} Registered
                      </p>
                      <p>
                        <strong>Action Needed:</strong> {pendingCount} Pending
                      </p>
                      <p>
                        <strong>Verification Rate:</strong>{' '}
                        {Math.round((registeredCount / totalStudents) * 100)}%
                      </p>
                      <p>
                        <strong>Courses Offered:</strong> {uniqueCoursesCount}
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
