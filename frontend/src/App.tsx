import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardCard } from './components/DashboardCard';
import { Users, UserPlus, BookOpen, Clock, CheckCircle } from 'lucide-react';
import './App.css';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header title={activeTab === 'dashboard' ? 'Student Registration Dashboard' : activeTab.toUpperCase()} />

        <main className="content-container">
          {/* Top Metric Cards */}
          <section className="cards-grid">
            <DashboardCard
              title="Total Students"
              value="1,248"
              icon={Users}
              change="+12% from last month"
              isPositive={true}
              color="#3b82f6"
            />
            <DashboardCard
              title="New Registrations"
              value="184"
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
                <span className="badge">Latest 5</span>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Reg ID</th>
                      <th>Student Name</th>
                      <th>Course</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#STU-2026-001</td>
                      <td>Aarav Sharma</td>
                      <td>Computer Science</td>
                      <td>26 Nov 2026</td>
                      <td><span className="status-tag status-success"><CheckCircle size={14} /> Registered</span></td>
                    </tr>
                    <tr>
                      <td>#STU-2026-002</td>
                      <td>Sneha Patil</td>
                      <td>Information Tech</td>
                      <td>26 Nov 2026</td>
                      <td><span className="status-tag status-success"><CheckCircle size={14} /> Registered</span></td>
                    </tr>
                    <tr>
                      <td>#STU-2026-003</td>
                      <td>Rahul Reddy</td>
                      <td>Data Science</td>
                      <td>25 Nov 2026</td>
                      <td><span className="status-tag status-pending"><Clock size={14} /> Pending</span></td>
                    </tr>
                    <tr>
                      <td>#STU-2026-004</td>
                      <td>Pooja Verma</td>
                      <td>Electronics</td>
                      <td>25 Nov 2026</td>
                      <td><span className="status-tag status-success"><CheckCircle size={14} /> Registered</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="panel quick-actions">
              <div className="panel-header">
                <h2>Quick Overview</h2>
              </div>
              <div className="quick-info-box">
                <p><strong>Frontend:</strong> React 19 + Vite + TypeScript</p>
                <p><strong>Status:</strong> Boilerplate Running</p>
                <p><strong>Target Backend:</strong> Spring Boot REST API</p>
                <p><strong>Database:</strong> PostgreSQL</p>
                <hr className="divider" />
                <button className="primary-btn" onClick={() => alert('New student form ready!')}>
                  + Register New Student
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
