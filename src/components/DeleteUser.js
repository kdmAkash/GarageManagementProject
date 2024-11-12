// DeleteUser.js
import React, { useState } from 'react';

const DeleteUser = () => {
  const [emailOrId, setEmailOrId] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');

  // Handle input change
  const handleChange = (e) => {
    setEmailOrId(e.target.value);
  };

  // Handle delete action
  const handleDelete = async (e) => {
    e.preventDefault();
    if (!emailOrId) {
      setConfirmationMessage('Please provide an email or Id.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/emp/${emailOrId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        const result = await response.json();
        setConfirmationMessage(result.message);
      } else {
        const error = await response.json();
        setConfirmationMessage(`Error: ${error.error}`);
      }
    } catch (err) {
      setConfirmationMessage(`Error: ${err.message}`);
    }
  
    setEmailOrId('');
  };
  

  // Handle cancel action
  const handleCancel = () => {
    setEmailOrId('');
    setConfirmationMessage('');
  };

  return (
    <div className="form-container">
      <h2>Delete User</h2>
      <form onSubmit={handleDelete}>
        <div className="form-group">
          <label>Enter Email or Id to Delete:</label>
          <input
            type="text"
            name="emailOrId"
            value={emailOrId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="delete-btn">
            Delete
          </button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
      {confirmationMessage && <p>{confirmationMessage}</p>}
    </div>
  );
};

export default DeleteUser;
