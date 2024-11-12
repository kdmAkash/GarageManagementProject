import React, { useEffect, useState } from "react";

const ShowPartInfo = () => {
  const [partsInfo, setPartsInfo] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/inventory/getparts');
      if (response.ok) {
        const data = await response.json();
        setPartsInfo(data);
      } else {
        const errorData = await response.json();
        alert(errorData);
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="show-user-container">
      <h2>Parts Info</h2>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Part-Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Supplier-Name</th>
            <th>Price</th>
            <th>Date</th>
            <th>Delete</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {partsInfo.map((part) => {
            return (
              <tr key={part.part_id}>
                <td>{part.part_id}</td>
                <td>{part.part_name}</td>
                <td>{part.category}</td>
                <td>{part.quantity}</td>
                <td>{part.supplier_name}</td>
                <td>{part.price}</td>
                <td>{part.created_at}</td>
                <td><button className="cancel-btn" >Update</button></td>
                <td><button className="cancel-btn" >Delete</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ShowPartInfo;
