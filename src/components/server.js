const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS for the React frontend (localhost:1234)
app.use(cors({
  origin: 'http://localhost:1234', // Allow React's dev server
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware to parse JSON bodies
app.use(express.json());

// MySQL connection setup
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "arkadam-123", // Change this to your actual password
  database: "mydb",
});

conn.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database");
});

// POST route to insert a new user
app.post('/emp', (req, res) => {
  console.log("Received data:", req.body);  // Check if the data is coming in

  const { name, address, email, number, date, vehicleNo } = req.body;

  if (!name || !address || !email || !number || !date || !vehicleNo) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = "INSERT INTO user (name, address, email, number, date, vehicle_no) VALUES (?, ?, ?, ?, STR_TO_DATE(?, '%Y-%m-%d'), ?)";
  conn.query(sql, [name, address, email, number, date, vehicleNo], (err, result) => {
    if (err) {
      console.error("Error during query execution:", err);
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      message: 'New user added successfully',
      userId: result.insertId,
    });
  });
});

app.put('/emp/:userId', (req, res) => {
  console.log("Received data for update:", req.body);
  
  const { name, address, number, date, vehicleNo } = req.body;
  const userId = req.params.userId; // Assuming you're using userId in the URL to identify the user

  // Validate that all required fields are present
  if (!name || !address || !number || !date || !vehicleNo) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = `
    UPDATE user 
    SET name = ?, address = ?, number = ?, date = STR_TO_DATE(?, '%Y-%m-%d'), vehicle_no = ?
    WHERE id = ?`;

  conn.query(sql, [name, address, number, date, vehicleNo, userId], (err, result) => {
    if (err) {
      console.error("Error during query execution:", err);
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({
        message: 'User updated successfully',
        userId: userId,
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });
});

app.delete('/emp/:emailOrId', (req, res) => {
  const emailOrId = req.params.emailOrId;
  
  const isNumeric = !isNaN(emailOrId);
  let sql;
  if (isNumeric) {
    sql = 'DELETE FROM user WHERE id = ?'; // Use id when the input is numeric
  } else {
    sql = 'DELETE FROM user WHERE email = ?'; // Use email when the input is not numeric
  }


  conn.query(sql, [emailOrId], (err, result) => {
    if (err) {
      console.error("Error during query execution:", err);
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: `User with ${emailOrId} deleted successfully.` });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });
});

app.get('/emp', (req, res) => {
  const sql = "SELECT * FROM user";
  conn.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.status(200).json(results);
  });
});

app.post('/inventory/adduser',(req,res)=>{
  const {part_name,category,quantity,supplier_name,price}=req.body;

  if(!part_name || !category || !quantity || !supplier_name  || !price)
  {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const sql="Insert Into inventory(part_name,category,quantity,supplier_name,price)  values(?,?,?,?,?)";

  conn.query(sql,[part_name,category,quantity,supplier_name,price],(err,response)=>{
    if(err)
    {
      console.error("Error during query execution:", err);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Part added successfully' });
  })
})

app.get('/inventory/getparts', (req, res) => {
  const sql = "SELECT * FROM inventory";
  conn.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.status(200).json(results);
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
