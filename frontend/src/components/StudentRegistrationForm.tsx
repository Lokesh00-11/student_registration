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
  // Personal Information
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  nationality: string;

  // Academic Information
  admissionNumber: string;
  rollNumber: string;
  department: string;
  semester: string;
  gpa: string;

  // Parent / Guardian Information
  fatherName: string;
  motherName: string;
  fatherOccupation: string;
  parentPhone: string;

  // Contact Information
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const initialFormData: StudentFormData = {
  firstName: '',
  lastName: '',
  dob: '',
  gender: 'Male',
  bloodGroup: 'O+',
  nationality: 'Indian',
  admissionNumber: '',
  rollNumber: '',
  department: 'Computer Science & Engineering',
  semester: '1st Semester',
  gpa: '9.20',
  fatherName: '',
  motherName: '',
  fatherOccupation: '',
  parentPhone: '',
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
    rollNumber: `ROLL-2026-${String(existingCount + 1).padStart(3, '0')}`,
  }));

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

    // 1. Personal Info Validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';

    // 2. Academic Info Validation (Admission Number & Roll Number)
    if (!formData.admissionNumber.trim()) {
      newErrors.admissionNumber = 'Admission Number is required';
    }
    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = 'Student Roll Number is required';
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

    // 3. Parent Info Validation (Father + Mother details)
    if (!formData.fatherName.trim()) newErrors.fatherName = "Father's name is required";
    if (!formData.motherName.trim()) newErrors.motherName = "Mother's name is required";
    if (!formData.fatherOccupation.trim()) newErrors.fatherOccupation = "Father's occupation is required";
    if (!formData.parentPhone.trim()) {
      newErrors.parentPhone = 'Parent contact phone is required';
    } else if (!/^\d{10}$/.test(formData.parentPhone)) {
      newErrors.parentPhone = 'Must be a 10-digit number';
    }

    // 4. Contact Info Validation
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

    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'PIN Code is required';
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
        text: 'Please fill in all required fields accurately before submitting.',
      });
      return;
    }

    setIsSubmitting(true);
    setAlertMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (onSuccess) {
        onSuccess(formData);
      }

      const studentFullName = `${formData.firstName} ${formData.lastName}`.trim();
      setAlertMessage({
        type: 'success',
        text: `Student "${studentFullName}" (Roll: ${formData.rollNumber}, Adm: ${formData.admissionNumber}) registered successfully with GPA ${formData.gpa}!`,
      });

      // Prepare next student record with auto-increment
      setFormData({
        ...initialFormData,
        admissionNumber: `ADM-2026-${String(existingCount + 2).padStart(3, '0')}`,
        rollNumber: `ROLL-2026-${String(existingCount + 2).padStart(3, '0')}`,
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
      rollNumber: `ROLL-2026-${String(existingCount + 1).padStart(3, '0')}`,
    });
    setErrors({});
    setAlertMessage(null);
  };

  return (
    <div className="fullscreen-form-wrapper">
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
        {/* SECTION 1: Personal Information (FIRST - First Name & Last Name) */}
        <div className="form-card fullwidth-card">
          <div className="section-title">
            <User size={22} className="section-icon" />
            <div>
              <h3>1. Personal Information</h3>
              <p>Student identity, demographic profile, and legal details</p>
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

        {/* SECTION 2: Academic Information (SECOND - Admission No + Roll No) */}
        <div className="form-card fullwidth-card">
          <div className="section-title">
            <GraduationCap size={22} className="section-icon" />
            <div>
              <h3>2. Academic Information</h3>
              <p>Institute admission registration, student roll number, and GPA grading</p>
            </div>
          </div>

          <div className="form-grid-4col">
            <div className="form-group col-span-2">
              <label>Admission Number <span className="req">*</span></label>
              <input
                type="text"
                name="admissionNumber"
                placeholder="e.g. ADM-2026-011"
                value={formData.admissionNumber}
                onChange={handleChange}
                className={errors.admissionNumber ? 'input-error' : ''}
              />
              {errors.admissionNumber && <span className="error-text">{errors.admissionNumber}</span>}
            </div>

            <div className="form-group col-span-2">
              <label>Student Roll Number <span className="req">*</span></label>
              <input
                type="text"
                name="rollNumber"
                placeholder="e.g. ROLL-2026-011"
                value={formData.rollNumber}
                onChange={handleChange}
                className={errors.rollNumber ? 'input-error' : ''}
              />
              {errors.rollNumber && <span className="error-text">{errors.rollNumber}</span>}
            </div>

            <div className="form-group col-span-2">
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

        {/* SECTION 3: Parent / Guardian Details (THIRD - Father + Mother) */}
        <div className="form-card fullwidth-card">
          <div className="section-title">
            <Users size={22} className="section-icon" />
            <div>
              <h3>3. Parent / Guardian Details</h3>
              <p>Father and Mother information with primary contact</p>
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
              <label>Mother's Name <span className="req">*</span></label>
              <input
                type="text"
                name="motherName"
                placeholder="Enter mother's full name"
                value={formData.motherName}
                onChange={handleChange}
                className={errors.motherName ? 'input-error' : ''}
              />
              {errors.motherName && <span className="error-text">{errors.motherName}</span>}
            </div>

            <div className="form-group col-span-2">
              <label>Father's Occupation <span className="req">*</span></label>
              <input
                type="text"
                name="fatherOccupation"
                placeholder="e.g. Engineer, Business, Doctor"
                value={formData.fatherOccupation}
                onChange={handleChange}
                className={errors.fatherOccupation ? 'input-error' : ''}
              />
              {errors.fatherOccupation && <span className="error-text">{errors.fatherOccupation}</span>}
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

        {/* SECTION 4: Contact & Residential Details (FOURTH) */}
        <div className="form-card fullwidth-card">
          <div className="section-title">
            <Phone size={22} className="section-icon" />
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

        {/* Form Actions */}
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
                <span>Submit & Save Student Registration</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
