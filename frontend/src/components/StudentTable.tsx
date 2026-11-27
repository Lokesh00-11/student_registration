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
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Gender</th>
            <th>Date of Birth</th>
            <th>Department</th>
            <th>Year</th>
            <th>Student Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student.id}>
                <td>
                  <strong style={{ color: 'var(--primary-color)', fontFamily: 'monospace' }}>
                    #{student.numericId || student.id}
                  </strong>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{student.name}</div>
                </td>
                <td>{student.gender}</td>
                <td>{student.dob || '—'}</td>
                <td>{student.course}</td>
                <td>
                  <span style={{ 
                    display: 'inline-block',
                    padding: '3px 9px',
                    borderRadius: '12px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    border: '1px solid #bfdbfe'
                  }}>
                    {student.year || '1st Year'}
                  </span>
                </td>
                <td>
                  <div style={{ fontSize: '0.86rem', color: '#475569', wordBreak: 'break-all' }}>
                    {student.email || '—'}
                  </div>
                </td>
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
