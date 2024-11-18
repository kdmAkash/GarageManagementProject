import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UpdateParts = () => {
  const { id } = useParams();  // Get the part ID from URL params
  const [part, setPart] = useState({
    part_id: '',
    part_name: '',
    category: '',
    supplier_name: '',
    quantity: '',
    price: '',
    date: '',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPart({
      ...part,
      [name]: value,
    });
    console.log(part);
  };

  // Validation function similar to UpdateUser
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!part.part_id) {
      formErrors.part_id = 'Part ID is required';
      isValid = false;
    }

    if (!part.part_name) {
      formErrors.part_name = 'Part Name is required';
      isValid = false;
    } else if (part.part_name.length < 3) {
      formErrors.part_name = 'Part Name should be at least 3 characters long';
      isValid = false;
    }

    if (!part.category) {
      formErrors.category = 'Category is required';
      isValid = false;
    }

    if (!part.supplier_name) {
      formErrors.supplier_name = 'Supplier Name is required';
      isValid = false;
    }

    if (!part.quantity || isNaN(part.quantity) || part.quantity <= 0) {
      formErrors.quantity = 'Valid Quantity is required';
      isValid = false;
    }

    if (!part.price || isNaN(part.price) || part.price <= 0) {
      formErrors.price = 'Valid Price is required';
      isValid = false;
    }

    if (!part.date) {
      formErrors.date = 'Date is required';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  // Handle form submission to update the part
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await fetch(`http://localhost:3000/inventory/updateparts/${part.part_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(part),
        });

        if (response.ok) {
          const data = await response.json();
          setMessage(`Part with ID: ${data.part_id} has been updated successfully.`);
          handleCancel();
        } else {
          const errorData = await response.json();
          alert(`Error updating part: ${errorData.error}`);
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    setPart({
      part_id: '',
      part_name: '',
      category: '',
      supplier_name: '',
      quantity: '',
      price: '',
      date: '',
    });
    setMessage('');
    setErrors({});
  };

  return (
    <div className="update-user-container">
      <h2>Update Part</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Part ID:</label>
          <input
            type="number"
            name="part_id"
            value={part.part_id}
            onChange={handleChange}
            required
          />
          {errors.part_id && <span className="error">{errors.part_id}</span>}
        </div>
        <div className="form-group">
          <label>Part Name:</label>
          <input
            type="text"
            name="part_name"
            value={part.part_name}
            onChange={handleChange}
            required
          />
          {errors.part_name && <span className="error">{errors.part_name}</span>}
        </div>
        <div className="form-group">
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={part.category}
            onChange={handleChange}
            required
          />
          {errors.category && <span className="error">{errors.category}</span>}
        </div>
        <div className="form-group">
          <label>Supplier Name:</label>
          <input
            type="text"
            name="supplier_name"
            value={part.supplier_name}
            onChange={handleChange}
            required
          />
          {errors.supplier_name && <span className="error">{errors.supplier_name}</span>}
        </div>
        <div className="form-group">
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={part.quantity}
            onChange={handleChange}
            required
          />
          {errors.quantity && <span className="error">{errors.quantity}</span>}
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={part.price}
            onChange={handleChange}
            required
          />
          {errors.price && <span className="error">{errors.price}</span>}
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={part.date}
            onChange={handleChange}
            required
          />
          {errors.date && <span className="error">{errors.date}</span>}
        </div>
        <div className="form-buttons">
          <button type="submit" className="save-btn">Update Part</button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default UpdateParts;
