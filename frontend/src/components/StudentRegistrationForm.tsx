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
  // Personal Info
  fullName: string;
  dob: string;
  gender: string;
  bloodGroup: string;

  // Parent Info
  fatherName: string;
  motherName: string;
  parentPhone: string;
  parentOccupation: string;

  // Contact Info
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;

  // Academic Info
  admissionNumber: string;
  department: string;
  semester: string;
  previousMarks: string;
}

const initialFormData: StudentFormData = {
  fullName: '',
  dob: '',
  gender: 'Male',
  bloodGroup: '',
  fatherName: '',
  motherName: '',
  parentPhone: '',
  parentOccupation: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  admissionNumber: '',
  department: '',
  semester: '1st Semester',
  previousMarks: '',
};

interface StudentRegistrationFormProps {
  onSuccess?: (newStudent: StudentFormData) => void;
}

export const StudentRegistrationForm: React.FC<StudentRegistrationFormProps> = ({ onSuccess }) => {
  // Controlled component state
  const [formData, setFormData] = useState<StudentFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof StudentFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Controlled component onChange handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error as user types
    if (errors[name as keyof StudentFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Frontend Validation
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof StudentFormData, string>> = {};

    // Personal Info
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Please select a gender';

    // Parent Info
    if (!formData.fatherName.trim()) newErrors.fatherName = "Father's name is required";
    if (!formData.parentPhone.trim()) {
      newErrors.parentPhone = "Parent's contact number is required";
    } else if (!/^\d{10}$/.test(formData.parentPhone)) {
      newErrors.parentPhone = 'Must be a valid 10-digit phone number';
    }

    // Contact Info
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Student phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Must be a valid 10-digit phone number';
    }

    if (!formData.address.trim()) newErrors.address = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'PIN Code is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Must be a valid 6-digit PIN code';
    }

    // Academic Info & Admission Number Validation
    if (!formData.admissionNumber.trim()) {
      newErrors.admissionNumber = 'Admission number is required';
    } else if (!/^ADM-\d{4}-\d{3,5}$/i.test(formData.admissionNumber)) {
      newErrors.admissionNumber = 'Format must be ADM-YYYY-XXXX (e.g. ADM-2026-001)';
    }

    if (!formData.department) newErrors.department = 'Please select a department';
    if (!formData.previousMarks.trim()) {
      newErrors.previousMarks = 'Previous percentage/GPA is required';
    } else if (isNaN(Number(formData.previousMarks)) || Number(formData.previousMarks) < 0 || Number(formData.previousMarks) > 100) {
      newErrors.previousMarks = 'Enter a valid percentage between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // onSubmit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setAlertMessage({
        type: 'error',
        text: 'Please review and resolve the validation errors marked below.',
      });
      return;
    }

    // Prevent duplicate submission
    setIsSubmitting(true);
    setAlertMessage(null);

    try {
      // Simulate API POST request (ready to replace with: await axios.post('/api/students', formData))
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setAlertMessage({
        type: 'success',
        text: `Student registered successfully! Admission No: ${formData.admissionNumber}`,
      });

      if (onSuccess) {
        onSuccess(formData);
      }

      // Reset form on success
      setFormData(initialFormData);
      setErrors({});
    } catch {
      setAlertMessage({
        type: 'error',
        text: 'Failed to submit registration. Please check connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to clear the form?')) {
      setFormData(initialFormData);
      setErrors({});
      setAlertMessage(null);
    }
  };

  return (
    <div className="form-page-container">
      {/* Alert / Toast Message */}
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

      <form className="registration-form" onSubmit={handleSubmit} noValidate>
        {/* Section 1: Academic & Admission Info */}
        <div className="form-card">
          <div className="section-title">
            <GraduationCap size={22} className="section-icon" />
            <div>
              <h3>Academic & Admission Information</h3>
              <p>Assign official admission number and course details</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Admission Number <span className="req">*</span></label>
              <input
                type="text"
                name="admissionNumber"
                placeholder="e.g. ADM-2026-001"
                value={formData.admissionNumber}
                onChange={handleChange}
                className={errors.admissionNumber ? 'input-error' : ''}
              />
              {errors.admissionNumber && <span className="error-text">{errors.admissionNumber}</span>}
            </div>

            <div className="form-group">
              <label>Department / Course <span className="req">*</span></label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={errors.department ? 'input-error' : ''}
              >
                <option value="">-- Select Department --</option>
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Data Science & AI">Data Science & AI</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
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
              <label>Previous Marks (% / GPA) <span className="req">*</span></label>
              <input
                type="number"
                step="0.01"
                name="previousMarks"
                placeholder="e.g. 88.5"
                value={formData.previousMarks}
                onChange={handleChange}
                className={errors.previousMarks ? 'input-error' : ''}
              />
              {errors.previousMarks && <span className="error-text">{errors.previousMarks}</span>}
            </div>
          </div>
        </div>

        {/* Section 2: Personal Information */}
        <div className="form-card">
          <div className="section-title">
            <User size={22} className="section-icon" />
            <div>
              <h3>Personal Information</h3>
              <p>Basic demographic and personal background of the student</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group full-width">
              <label>Full Name (as per certificates) <span className="req">*</span></label>
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
              {errors.gender && <span className="error-text">{errors.gender}</span>}
            </div>

            <div className="form-group">
              <label>Blood Group</label>
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                <option value="">-- Select Blood Group --</option>
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
          </div>
        </div>

        {/* Section 3: Parent / Guardian Information */}
        <div className="form-card">
          <div className="section-title">
            <Users size={22} className="section-icon" />
            <div>
              <h3>Parent / Guardian Information</h3>
              <p>Primary family contacts and responsible guardian details</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Father's Name <span className="req">*</span></label>
              <input
                type="text"
                name="fatherName"
                placeholder="Enter father's name"
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
                placeholder="Enter mother's name"
                value={formData.motherName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Parent Contact Number <span className="req">*</span></label>
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
                placeholder="e.g. Engineer, Business"
                value={formData.parentOccupation}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Contact & Address Information */}
        <div className="form-card">
          <div className="section-title">
            <Phone size={22} className="section-icon" />
            <div>
              <h3>Contact & Communication Details</h3>
              <p>Residential address and student communication channels</p>
            </div>
          </div>

          <div className="form-grid">
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
              <label>Student Phone Number <span className="req">*</span></label>
              <input
                type="tel"
                name="phone"
                placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'input-error' : ''}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <div className="form-group full-width">
              <label>Permanent Residential Address <span className="req">*</span></label>
              <textarea
                name="address"
                rows={3}
                placeholder="Flat / Door No, Street, Landmark"
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
              <label>State <span className="req">*</span></label>
              <input
                type="text"
                name="state"
                placeholder="e.g. Telangana"
                value={formData.state}
                onChange={handleChange}
                className={errors.state ? 'input-error' : ''}
              />
              {errors.state && <span className="error-text">{errors.state}</span>}
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

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            <RotateCcw size={18} />
            <span>Reset Form</span>
          </button>

          <button
            type="submit"
            className="primary-btn submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>Submitting Registration...</span>
            ) : (
              <>
                <Send size={18} />
                <span>Submit Student Registration</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
