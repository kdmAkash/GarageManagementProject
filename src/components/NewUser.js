import React, { useState } from 'react';

const NewUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    number: '',
    email: '',
    date: '',
    vehicleNo: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Simple form validation
  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.name) {
      isValid = false;
      errors['name'] = 'Please enter your name.';
    }

    if (!formData.email) {
      isValid = false;
      errors['email'] = 'Please enter your email.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      isValid = false;
      errors['email'] = 'Email is invalid.';
    }

    if (!formData.number) {
      isValid = false;
      errors['number'] = 'Please enter your phone number.';
    } else if (!/^\d{10}$/.test(formData.number)) {
      isValid = false;
      errors['number'] = 'Phone number must be 10 digits.';
    }

    setErrors(errors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);  // Start loading
      try {
        const response = await fetch('http://localhost:3000/emp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),  // Send the form data in the request body
        });

        if (response.ok) {
          const responseData = await response.json();
          setMessage(`User created successfully with ID: ${responseData.userId}`);
          handleCancel();  // Reset form after successful submission
          alert("user added Successfully");
        } else {
          const errorData = await response.json();
          alert(`Error submitting data: ${errorData.error}`);
        }
      } catch (err) {
        alert(`Error: ${err.message}`);
      } finally {
        setLoading(false);  // Stop loading
      }
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    setFormData({
      name: '',
      address: '',
      number: '',
      email: '',
      date: '',
      vehicleNo: '',
    });
    setErrors({});
    setMessage('');  // Clear success message on cancel
  };

  return (
    <div className="form-container">
      <h2>New User Form</h2>
      <form onSubmit={handleSubmit} method='post'>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <div className="error">{errors.name}</div>
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Number:</label>
          <input
            type="text"
            name="number"
            value={formData.number}
            onChange={handleChange}
            required
          />
          <div className="error">{errors.number}</div>
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <div className="error">{errors.email}</div>
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Vehicle No:</label>
          <input
            type="text"
            name="vehicleNo"
            value={formData.vehicleNo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
        {message && <div className="success-message">{message}</div>}
      </form>
    </div>
  );
};

export default NewUser;
