import React, { useState, useEffect } from 'react';

const OrderForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    user_id: '',
    parts: [{ part_id: '', quantity: '' }],
  });

  const [partsInfo, setPartsInfo] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);

  const fetchPartsInfo = async () => {
    try {
      const response = await fetch('http://localhost:3000/inventory/getparts');
      if (!response.ok) throw new Error('Failed to fetch parts data');
      const data = await response.json();
      setPartsInfo(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching parts info:', error);
      setError('Failed to load parts data. Please try again.');
    }
  };

  useEffect(() => {
    fetchPartsInfo();
  }, []);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedParts = [...formData.parts];
    updatedParts[index][name] = value;
    
    if (name === 'part_id' && value) {
      const filteredSuggestions = partsInfo.filter(
        (part) => part.part_id && part.part_id.toString().startsWith(value)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
    
    setFormData({
      ...formData,
      parts: updatedParts,
    });
  };

  const handleAddPart = () => {
    setFormData({
      ...formData,
      parts: [...formData.parts, { part_id: '', quantity: '' }],
    });
  };

  const handleRemovePart = (index) => {
    const updatedParts = formData.parts.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      parts: updatedParts,
    });
  };

  const handleSuggestionClick = (suggestion, index) => {
    const updatedParts = [...formData.parts];
    updatedParts[index].part_id = suggestion.part_id;
    setFormData({
      ...formData,
      parts: updatedParts,
    });
    setSuggestions([]);
  };

  const calculateTotalAmount = () => {
    return formData.parts.reduce((total, part) => {
      const partInfo = partsInfo.find((p) => p.part_id == part.part_id);
      return total + (partInfo ? partInfo.price * part.quantity : 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalAmount = calculateTotalAmount();

    try {
      const response = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, total_amount: totalAmount }),
      });

      if (!response.ok) throw new Error('Failed to submit order');
      alert('Order submitted successfully!');
      setFormData({ date: '', user_id: '', parts: [{ part_id: '', quantity: '' }] });
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Error submitting order. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="order-form-container">
      <h3>Order Form</h3>

      <div className="order-form-group">
        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
          className="order-input"
        />
      </div>

      <div className="order-form-group">
        <label>User ID:</label>
        <input
          type="text"
          name="user_id"
          value={formData.user_id}
          onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
          required
          className="order-input"
        />
      </div>

      <div className="order-form-group">
        <label>Parts:</label>
        {formData.parts.map((part, index) => (
          <div key={index} className="order-part-group">
            <input
              type="text"
              name="part_id"
              value={part.part_id}
              placeholder="Enter part ID"
              onChange={(e) => handleChange(e, index)}
              required
              className="order-input"
            />
            <input
              type="number"
              name="quantity"
              value={part.quantity}
              placeholder="Quantity"
              min="1"
              onChange={(e) => handleChange(e, index)}
              required
              className="order-input"
            />
            <button
              type="button"
              onClick={() => handleRemovePart(index)}
              className="remove-btn"
            >
              Remove
            </button>
            {suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((suggestion, i) => (
                  <li
                    key={i}
                    onClick={() => handleSuggestionClick(suggestion, index)}
                  >
                    {suggestion.part_id} - {suggestion.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <button type="button" onClick={handleAddPart} className="add-btn">
          Add Another Part
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="order-form-buttons">
        <button type="submit" className="submit-btn">
          Submit Order
        </button>
      </div>
    </form>
  );
};

export default OrderForm;
