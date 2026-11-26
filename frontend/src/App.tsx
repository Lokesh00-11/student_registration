import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardCard } from './components/DashboardCard';
import { StudentRegistrationForm, type StudentFormData } from './components/StudentRegistrationForm';
import { DEPARTMENTS } from './constants/departments';
import { 
  Users, 
  Award, 
  BookOpen, 
  TrendingUp, 
  Sparkles, 
  Search, 
  Filter, 
  RotateCw, 
  UserPlus 
} from 'lucide-react';
import './App.css';

export interface StudentRecord {
  id: string; // Roll Number
  admissionNo: string;
  name: string;
  course: string;
  date: string;
  gpa: number;
  gender: string;
  email: string;
  phone: string;
}

const defaultInitialStudents: StudentRecord[] = [
  {
    id: 'ROLL-2026-001',
    admissionNo: 'ADM-2026-001',
    name: 'Aarav Sharma',
    course: 'Computer Science & Engineering',
    date: '26 Nov 2026',
    gpa: 9.85,
    gender: 'Male',
    email: 'aarav.sharma@example.com',
    phone: '9876543210',
  },
  {
    id: 'ROLL-2026-002',
    admissionNo: 'ADM-2026-002',
    name: 'Sneha Patil',
    course: 'Information Technology',
    date: '26 Nov 2026',
    gpa: 9.40,
    gender: 'Female',
    email: 'sneha.patil@example.com',
    phone: '9823456789',
  },
  {
    id: 'ROLL-2026-003',
    admissionNo: 'ADM-2026-003',
    name: 'Rahul Reddy',
    course: 'Data Science',
    date: '25 Nov 2026',
    gpa: 8.90,
    gender: 'Male',
    email: 'rahul.reddy@example.com',
    phone: '9812345678',
  },
  {
    id: 'ROLL-2026-004',
    admissionNo: 'ADM-2026-004',
    name: 'Pooja Verma',
    course: 'Electronics & Communication',
    date: '25 Nov 2026',
    gpa: 9.15,
    gender: 'Female',
    email: 'pooja.verma@example.com',
    phone: '9789012345',
  },
  {
    id: 'ROLL-2026-005',
    admissionNo: 'ADM-2026-005',
    name: 'Karthik Raman',
    course: 'Mechanical Engineering',
    date: '24 Nov 2026',
    gpa: 8.45,
    gender: 'Male',
    email: 'karthik.raman@example.com',
    phone: '9765432109',
  },
  {
    id: 'ROLL-2026-006',
    admissionNo: 'ADM-2026-006',
    name: 'Ananya Iyer',
    course: 'Computer Science & Engineering',
    date: '24 Nov 2026',
    gpa: 9.60,
    gender: 'Female',
    email: 'ananya.iyer@example.com',
    phone: '9712345678',
  },
  {
    id: 'ROLL-2026-007',
    admissionNo: 'ADM-2026-007',
    name: 'Rohan Gupta',
    course: 'Information Technology',
    date: '23 Nov 2026',
    gpa: 8.75,
    gender: 'Male',
    email: 'rohan.gupta@example.com',
    phone: '9654321098',
  },
  {
    id: 'ROLL-2026-008',
    admissionNo: 'ADM-2026-008',
    name: 'Divya Nair',
    course: 'Artificial Intelligence and Machine Learning',
    date: '22 Nov 2026',
    gpa: 9.30,
    gender: 'Female',
    email: 'divya.nair@example.com',
    phone: '9612345678',
  },
  {
    id: 'ROLL-2026-009',
    admissionNo: 'ADM-2026-009',
    name: 'Vikram Joshi',
    course: 'Electronics & Communication',
    date: '21 Nov 2026',
    gpa: 8.10,
    gender: 'Male',
    email: 'vikram.joshi@example.com',
    phone: '9543210987',
  },
  {
    id: 'ROLL-2026-010',
    admissionNo: 'ADM-2026-010',
    name: 'Meera Deshmukh',
    course: 'Computer Science & Engineering',
    date: '20 Nov 2026',
    gpa: 9.50,
    gender: 'Female',
    email: 'meera.d@example.com',
    phone: '9512345678',
  },
];

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Search & Filter State for All Students page
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');

  // Real-time Persistent Students State
  const [students, setStudents] = useState<StudentRecord[]>(() => {
    try {
      const saved = localStorage.getItem('edu_realtime_students');
      if (saved) {
        const parsed: StudentRecord[] = JSON.parse(saved);
        return parsed.map((s, idx) => ({
          ...s,
          id: s.id || `ROLL-2026-${String(idx + 1).padStart(3, '0')}`,
          admissionNo: s.admissionNo || `ADM-2026-${String(idx + 1).padStart(3, '0')}`,
          name: s.name || 'Student',
          course: s.course === 'Data Science & AI' ? 'Data Science' : (s.course || 'General'),
          gpa: typeof s.gpa === 'number' ? s.gpa : (parseFloat(String(s.gpa)) || 8.0),
          email: s.email || '',
          phone: s.phone || '',
          gender: s.gender || 'Other',
          date: s.date || '26 Nov 2026',
        }));
      }
    } catch {
      // Fallback
    }
    return defaultInitialStudents;
  });

  useEffect(() => {
    try {
      localStorage.setItem('edu_realtime_students', JSON.stringify(students));
    } catch {
      // ignore
    }
  }, [students]);

  // Real-Time Calculations
  const totalStudents = students.length;
  const highestGPA = students.length > 0 ? Math.max(...students.map((s) => s.gpa)) : 0;
  const topStudent = students.find((s) => s.gpa === highestGPA);
  const averageGPA =
    students.length > 0
      ? (students.reduce((acc, s) => acc + s.gpa, 0) / totalStudents).toFixed(2)
      : '0.00';
  const uniqueDepartmentsCount = DEPARTMENTS.length;

  const handleStudentAdded = (newStudent: StudentFormData) => {
    const fullName = `${newStudent.firstName} ${newStudent.lastName}`.trim();
    const formatted: StudentRecord = {
      id: newStudent.rollNumber.startsWith('#')
        ? newStudent.rollNumber.replace('#', '')
        : newStudent.rollNumber,
      admissionNo: newStudent.admissionNumber,
      name: fullName,
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

  // Filtered Students for the All Students page
  const filteredStudents = students.filter((student) => {
    const query = searchQuery.trim().toLowerCase();
    const cleanQuery = query.startsWith('#') ? query.slice(1).trim() : query;

    // Safe fallbacks to prevent any undefined crashes
    const name = String(student.name || '').toLowerCase();
    const rollNo = String(student.id || '').toLowerCase();
    const admNo = String(student.admissionNo || '').toLowerCase();
    const course = String(student.course || '').toLowerCase();
    const email = String(student.email || '').toLowerCase();
    const phone = String(student.phone || '');

    const matchesSearch =
      query === '' ||
      name.includes(query) ||
      rollNo.includes(query) ||
      rollNo.includes(cleanQuery) ||
      admNo.includes(query) ||
      admNo.includes(cleanQuery) ||
      course.includes(query) ||
      email.includes(query) ||
      phone.includes(query);

    const matchesCourse =
      selectedCourseFilter === 'ALL' || student.course === selectedCourseFilter;

    return matchesSearch && matchesCourse;
  });

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="main-wrapper headerless-main">
        <main className="content-container">
          {/* Top Page Title Bar */}
          <div className="page-top-bar">
            <div>
              <h1 className="page-main-heading">
                {activeTab === 'dashboard'
                  ? 'Student Academic Dashboard'
                  : activeTab === 'students'
                  ? 'All Registered Students'
                  : activeTab === 'registration'
                  ? 'Student Registration'
                  : activeTab.toUpperCase()}
              </h1>
              <p className="page-sub-heading">
                {activeTab === 'dashboard'
                  ? 'Real-time performance metrics and student directory'
                  : activeTab === 'students'
                  ? 'Search, filter, and manage enrolled students'
                  : activeTab === 'registration'
                  ? 'Enter personal, academic, parent and contact information'
                  : 'Institute student directory'}
              </p>
            </div>
          </div>

          {activeTab === 'registration' ? (
            <StudentRegistrationForm 
              onSuccess={handleStudentAdded} 
              existingCount={students.length} 
            />
          ) : activeTab === 'students' ? (
            /* ALL STUDENTS PAGE (Cards Header Removed, Active Search, Filters, Refresh, Add Student) */
            <div className="panel fullwidth-directory-panel">
              {/* Active Search & Filter Toolbar */}
              <div className="directory-toolbar">
                {/* Search by Name, Roll No, Admission No */}
                <div className="toolbar-search">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search by student name, roll number, admission number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      className="clear-search-btn" 
                      onClick={() => setSearchQuery('')}
                      title="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Course Filter Dropdown */}
                <div className="toolbar-filter">
                  <Filter size={18} className="filter-icon" />
                  <select
                    value={selectedCourseFilter}
                    onChange={(e) => setSelectedCourseFilter(e.target.value)}
                  >
                    <option value="ALL">All Courses ({DEPARTMENTS.length})</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Toolbar Actions: Refresh & Add Student */}
                <div className="toolbar-actions">
                  <button
                    className="secondary-btn toolbar-btn"
                    title="Refresh student list"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCourseFilter('ALL');
                    }}
                  >
                    <RotateCw size={17} />
                    <span>Refresh</span>
                  </button>

                  <button
                    className="primary-btn toolbar-btn"
                    onClick={() => setActiveTab('registration')}
                  >
                    <UserPlus size={18} />
                    <span>+ Add Student</span>
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              <div className="directory-status-bar">
                <span>
                  Showing <strong>{filteredStudents.length}</strong> of{' '}
                  <strong>{students.length}</strong> total students
                  {selectedCourseFilter !== 'ALL' && ` in ${selectedCourseFilter}`}
                </span>
                {(searchQuery || selectedCourseFilter !== 'ALL') && (
                  <button
                    className="reset-filters-link"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCourseFilter('ALL');
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {/* All Students Table */}
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Roll No / Admission No</th>
                      <th>Student Name</th>
                      <th>Gender</th>
                      <th>Department</th>
                      <th>GPA</th>
                      <th>Contact Details</th>
                      <th>Reg Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <tr key={student.id}>
                          <td>
                            <strong style={{ color: 'var(--primary-color)' }}>
                              #{student.id}
                            </strong>
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                              {student.admissionNo}
                            </div>
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
                            <div style={{ fontSize: '0.86rem', color: '#475569' }}>
                              {student.email}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                              +91 {student.phone}
                            </div>
                          </td>
                          <td>{student.date}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                          No students found matching "<strong>{searchQuery}</strong>". Try a different keyword or reset filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* DASHBOARD PAGE (Shows 4 Metric Cards + Recent Students + Real-Time Summary) */
            <>
              {/* Dynamic Accurate Metric Cards */}
              <section className="cards-grid">
                <DashboardCard
                  title="Total Students"
                  value={totalStudents}
                  icon={Users}
                  change="Live enrolled count"
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
                  change="Live cohort metric"
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
                <div className="panel recent-registrations">
                  <div className="panel-header">
                    <h2>Recent Student Registrations</h2>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span className="live-indicator">
                        <Sparkles size={14} /> Real-Time Sync Active
                      </span>
                      <span className="badge">{totalStudents} Total</span>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Roll No / Admission No</th>
                          <th>Student Name</th>
                          <th>Gender</th>
                          <th>Department</th>
                          <th>GPA</th>
                          <th>Contact Details</th>
                          <th>Reg Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.slice(0, 5).map((student) => (
                          <tr key={student.id}>
                            <td>
                              <strong style={{ color: 'var(--primary-color)' }}>
                                #{student.id}
                              </strong>
                              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                                {student.admissionNo}
                              </div>
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
                              <div style={{ fontSize: '0.86rem', color: '#475569' }}>
                                {student.email}
                              </div>
                              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                                +91 {student.phone}
                              </div>
                            </td>
                            <td>{student.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="panel quick-actions">
                  <div className="panel-header">
                    <h2>Real-Time Summary</h2>
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
                      <strong>Active Departments:</strong> {uniqueDepartmentsCount}
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
              </section>

              {/* Members Present in Each Course Section */}
              <section className="course-distribution-section">
                <div className="panel fullwidth-course-panel">
                  <div className="panel-header">
                    <h2>Course Enrollment Breakdown</h2>
                    <span className="badge">{uniqueDepartmentsCount} Active Courses</span>
                  </div>

                  <div className="course-cards-grid">
                    {DEPARTMENTS.map((dept) => {
                      const count = students.filter((s) => s.course === dept).length;
                      const percentage =
                        totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
                      return (
                        <div key={dept} className="course-stat-card">
                          <div className="course-card-header">
                            <span className="course-name">{dept}</span>
                            <span className="course-count-badge">
                              <strong>{count}</strong> {count === 1 ? 'member' : 'members'}
                            </span>
                          </div>
                          <div className="course-progress-bar">
                            <div
                              className="course-progress-fill"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="course-card-footer">
                            <small>{percentage}% of total student strength</small>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
