import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardCard } from './components/DashboardCard';
import { StudentRegistrationForm, type StudentFormData } from './components/StudentRegistrationForm';
import { Users, UserPlus, BookOpen, Clock, CheckCircle } from 'lucide-react';
import './App.css';

interface StudentRecord {
  id: string;
  name: string;
  course: string;
  date: string;
  status: 'Registered' | 'Pending';
}

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const [students, setStudents] = useState<StudentRecord[]>([
    { id: '#ADM-2026-001', name: 'Aarav Sharma', course: 'Computer Science & Engineering', date: '26 Nov 2026', status: 'Registered' },
    { id: '#ADM-2026-002', name: 'Sneha Patil', course: 'Information Technology', date: '26 Nov 2026', status: 'Registered' },
    { id: '#ADM-2026-003', name: 'Rahul Reddy', course: 'Data Science & AI', date: '25 Nov 2026', status: 'Pending' },
    { id: '#ADM-2026-004', name: 'Pooja Verma', course: 'Electronics & Communication', date: '25 Nov 2026', status: 'Registered' },
  ]);

  const handleStudentAdded = (newStudent: StudentFormData) => {
    const formatted: StudentRecord = {
      id: `#${newStudent.admissionNumber}`,
      name: newStudent.fullName,
      course: newStudent.department,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Registered',
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
              : activeTab === 'registration' 
              ? 'New Student Registration' 
              : activeTab.toUpperCase()
          } 
        />

        <main className="content-container">
          {activeTab === 'registration' ? (
            <StudentRegistrationForm onSuccess={handleStudentAdded} />
          ) : activeTab === 'dashboard' ? (
            <>
              {/* Top Metric Cards */}
              <section className="cards-grid">
                <DashboardCard
                  title="Total Students"
                  value={1248 + (students.length - 4)}
                  icon={Users}
                  change="+12% from last month"
                  isPositive={true}
                  color="#3b82f6"
                />
                <DashboardCard
                  title="New Registrations"
                  value={184 + (students.length - 4)}
                  icon={UserPlus}
                  change="+8% this week"
                  isPositive={true}
                  color="#10b981"
                />
                <DashboardCard
                  title="Active Courses"
                  value="36"
                  icon={BookOpen}
                  change="4 added this term"
                  isPositive={true}
                  color="#8b5cf6"
                />
                <DashboardCard
                  title="Pending Verification"
                  value="15"
                  icon={Clock}
                  change="-3 from yesterday"
                  isPositive={false}
                  color="#f59e0b"
                />
              </section>

              {/* Quick Overview Section */}
              <section className="dashboard-sections">
                <div className="panel recent-registrations">
                  <div className="panel-header">
                    <h2>Recent Student Registrations</h2>
                    <span className="badge">Latest {students.length}</span>
                  </div>
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Admission No</th>
                          <th>Student Name</th>
                          <th>Department / Course</th>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.id}>
                            <td><strong>{student.id}</strong></td>
                            <td>{student.name}</td>
                            <td>{student.course}</td>
                            <td>{student.date}</td>
                            <td>
                              <span
                                className={`status-tag ${
                                  student.status === 'Registered' ? 'status-success' : 'status-pending'
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

                <div className="panel quick-actions">
                  <div className="panel-header">
                    <h2>Quick Actions</h2>
                  </div>
                  <div className="quick-info-box">
                    <p><strong>System:</strong> React + TypeScript Form</p>
                    <p><strong>Validation:</strong> Controlled Components</p>
                    <p><strong>Target API:</strong> POST /api/students</p>
                    <p><strong>Database:</strong> PostgreSQL</p>
                    <hr className="divider" />
                    <button 
                      className="primary-btn" 
                      onClick={() => setActiveTab('registration')}
                    >
                      + Register New Student
                    </button>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <div className="panel">
              <h2>{activeTab.toUpperCase()} Section</h2>
              <p style={{ marginTop: '10px', color: '#64748b' }}>
                This section is under construction. Click on <strong>Dashboard</strong> or <strong>New Registration</strong> from the sidebar.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
