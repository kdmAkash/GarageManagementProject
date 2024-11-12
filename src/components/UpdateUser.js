import React, { useState } from 'react';

const UpdateUser = () => {
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    address: '',
    number: '',
    date: '',
    vehicleNo: '',
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Form validation function
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // Check if userId is provided
    if (!formData.userId) {
      formErrors.userId = 'User ID or email is required';
      isValid = false;
    }

    // Check if name is provided
    if (!formData.name) {
      formErrors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.length < 3) {
      formErrors.name = 'Name should be at least 3 characters long';
      isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      formErrors.name = 'Name should only contain alphabetic characters and spaces';
      isValid = false;
    }

    // Check if address is provided
    if (!formData.address) {
      formErrors.address = 'Address is required';
      isValid = false;
    }

    // Validate phone number (example: 10 digits)
    if (!formData.number) {
      formErrors.number = 'Phone number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.number)) {
      formErrors.number = 'Phone number must be 10 digits';
      isValid = false;
    }

    // Validate vehicle number (example format)
    if (!formData.vehicleNo) {
      formErrors.vehicleNo = 'Vehicle number is required';
      isValid = false;
    } else if (!/^[A-Za-z0-9]{1,10}$/.test(formData.vehicleNo)) {
      formErrors.vehicleNo = 'Vehicle number should be alphanumeric (up to 10 characters)';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await fetch(`http://localhost:3000/emp/${formData.userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const responseData = await response.json();
          alert(`User with ID: ${responseData.userId} updated`);
          handleCancel();
        } else {
          const errorData = await response.json();
          alert(`Error submitting data: ${errorData.error}`);
        }
      } catch (err) {
        alert(`Error: ${err.message}`);
      }

      setMessage(`User with ID: ${formData.userId} has been updated.`);
      setErrors({});
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    setFormData({
      userId: '',
      name: '',
      address: '',
      number: '',
      date: '',
      vehicleNo: '',
    });
    setMessage('');
    setErrors({});
  };

  return (
    <div className="update-user-container">
      <h2>Update User</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>User ID or Email:</label>
          <input
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
            placeholder="Enter user ID or email"
          />
          {errors.userId && <span className="error">{errors.userId}</span>}
        </div>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <span className="error">{errors.name}</span>}
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
          {errors.address && <span className="error">{errors.address}</span>}
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
          {errors.number && <span className="error">{errors.number}</span>}
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
          {errors.vehicleNo && <span className="error">{errors.vehicleNo}</span>}
        </div>
        <div className="form-buttons">
          <button type="submit" className="save-btn">Update</button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
        </div>
      </form>

      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default UpdateUser;
