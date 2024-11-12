import React, { useEffect, useState } from 'react';

const ShowUser = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch]=useState();
  const [searchData,setSearchData]=useState('');
  // Fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/emp');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
          setSearch(data);
          console.log(data);
        } else {
          const errorData = await response.json();
          setError(`Error fetching users: ${errorData.error}`);
        }
      } catch (err) {
        setError(`Error: ${err.message}`);
      }
    };

    fetchUsers();
  }, []); // Empty dependency array means this effect runs once when the component mounts

   function handleSearch(e)
   {
     e.preventDefault();
      const filterData=users.filter((user)=>{
        return user.name.toLowerCase().includes(searchData.toLowerCase());
      });
      setSearch(filterData);
      setSearchData('');
   }

   function handleChange(e)
   {
     setSearchData(e.target.value);
    console.log(searchData);
   }
  return (
    <div className="show-user-container">
      <button className='save-btn' onClick={handleSearch}>serach</button>
      <input type="text" className='search-box' onChange={handleChange} placeholder='Enter user Name' value={searchData}/>
      <h2>All Users</h2>
      {error && <p className="error">{error}</p>}

      {/* User table */}
      {users.length > 0 ? (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Number</th>
              <th>Date</th>
              <th>Vehicle No</th>
            </tr>
          </thead>
          <tbody>
            {search.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>{user.number}</td>
                <td>{user.date}</td>
                <td>{user.vehicle_no}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
};

export default ShowUser;
