import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardCard } from './components/DashboardCard';
import { StudentRegistrationForm } from './components/StudentRegistrationForm';
import { StudentDetailsModal } from './components/StudentDetailsModal';
import { StudentTable } from './components/StudentTable';
import { DEPARTMENTS } from './constants/departments';
import { studentApi, type StudentDto } from './services/studentApi';
import { type StudentRecord } from './types/student';
import { 
  Users, 
  Award, 
  BookOpen, 
  TrendingUp, 
  Search, 
  Filter, 
  RotateCw, 
  UserPlus
} from 'lucide-react';
import './App.css';

export type { StudentRecord };


export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Search & Filter State for All Students page
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');

  // Database Students (fetched from Spring Boot -> PostgreSQL)
  const [dbStudents, setDbStudents] = useState<StudentRecord[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Currently Editing Student for CRUD Update
  const [editingStudent, setEditingStudent] = useState<StudentDto | null>(null);

  // View Details Modal State
  const [viewingStudent, setViewingStudent] = useState<StudentDto | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isLoadingView, setIsLoadingView] = useState(false);

  // Sync / Load Students from Spring Boot Backend (Real Data Only)
  const loadDbStudents = useCallback(async () => {
    setIsSyncing(true);
    try {
      const data = await studentApi.getAll();

      const formatted: StudentRecord[] = data.map((s) => ({
        id: `DB-${s.id}`,
        numericId: s.id,
        admissionNo: s.admissionNo,
        rollNo: s.rollNo,
        name: `${s.firstName} ${s.lastName}`.trim(),
        course: s.department,
        date: s.createdAt
          ? new Date(s.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : '26 Nov 2026',
        gpa: typeof s.gpa === 'number' ? s.gpa : (parseFloat(String(s.gpa)) || 8.0),
        gender: s.gender || 'Other',
        email: s.email || '',
        phone: s.phone || '',
      }));

      setDbStudents(formatted);
    } catch (err) {
      console.error('Failed to load students from database:', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    loadDbStudents();
  }, [loadDbStudents]);

  // Combined students (all students from PostgreSQL database)
  const students: StudentRecord[] = dbStudents;

  // Real-Time Calculations across all students
  const totalStudents = students.length;
  const highestGPA = students.length > 0 ? Math.max(...students.map((s) => s.gpa)) : 0;
  const topStudent = students.find((s) => s.gpa === highestGPA);
  const averageGPA =
    students.length > 0
      ? (students.reduce((acc, s) => acc + s.gpa, 0) / totalStudents).toFixed(2)
      : '0.00';
  const uniqueDepartmentsCount = DEPARTMENTS.length;

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
          admissionNo: student.admissionNo,
          rollNo: student.rollNo,
          firstName: parts[0] || '',
          lastName: parts.slice(1).join(' ') || '',
          department: student.course,
          semester: '1st Semester',
          gpa: student.gpa,
          gender: student.gender,
          email: student.email,
          phone: student.phone,
        });
      } finally {
        setIsLoadingView(false);
      }
    } else {
      const parts = (student.name || '').trim().split(' ');
      setViewingStudent({
        admissionNo: student.admissionNo,
        rollNo: student.rollNo,
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        department: student.course,
        semester: '1st Semester',
        gpa: student.gpa,
        gender: student.gender,
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
      admissionNo: student.admissionNo,
      rollNo: student.rollNo,
      firstName: firstName,
      lastName: lastName,
      department: student.course,
      gpa: student.gpa,
      gender: student.gender,
      email: student.email,
      phone: student.phone,
      semester: '1st Semester',
      dob: '2005-01-15',
      bloodGroup: 'O+',
      nationality: 'Indian',
      city: 'Hyderabad',
      state: 'Telangana',
    };

    setEditingStudent(dto);
    setActiveTab('registration');
  };

  // CRUD: Delete Student
  const handleDeleteStudent = async (student: StudentRecord) => {
    if (!window.confirm(`Are you sure you want to delete ${student.name} (${student.admissionNo}) from PostgreSQL database?`)) {
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

  // Filtered Students for the All Students page
  const filteredStudents = students.filter((student) => {
    const query = searchQuery.trim().toLowerCase();
    const cleanQuery = query.startsWith('#') ? query.slice(1).trim() : query;

    const name = String(student.name || '').toLowerCase();
    const admNo = String(student.admissionNo || '').toLowerCase();
    const rollNo = String(student.rollNo || '').toLowerCase();
    const course = String(student.course || '').toLowerCase();
    const email = String(student.email || '').toLowerCase();
    const phone = String(student.phone || '');

    const matchesSearch =
      query === '' ||
      name.includes(query) ||
      admNo.includes(query) ||
      admNo.includes(cleanQuery) ||
      rollNo.includes(query) ||
      rollNo.includes(cleanQuery) ||
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
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          if (tab === 'registration') {
            setEditingStudent(null);
          }
          setActiveTab(tab);
        }} 
      />

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
                  ? 'Performance metrics and student directory'
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
              editingStudent={editingStudent}
              onCancelEdit={() => {
                setEditingStudent(null);
                setActiveTab('students');
              }}
            />
          ) : activeTab === 'students' ? (
            /* ALL STUDENTS PAGE */
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
                    title="Sync & refresh student list from database"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCourseFilter('ALL');
                      loadDbStudents();
                    }}
                  >
                    <RotateCw size={17} />
                    <span>{isSyncing ? 'Syncing...' : 'Refresh'}</span>
                  </button>

                  <button
                    className="primary-btn toolbar-btn"
                    onClick={() => {
                      setEditingStudent(null);
                      setActiveTab('registration');
                    }}
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
                  <strong>{students.length}</strong> total registered students
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
              <StudentTable
                students={filteredStudents}
                emptyMessage={
                  searchQuery ? (
                    <>
                      No students found matching "<strong>{searchQuery}</strong>". Try a different keyword or reset filters.
                    </>
                  ) : (
                    'No students registered yet in the database.'
                  )
                }
                onView={handleViewStudent}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
              />
            </div>
          ) : (
            /* DASHBOARD PAGE */
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

              {/* Recent Student Registrations Table Section */}
              <section className="dashboard-sections">
                <div className="panel recent-registrations">
                  <div className="panel-header">
                    <h2>Recent Student Registrations</h2>
                    <span className="badge">{totalStudents} Total Enrolled</span>
                  </div>

                  <StudentTable
                    students={students.slice(0, 5)}
                    emptyMessage="No recent student registrations found."
                    onView={handleViewStudent}
                    onEdit={handleEditStudent}
                    onDelete={handleDeleteStudent}
                  />
                </div>
              </section>
            </>
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
