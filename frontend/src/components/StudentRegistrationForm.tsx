import React, { useState } from 'react';
import { studentApi, type StudentDto } from '../services/studentApi';
import {
  type StudentFormData,
  initialStudentFormData,
  ACADEMIC_YEARS,
  DEPARTMENTS,
} from '../types/student';
import {
  User,
  Users,
  Phone,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Send
} from 'lucide-react';

export type { StudentFormData };

function getInitialFormData(editingStudent?: StudentDto | null): StudentFormData {
  if (editingStudent) {
    return {
      firstName: editingStudent.firstName || '',
      lastName: editingStudent.lastName || '',
      dob: editingStudent.dob || '2005-01-15',
      gender: editingStudent.gender || 'Male',
      department: editingStudent.department || 'Computer Science & Engineering',
      year: editingStudent.year || '1st Year',
      fatherName: editingStudent.fatherName || '',
      parentPhone: editingStudent.parentPhone || '',
      email: editingStudent.email || '',
      phone: editingStudent.phone || '',
    };
  }
  return {
    ...initialStudentFormData,
  };
}

interface StudentRegistrationFormProps {
  onSuccess?: (newStudent: StudentFormData) => void;
  existingCount: number;
  editingStudent?: StudentDto | null;
  onCancelEdit?: () => void;
}

export const StudentRegistrationForm: React.FC<StudentRegistrationFormProps> = ({
  onSuccess,
  editingStudent,
  onCancelEdit,
}) => {
  const isEditing = Boolean(editingStudent && editingStudent.id);

  const [formData, setFormData] = useState<StudentFormData>(() =>
    getInitialFormData(editingStudent)
  );

  // Re-sync if editingStudent changes
  React.useEffect(() => {
    if (editingStudent) {
      setFormData(getInitialFormData(editingStudent));
      setAlertMessage(null);
      setErrors({});
    }
  }, [editingStudent]);

  const [errors, setErrors] = useState<Partial<Record<keyof StudentFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof StudentFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof StudentFormData, string>> = {};

    // 1. Personal Information Validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';

    // 2. Academic Validation
    if (!formData.department) newErrors.department = 'Please select a department';
    if (!formData.year) newErrors.year = 'Please select academic year';

    // 3. Parent Information Validation
    if (!formData.fatherName.trim()) newErrors.fatherName = "Father's name is required";
    if (!formData.parentPhone.trim()) {
      newErrors.parentPhone = 'Parent contact phone is required';
    } else if (!/^\d{10}$/.test(formData.parentPhone)) {
      newErrors.parentPhone = 'Must be a 10-digit number';
    }

    // 4. Contact Information Validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Student phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Must be a 10-digit number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setAlertMessage({
        type: 'error',
        text: 'Please fill in all required fields accurately before submitting.',
      });
      return;
    }

    setIsSubmitting(true);
    setAlertMessage(null);

    try {
      const studentPayload: StudentDto = {
        department: formData.department,
        year: formData.year,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        dob: formData.dob,
        gender: formData.gender,
        fatherName: formData.fatherName.trim(),
        parentPhone: formData.parentPhone.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      };

      if (isEditing && editingStudent?.id) {
        // UPDATE student in PostgreSQL DB
        await studentApi.update(editingStudent.id, studentPayload);

        if (onSuccess) {
          onSuccess(formData);
        }

        const studentFullName = `${formData.firstName} ${formData.lastName}`.trim();
        setAlertMessage({
          type: 'success',
          text: `Student "${studentFullName}" updated successfully in PostgreSQL database!`,
        });
      } else {
        // CREATE new student in PostgreSQL DB
        const savedStudent = await studentApi.create(studentPayload);

        if (onSuccess) {
          onSuccess(formData);
        }

        const studentFullName = `${formData.firstName} ${formData.lastName}`.trim();
        setAlertMessage({
          type: 'success',
          text: `Student "${studentFullName}" registered and saved to PostgreSQL database successfully (ID: ${savedStudent.id})!`,
        });

        // Reset form for next entry
        setFormData(getInitialFormData());
        setErrors({});
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save student to database. Ensure backend is running.';
      setAlertMessage({
        type: 'error',
        text: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(getInitialFormData());
    setErrors({});
    setAlertMessage(null);
  };

  return (
    <div className="fullscreen-form-wrapper">
      {/* Edit Mode Notice Banner */}
      {isEditing && (
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '10px',
          padding: '14px 20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#1e40af',
          fontWeight: 600,
          fontSize: '0.95rem'
        }}>
          <span>
            ✏️ Editing Student Record: <strong>{editingStudent?.firstName} {editingStudent?.lastName}</strong> (#{editingStudent?.id})
          </span>
          {onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #93c5fd',
                borderRadius: '6px',
                padding: '6px 14px',
                color: '#2563eb',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      )}

      {/* Alert Banner */}
      {alertMessage && (
        <div className={`alert-banner ${alertMessage.type}`}>
          {alertMessage.type === 'success' ? (
            <CheckCircle size={20} className="alert-icon" />
          ) : (
            <AlertCircle size={20} className="alert-icon" />
          )}
          <span>{alertMessage.text}</span>
          <button className="alert-close" onClick={() => setAlertMessage(null)}>×</button>
        </div>
      )}

      {/* Full-Screen Form */}
      <form className="fullscreen-form" onSubmit={handleSubmit} noValidate>
        {/* SECTION 1: Personal Information */}
        <div className="form-card fullwidth-card">
          <div className="section-title">
            <User size={22} className="section-icon" />
            <div>
              <h3>1. Personal Information</h3>
              <p>Student identity and personal details</p>
            </div>
          </div>

          <div className="form-grid-4col">
            <div className="form-group col-span-2">
              <label>First Name <span className="req">*</span></label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter student first name"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'input-error' : ''}
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>

            <div className="form-group col-span-2">
              <label>Last Name <span className="req">*</span></label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter student last name"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'input-error' : ''}
              />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>

            <div className="form-group col-span-2">
              <label>Date of Birth <span className="req">*</span></label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={errors.dob ? 'input-error' : ''}
              />
              {errors.dob && <span className="error-text">{errors.dob}</span>}
            </div>

            <div className="form-group col-span-2">
              <label>Gender <span className="req">*</span></label>
              <div className="radio-group">
                {['Male', 'Female', 'Other'].map((g) => (
                  <label key={g} className="radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleChange}
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Academic Information */}
        <div className="form-card fullwidth-card">
          <div className="section-title">
            <GraduationCap size={22} className="section-icon" />
            <div>
              <h3>2. Academic Information</h3>
              <p>Department and course enrollment</p>
            </div>
          </div>

          <div className="form-grid-4col">
            <div className="form-group col-span-2">
              <label>Department / Branch <span className="req">*</span></label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={errors.department ? 'input-error' : ''}
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && <span className="error-text">{errors.department}</span>}
            </div>

            <div className="form-group col-span-2">
              <label>Academic Year <span className="req">*</span></label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={errors.year ? 'input-error' : ''}
              >
                {ACADEMIC_YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
              {errors.year && <span className="error-text">{errors.year}</span>}
            </div>
          </div>
        </div>

        {/* SECTION 3: Parent / Guardian Details */}
        <div className="form-card fullwidth-card">
          <div className="section-title">
            <Users size={22} className="section-icon" />
            <div>
              <h3>3. Parent / Guardian Details</h3>
              <p>Primary parent contact information</p>
            </div>
          </div>

          <div className="form-grid-4col">
            <div className="form-group col-span-2">
              <label>Father's Name <span className="req">*</span></label>
              <input
                type="text"
                name="fatherName"
                placeholder="Enter father's full name"
                value={formData.fatherName}
                onChange={handleChange}
                className={errors.fatherName ? 'input-error' : ''}
              />
              {errors.fatherName && <span className="error-text">{errors.fatherName}</span>}
            </div>

            <div className="form-group col-span-2">
              <label>Parent Contact Phone <span className="req">*</span></label>
              <input
                type="tel"
                name="parentPhone"
                placeholder="10-digit mobile number"
                value={formData.parentPhone}
                onChange={handleChange}
                className={errors.parentPhone ? 'input-error' : ''}
              />
              {errors.parentPhone && <span className="error-text">{errors.parentPhone}</span>}
            </div>
          </div>
        </div>

        {/* SECTION 4: Contact Information */}
        <div className="form-card fullwidth-card">
          <div className="section-title">
            <Phone size={22} className="section-icon" />
            <div>
              <h3>4. Contact Details</h3>
              <p>Student communication channels</p>
            </div>
          </div>

          <div className="form-grid-4col">
            <div className="form-group col-span-2">
              <label>Student Email Address <span className="req">*</span></label>
              <input
                type="email"
                name="email"
                placeholder="student.name@institute.edu"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group col-span-2">
              <label>Student Mobile Number <span className="req">*</span></label>
              <input
                type="tel"
                name="phone"
                placeholder="10-digit personal mobile"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'input-error' : ''}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions-bar">
          {isEditing && onCancelEdit ? (
            <button
              type="button"
              className="secondary-btn action-btn"
              onClick={onCancelEdit}
              disabled={isSubmitting}
            >
              <RotateCcw size={18} />
              <span>Cancel Edit</span>
            </button>
          ) : (
            <button
              type="button"
              className="secondary-btn action-btn"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              <RotateCcw size={18} />
              <span>Reset All Fields</span>
            </button>
          )}

          <button
            type="submit"
            className="primary-btn action-btn submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>Saving to PostgreSQL Database...</span>
            ) : isEditing ? (
              <>
                <Send size={18} />
                <span>Update Student in PostgreSQL Database</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Submit & Save Student to Database</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
