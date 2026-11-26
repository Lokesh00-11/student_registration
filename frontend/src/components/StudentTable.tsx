import React from 'react';
import { type StudentRecord } from '../types/student';
import { Eye, Edit3, Trash2 } from 'lucide-react';

interface StudentTableProps {
  students: StudentRecord[];
  emptyMessage?: React.ReactNode;
  onView: (student: StudentRecord) => void;
  onEdit: (student: StudentRecord) => void;
  onDelete: (student: StudentRecord) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  emptyMessage = 'No student records available.',
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th>Admission No / Roll No</th>
            <th>Student Name</th>
            <th>Gender</th>
            <th>Department</th>
            <th>GPA</th>
            <th>Contact Details</th>
            <th>Reg Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student.id}>
                <td>
                  <strong style={{ color: 'var(--primary-color)' }}>
                    #{student.admissionNo}
                  </strong>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>
                    Roll: {student.rollNo}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{student.name}</div>
                </td>
                <td>{student.gender}</td>
                <td>{student.course}</td>
                <td>
                  {/* Single Uniform Blue Color for all GPAs */}
                  <span className="gpa-pill">
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
                <td>
                  <div className="action-buttons-cell">
                    <button
                      className="btn-icon-view"
                      title={`View details of ${student.name}`}
                      onClick={() => onView(student)}
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      className="btn-icon-edit"
                      title={`Edit ${student.name}`}
                      onClick={() => onEdit(student)}
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      className="btn-icon-danger"
                      title={`Delete ${student.name}`}
                      onClick={() => onDelete(student)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
