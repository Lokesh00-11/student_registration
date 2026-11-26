import React, { useState } from 'react';
import { 
  User, 
  Users, 
  Phone, 
  GraduationCap, 
  CheckCircle, 
  AlertCircle, 
  RotateCcw, 
  Send,
  Sparkles,
  IdCard
} from 'lucide-react';

export interface StudentFormData {
  // Academic Information
  admissionNumber: string;
  department: string;
  semester: string;
  gpa: string;
  previousEducation: string;

  // Personal Information
  fullName: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  nationality: string;

  // Parent / Guardian Information
  fatherName: string;
  motherName: string;
  parentPhone: string;
  parentOccupation: string;

  // Contact Information
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const initialFormData: StudentFormData = {
  admissionNumber: `ADM-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
  department: 'Computer Science & Engineering',
  semester: '1st Semester',
  gpa: '9.20',
  previousEducation: '92.5%',
  fullName: '',
  dob: '',
  gender: 'Male',
  bloodGroup: 'O+',
  nationality: 'Indian',
  fatherName: '',
  motherName: '',
  parentPhone: '',
  parentOccupation: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: 'Telangana',
  pincode: '',
};

interface StudentRegistrationFormProps {
  onSuccess?: (newStudent: StudentFormData) => void;
  existingCount: number;
}

export const StudentRegistrationForm: React.FC<StudentRegistrationFormProps> = ({ 
  onSuccess, 
  existingCount 
}) => {
  const [formData, setFormData] = useState<StudentFormData>(() => ({
    ...initialFormData,
    admissionNumber: `ADM-2026-${String(existingCount + 1).padStart(3, '0')}`,
  }));

  const [errors, setErrors] = useState<Partial<Record<keyof StudentFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Real-time onChange handler
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

    // Academic Info Validation
    if (!formData.admissionNumber.trim()) {
      newErrors.admissionNumber = 'Admission Number required';
    }
    if (!formData.department) newErrors.department = 'Please select a department';
    
    if (!formData.gpa.trim()) {
      newErrors.gpa = 'GPA is required';
    } else {
      const gpaNum = parseFloat(formData.gpa);
      if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 10) {
        newErrors.gpa = 'Enter GPA between 0.00 and 10.00';
      }
    }

    // Personal Info Validation
    if (!formData.fullName.trim()) newErrors.fullName = 'Full student name is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';

    // Parent Info Validation
    if (!formData.fatherName.trim()) newErrors.fatherName = "Father's name is required";
    if (!formData.parentPhone.trim()) {
      newErrors.parentPhone = 'Parent contact required';
    } else if (!/^\d{10}$/.test(formData.parentPhone)) {
      newErrors.parentPhone = 'Must be a 10-digit number';
    }

    // Contact Info Validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Student phone number required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Must be a 10-digit number';
    }

    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'PIN Code required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setAlertMessage({
        type: 'error',
        text: 'Please fill in all required fields accurately.',
      });
      return;
    }

    setIsSubmitting(true);
    setAlertMessage(null);

    try {
      // Simulate real-time API latency
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (onSuccess) {
        onSuccess(formData);
      }

      setAlertMessage({
        type: 'success',
        text: `Student "${formData.fullName}" (${formData.admissionNumber}) registered successfully with GPA ${formData.gpa}!`,
      });

      // Prepare next student with incremented admission number
      setFormData({
        ...initialFormData,
        admissionNumber: `ADM-2026-${String(existingCount + 2).padStart(3, '0')}`,
      });
      setErrors({});
    } catch {
      setAlertMessage({
        type: 'error',
        text: 'Failed to complete registration. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      ...initialFormData,
      admissionNumber: `ADM-2026-${String(existingCount + 1).padStart(3, '0')}`,
    });
    setErrors({});
    setAlertMessage(null);
  };

  return (
    <div className="fullscreen-form-wrapper">
      {/* Real-time Alert Toast Banner */}
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

      {/* Main Full-Screen Split: Form + Real-time Live Preview Card */}
      <div className="fullscreen-layout-grid">
        <form className="fullscreen-form" onSubmit={handleSubmit} noValidate>
          {/* Section 1: Academic Information */}
          <div className="form-card fullwidth-card">
            <div className="section-title">
              <GraduationCap size={20} className="section-icon" />
              <div>
                <h3>1. Academic Information</h3>
                <p>Institute admission registration and performance data</p>
              </div>
            </div>

            <div className="form-grid-4col">
              <div className="form-group">
                <label>Admission Number <span className="req">*</span></label>
                <input
                  type="text"
                  name="admissionNumber"
                  value={formData.admissionNumber}
                  onChange={handleChange}
                  className={errors.admissionNumber ? 'input-error' : ''}
                />
                {errors.admissionNumber && <span className="error-text">{errors.admissionNumber}</span>}
              </div>

              <div className="form-group">
                <label>Department / Branch <span className="req">*</span></label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={errors.department ? 'input-error' : ''}
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Data Science & AI">Data Science & AI</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                </select>
                {errors.department && <span className="error-text">{errors.department}</span>}
              </div>

              <div className="form-group">
                <label>Current Semester</label>
                <select name="semester" value={formData.semester} onChange={handleChange}>
                  <option value="1st Semester">1st Semester</option>
                  <option value="2nd Semester">2nd Semester</option>
                  <option value="3rd Semester">3rd Semester</option>
                  <option value="4th Semester">4th Semester</option>
                  <option value="5th Semester">5th Semester</option>
                  <option value="6th Semester">6th Semester</option>
                </select>
              </div>

              <div className="form-group">
                <label>Current GPA (0 - 10) <span className="req">*</span></label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  name="gpa"
                  placeholder="e.g. 9.40"
                  value={formData.gpa}
                  onChange={handleChange}
                  className={errors.gpa ? 'input-error' : ''}
                />
                {errors.gpa && <span className="error-text">{errors.gpa}</span>}
              </div>
            </div>
          </div>

          {/* Section 2: Personal Information */}
          <div className="form-card fullwidth-card">
            <div className="section-title">
              <User size={20} className="section-icon" />
              <div>
                <h3>2. Personal Information</h3>
                <p>Student identity, demographic, and personal profile</p>
              </div>
            </div>

            <div className="form-grid-4col">
              <div className="form-group col-span-2">
                <label>Student Full Name <span className="req">*</span></label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter complete legal name"
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
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
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

              <div className="form-group col-span-2">
                <label>Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Parent & Guardian Details */}
          <div className="form-card fullwidth-card">
            <div className="section-title">
              <Users size={20} className="section-icon" />
              <div>
                <h3>3. Parent / Guardian Details</h3>
                <p>Parent contact and family background information</p>
              </div>
            </div>

            <div className="form-grid-4col">
              <div className="form-group">
                <label>Father's Name <span className="req">*</span></label>
                <input
                  type="text"
                  name="fatherName"
                  placeholder="Father's full name"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className={errors.fatherName ? 'input-error' : ''}
                />
                {errors.fatherName && <span className="error-text">{errors.fatherName}</span>}
              </div>

              <div className="form-group">
                <label>Mother's Name</label>
                <input
                  type="text"
                  name="motherName"
                  placeholder="Mother's full name"
                  value={formData.motherName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
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

              <div className="form-group">
                <label>Parent Occupation</label>
                <input
                  type="text"
                  name="parentOccupation"
                  placeholder="e.g. Doctor, Business, Engineer"
                  value={formData.parentOccupation}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Contact & Residential Details */}
          <div className="form-card fullwidth-card">
            <div className="section-title">
              <Phone size={20} className="section-icon" />
              <div>
                <h3>4. Contact & Residential Details</h3>
                <p>Permanent address and student communication channels</p>
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

              <div className="form-group col-span-2">
                <label>Permanent Residential Address <span className="req">*</span></label>
                <input
                  type="text"
                  name="address"
                  placeholder="House/Door No, Street Name, Landmark"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? 'input-error' : ''}
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>

              <div className="form-group">
                <label>City <span className="req">*</span></label>
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. Hyderabad"
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
                  placeholder="6-digit PIN code"
                  value={formData.pincode}
                  onChange={handleChange}
                  className={errors.pincode ? 'input-error' : ''}
                />
                {errors.pincode && <span className="error-text">{errors.pincode}</span>}
              </div>
            </div>
          </div>

          {/* Form Submit & Reset Actions */}
          <div className="form-actions-bar">
            <button
              type="button"
              className="secondary-btn action-btn"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              <RotateCcw size={18} />
              <span>Reset All Fields</span>
            </button>

            <button
              type="submit"
              className="primary-btn action-btn submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Registering to Real-Time System...</span>
              ) : (
                <>
                  <Send size={18} />
                  <span>Submit & Save to Real-Time Data</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Real-Time Live Student Preview Card */}
        <aside className="realtime-preview-sidebar">
          <div className="preview-card-sticky">
            <div className="preview-card-header">
              <div className="preview-title">
                <IdCard size={20} />
                <span>Live Student Card Preview</span>
              </div>
              <span className="live-tag">
                <Sparkles size={14} /> LIVE
              </span>
            </div>

            <div className="student-id-card">
              <div className="id-card-top">
                <div className="id-avatar">
                  <User size={32} />
                </div>
                <div className="id-title">
                  <h4>{formData.fullName || 'Student Name'}</h4>
                  <span className="id-badge">#{formData.admissionNumber || 'ADM-2026-XXX'}</span>
                </div>
              </div>

              <div className="id-divider" />

              <div className="id-meta-grid">
                <div>
                  <small>Department</small>
                  <p>{formData.department || 'Not selected'}</p>
                </div>
                <div>
                  <small>Current GPA</small>
                  <p className="gpa-highlight">{formData.gpa ? `${formData.gpa} / 10.0` : '--'}</p>
                </div>
                <div>
                  <small>Gender & Blood</small>
                  <p>{formData.gender} • {formData.bloodGroup}</p>
                </div>
                <div>
                  <small>Semester</small>
                  <p>{formData.semester}</p>
                </div>
                <div>
                  <small>Contact Email</small>
                  <p className="truncate-text">{formData.email || 'name@institute.edu'}</p>
                </div>
                <div>
                  <small>City</small>
                  <p>{formData.city || 'City'}</p>
                </div>
              </div>

              <div className="id-card-footer">
                <span>Verified Institute Student Card</span>
              </div>
            </div>

            <div className="realtime-hint">
              💡 <strong>Real-time Sync:</strong> As soon as you click submit, this record immediately updates the <strong>Total Students</strong>, <strong>Highest GPA</strong>, and <strong>Department counts</strong> without page refresh.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
