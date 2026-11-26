import React, { useState } from 'react';
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

export interface StudentFormData {
  // Academic Info
  admissionNumber: string;
  department: string;
  semester: string;
  gpa: string;

  // Personal Info
  fullName: string;
  dob: string;
  gender: string;
  bloodGroup: string;

  // Parent Info
  fatherName: string;
  parentPhone: string;
  parentOccupation: string;

  // Contact Info
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

const initialFormData: StudentFormData = {
  admissionNumber: '',
  department: '',
  semester: '1st Semester',
  gpa: '',
  fullName: '',
  dob: '',
  gender: 'Male',
  bloodGroup: '',
  fatherName: '',
  parentPhone: '',
  parentOccupation: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  pincode: '',
};

interface StudentRegistrationFormProps {
  onSuccess?: (newStudent: StudentFormData) => void;
}

export const StudentRegistrationForm: React.FC<StudentRegistrationFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<StudentFormData>(initialFormData);
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

    // Academic Info
    if (!formData.admissionNumber.trim()) {
      newErrors.admissionNumber = 'Required';
    } else if (!/^ADM-\d{4}-\d{3,5}$/i.test(formData.admissionNumber)) {
      newErrors.admissionNumber = 'Format: ADM-YYYY-XXX';
    }

    if (!formData.department) newErrors.department = 'Please select department';
    
    if (!formData.gpa.trim()) {
      newErrors.gpa = 'Required';
    } else {
      const gpaNum = parseFloat(formData.gpa);
      if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 10) {
        newErrors.gpa = 'Must be between 0.0 - 10.0';
      }
    }

    // Personal Info
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.dob) newErrors.dob = 'DOB is required';

    // Parent Info
    if (!formData.fatherName.trim()) newErrors.fatherName = "Father's name required";
    if (!formData.parentPhone.trim()) {
      newErrors.parentPhone = 'Parent phone required';
    } else if (!/^\d{10}$/.test(formData.parentPhone)) {
      newErrors.parentPhone = 'Must be 10 digits';
    }

    // Contact Info
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Must be 10 digits';
    }

    if (!formData.city.trim()) newErrors.city = 'City required';
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'PIN required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = '6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setAlertMessage({
        type: 'error',
        text: 'Please check the required fields highlighted below.',
      });
      return;
    }

    setIsSubmitting(true);
    setAlertMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      setAlertMessage({
        type: 'success',
        text: `Student registered successfully! Admission No: ${formData.admissionNumber}`,
      });

      if (onSuccess) {
        onSuccess(formData);
      }

      setFormData(initialFormData);
      setErrors({});
    } catch {
      setAlertMessage({
        type: 'error',
        text: 'Failed to submit registration. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setAlertMessage(null);
  };

  return (
    <div className="compact-form-container">
      {alertMessage && (
        <div className={`alert-banner ${alertMessage.type} compact-alert`}>
          {alertMessage.type === 'success' ? (
            <CheckCircle size={18} className="alert-icon" />
          ) : (
            <AlertCircle size={18} className="alert-icon" />
          )}
          <span>{alertMessage.text}</span>
          <button className="alert-close" onClick={() => setAlertMessage(null)}>×</button>
        </div>
      )}

      <form className="screen-fit-form" onSubmit={handleSubmit} noValidate>
        <div className="form-sections-grid">
          {/* Card 1: Academic Information */}
          <div className="form-card compact-card">
            <div className="section-title compact-header">
              <GraduationCap size={18} className="section-icon" />
              <div>
                <h3>Academic Details</h3>
                <p>Admission & Grade Info</p>
              </div>
            </div>

            <div className="compact-grid">
              <div className="form-group">
                <label>Admission No <span className="req">*</span></label>
                <input
                  type="text"
                  name="admissionNumber"
                  placeholder="ADM-2026-011"
                  value={formData.admissionNumber}
                  onChange={handleChange}
                  className={errors.admissionNumber ? 'input-error' : ''}
                />
                {errors.admissionNumber && <span className="error-text">{errors.admissionNumber}</span>}
              </div>

              <div className="form-group">
                <label>Department <span className="req">*</span></label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={errors.department ? 'input-error' : ''}
                >
                  <option value="">-- Select --</option>
                  <option value="Computer Science & Engineering">Computer Science</option>
                  <option value="Information Technology">Information Tech</option>
                  <option value="Data Science & AI">Data Science</option>
                  <option value="Electronics & Communication">Electronics</option>
                  <option value="Mechanical Engineering">Mechanical</option>
                </select>
                {errors.department && <span className="error-text">{errors.department}</span>}
              </div>

              <div className="form-group">
                <label>Semester</label>
                <select name="semester" value={formData.semester} onChange={handleChange}>
                  <option value="1st Semester">1st Semester</option>
                  <option value="2nd Semester">2nd Semester</option>
                  <option value="3rd Semester">3rd Semester</option>
                  <option value="4th Semester">4th Semester</option>
                </select>
              </div>

              <div className="form-group">
                <label>Current GPA (0-10) <span className="req">*</span></label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  name="gpa"
                  placeholder="e.g. 9.45"
                  value={formData.gpa}
                  onChange={handleChange}
                  className={errors.gpa ? 'input-error' : ''}
                />
                {errors.gpa && <span className="error-text">{errors.gpa}</span>}
              </div>
            </div>
          </div>

          {/* Card 2: Personal Information */}
          <div className="form-card compact-card">
            <div className="section-title compact-header">
              <User size={18} className="section-icon" />
              <div>
                <h3>Personal Information</h3>
                <p>Identity & Demographic</p>
              </div>
            </div>

            <div className="compact-grid">
              <div className="form-group full-width">
                <label>Student Full Name <span className="req">*</span></label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. Lokesh V"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? 'input-error' : ''}
                />
                {errors.fullName && <span className="error-text">{errors.fullName}</span>}
              </div>

              <div className="form-group">
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

              <div className="form-group">
                <label>Blood Group</label>
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="O+">O+</option>
                  <option value="AB+">AB+</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Gender <span className="req">*</span></label>
                <div className="radio-group compact-radio">
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

          {/* Card 3: Parent / Guardian Info */}
          <div className="form-card compact-card">
            <div className="section-title compact-header">
              <Users size={18} className="section-icon" />
              <div>
                <h3>Parent Details</h3>
                <p>Guardian & Family Contact</p>
              </div>
            </div>

            <div className="compact-grid">
              <div className="form-group full-width">
                <label>Father / Guardian Name <span className="req">*</span></label>
                <input
                  type="text"
                  name="fatherName"
                  placeholder="Father's name"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className={errors.fatherName ? 'input-error' : ''}
                />
                {errors.fatherName && <span className="error-text">{errors.fatherName}</span>}
              </div>

              <div className="form-group">
                <label>Parent Phone <span className="req">*</span></label>
                <input
                  type="tel"
                  name="parentPhone"
                  placeholder="10-digit number"
                  value={formData.parentPhone}
                  onChange={handleChange}
                  className={errors.parentPhone ? 'input-error' : ''}
                />
                {errors.parentPhone && <span className="error-text">{errors.parentPhone}</span>}
              </div>

              <div className="form-group">
                <label>Occupation</label>
                <input
                  type="text"
                  name="parentOccupation"
                  placeholder="e.g. Engineer"
                  value={formData.parentOccupation}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Card 4: Contact & Address */}
          <div className="form-card compact-card">
            <div className="section-title compact-header">
              <Phone size={18} className="section-icon" />
              <div>
                <h3>Contact Details</h3>
                <p>Email & Communication</p>
              </div>
            </div>

            <div className="compact-grid">
              <div className="form-group">
                <label>Email Address <span className="req">*</span></label>
                <input
                  type="email"
                  name="email"
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Student Phone <span className="req">*</span></label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="10-digit number"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'input-error' : ''}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label>City <span className="req">*</span></label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className={errors.city ? 'input-error' : ''}
                />
                {errors.city && <span className="error-text">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label>PIN Code <span className="req">*</span></label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="6-digit PIN"
                  value={formData.pincode}
                  onChange={handleChange}
                  className={errors.pincode ? 'input-error' : ''}
                />
                {errors.pincode && <span className="error-text">{errors.pincode}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="compact-actions">
          <button
            type="button"
            className="secondary-btn compact-btn"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>

          <button
            type="submit"
            className="primary-btn compact-btn submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>Submitting...</span>
            ) : (
              <>
                <Send size={16} />
                <span>Submit Student Registration</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
