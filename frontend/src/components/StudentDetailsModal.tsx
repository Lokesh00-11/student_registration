import React from 'react';
import { type StudentDto } from '../services/studentApi';
import {
  X,
  User,
  GraduationCap,
  Users,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Edit3,
  Hash
} from 'lucide-react';

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentDto | null;
  isLoading?: boolean;
  onEdit?: (student: StudentDto) => void;
}

export const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  isOpen,
  onClose,
  student,
  isLoading = false,
  onEdit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container student-view-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-area">
            <div className="modal-avatar">
              <User size={24} color="#2563eb" />
            </div>
            <div>
              <h2 className="modal-title">
                {student ? `${student.firstName} ${student.lastName}` : 'Student Details'}
              </h2>
              <div className="modal-subtitle-tags">
                {student?.admissionNo && (
                  <span className="info-badge adm-badge">
                    <Hash size={12} /> {student.admissionNo}
                  </span>
                )}
                {student?.rollNo && (
                  <span className="info-badge roll-badge">
                    Roll: {student.rollNo}
                  </span>
                )}
                {student?.department && (
                  <span className="info-badge dept-badge">
                    {student.department}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {isLoading ? (
            <div className="modal-loading-state">
              <div className="modal-spinner" />
              <p>Loading full student details from PostgreSQL database...</p>
            </div>
          ) : student ? (
            <div className="student-details-grid">
              {/* Section 1: Academic Information */}
              <div className="detail-card">
                <div className="detail-card-header">
                  <GraduationCap size={18} className="section-icon" />
                  <h3>Academic Information</h3>
                </div>
                <div className="detail-fields-grid">
                  <div className="detail-field">
                    <span className="field-label">Department / Branch</span>
                    <span className="field-value font-semibold">{student.department || '—'}</span>
                  </div>
                  <div className="detail-field">
                    <span className="field-label">Current Semester</span>
                    <span className="field-value">{student.semester || '1st Semester'}</span>
                  </div>
                  <div className="detail-field">
                    <span className="field-label">Admission Number</span>
                    <span className="field-value font-mono">{student.admissionNo || '—'}</span>
                  </div>
                  <div className="detail-field">
                    <span className="field-label">Student Roll Number</span>
                    <span className="field-value font-mono">{student.rollNo || '—'}</span>
                  </div>
                  <div className="detail-field">
                    <span className="field-label">Current GPA (0 - 10)</span>
                    <span className="field-value">
                      <span className="gpa-pill">
                        {Number(student.gpa).toFixed(2)} / 10.0
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Personal Information */}
              <div className="detail-card">
                <div className="detail-card-header">
                  <User size={18} className="section-icon" />
                  <h3>Personal Information</h3>
                </div>
                <div className="detail-fields-grid">
                  <div className="detail-field">
                    <span className="field-label">First Name</span>
                    <span className="field-value">{student.firstName || '—'}</span>
                  </div>
                  <div className="detail-field">
                    <span className="field-label">Last Name</span>
                    <span className="field-value">{student.lastName || '—'}</span>
                  </div>
                  <div className="detail-field">
                    <span className="field-label">Date of Birth</span>
                    <span className="field-value">
                      <Calendar size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: '-1px' }} />
                      {student.dob || '—'}
                    </span>
                  </div>
                  <div className="detail-field">
                    <span className="field-label">Gender</span>
                    <span className="field-value">{student.gender || '—'}</span>
                  </div>
                  <div className="detail-field">
                    <span className="field-label">Blood Group</span>
                    <span className="field-value">{student.bloodGroup || '—'}</span>
                  </div>
                  <div className="detail-field">
                    <span className="field-label">Nationality</span>
                    <span className="field-value">{student.nationality || 'Indian'}</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Parent / Guardian Details */}
              <div className="detail-card">
                <div className="detail-card-header">
                  <Users size={18} className="section-icon" />
                  <h3>Parent / Guardian Details</h3>
                </div>
                <div className="detail-fields-grid">
                  <div className="detail-field">
                    <span className="field-label">Father's Name</span>
                    <span className="field-value">{student.fatherName || '—'}</span>
                  </div>
                  <div className="detail-field">
                    <span className="field-label">Mother's Name</span>
                    <span className="field-value">{student.motherName || '—'}</span>
                  </div>
                  <div className="detail-field">
                    <span className="field-label">Father's Occupation</span>
                    <span className="field-value">{student.fatherOccupation || '—'}</span>
                  </div>
                  <div className="detail-field">
                    <span className="field-label">Parent Contact Phone</span>
                    <span className="field-value">
                      {student.parentPhone ? (
                        <>
                          <Phone size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: '-1px' }} />
                          +91 {student.parentPhone}
                        </>
                      ) : (
                        '—'
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 4: Contact & Residential Details */}
              <div className="detail-card">
                <div className="detail-card-header">
                  <MapPin size={18} className="section-icon" />
                  <h3>Contact & Residential Details</h3>
                </div>
                <div className="detail-fields-grid">
                  <div className="detail-field">
                    <span className="field-label">Student Email</span>
                    <span className="field-value">
                      {student.email ? (
                        <>
                          <Mail size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: '-1px' }} />
                          {student.email}
                        </>
                      ) : (
                        '—'
                      )}
                    </span>
                  </div>
                  <div className="detail-field">
                    <span className="field-label">Student Mobile</span>
                    <span className="field-value">
                      {student.phone ? (
                        <>
                          <Phone size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: '-1px' }} />
                          +91 {student.phone}
                        </>
                      ) : (
                        '—'
                      )}
                    </span>
                  </div>
                  <div className="detail-field full-width">
                    <span className="field-label">Residential Address</span>
                    <span className="field-value">{student.address || '—'}</span>
                  </div>
                  <div className="detail-field">
                    <span className="field-label">City</span>
                    <span className="field-value">{student.city || '—'}</span>
                  </div>
                  <div className="detail-field">
                    <span className="field-label">State</span>
                    <span className="field-value">{student.state || '—'}</span>
                  </div>
                  <div className="detail-field">
                    <span className="field-label">PIN Code</span>
                    <span className="field-value font-mono">{student.pinCode || '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="modal-empty-state">
              <p>No student information available.</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="secondary-btn" onClick={onClose}>
            Close
          </button>
          {student && onEdit && (
            <button
              className="primary-btn"
              onClick={() => {
                onClose();
                onEdit(student);
              }}
            >
              <Edit3 size={16} />
              <span>Edit Student Information</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
