import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    course: '',
    address: ''
  });

  const [submittedData, setSubmittedData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // STEP 2 IS HERE: Sends the form data to Express backend & saves to MongoDB
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/students', formData);
      setSubmittedData(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error saving student details:', error);
      alert('Failed to save student details. Make sure your backend server is running on port 5000.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      dob: '',
      gender: '',
      course: '',
      address: ''
    });
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Student Registration Form</h2>
        <form onSubmit={handleSubmit}>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="1234567890"
              value={formData.phone}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Gender</label>
            <div style={styles.genderGroup}>
              {['Male', 'Female', 'Other'].map((g) => (
                <label key={g} style={styles.genderLabel}>
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={handleChange}
                    required
                  />{' '}
                  {g}
                </label>
              ))}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Select Course</label>
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="" disabled>
                Choose a course
              </option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Business Administration">Business Administration</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Address</label>
            <textarea
              name="address"
              rows="3"
              placeholder="Enter your full address"
              value={formData.address}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            Submit Registration
          </button>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showModal && submittedData && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={{ color: '#4f46e5', marginBottom: '15px' }}>
              Saved to Database Successfully!
            </h3>
            <p><strong>Database ID:</strong> {submittedData._id}</p>
            <p><strong>Name:</strong> {submittedData.fullName}</p>
            <p><strong>Email:</strong> {submittedData.email}</p>
            <p><strong>Phone:</strong> {submittedData.phone}</p>
            <p><strong>DOB:</strong> {submittedData.dob}</p>
            <p><strong>Gender:</strong> {submittedData.gender}</p>
            <p><strong>Course:</strong> {submittedData.course}</p>
            <p><strong>Address:</strong> {submittedData.address}</p>
            
            <button
              onClick={closeModal}
              style={{ ...styles.button, backgroundColor: '#ef4444', marginTop: '15px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  body: {
    backgroundColor: '#f3f4f6',
    color: '#1f2937',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  container: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '600px'
  },
  heading: {
    marginBottom: '20px',
    color: '#4f46e5',
    textAlign: 'center'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '600',
    fontSize: '0.9rem'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '1rem',
    boxSizing: 'border-box'
  },
  genderGroup: {
    display: 'flex',
    gap: '15px',
    marginTop: '5px'
  },
  genderLabel: {
    fontWeight: 'normal',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    cursor: 'pointer'
  },
  button: {
    width: '100%',
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    maxWidth: '450px',
    width: '90%'
  }
};

export default App;