import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import cron from 'node-cron';
import dotenv from 'dotenv';
import twilio from 'twilio';

const port=3000;
//dotenv.config({ path: 'D:/Garage Project/src/components/.env' });


const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Update your MySQL username
  password: 'arkadam-123', // Update your MySQL password
  database: 'mydb', // Update with your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Twilio Client
//const client = twilio(
  //process.env.TWILIO_ACCOUNT_SID,
  //process.env.TWILIO_AUTH_TOKEN
//);
const app = express(); // ✅ Define `app` before using it


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
  const {part_name,category,quantity,supplier_name,price,date}=req.body;

  if(!part_name || !category || !quantity || !supplier_name  || !price|| !date)
  {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const sql="Insert Into inventory(part_name,category,quantity,supplier_name,price,created_at)  values(?,?,?,?,?,?)";

  conn.query(sql,[part_name,category,quantity,supplier_name,price,date],(err,response)=>{
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

// Express route to handle the update of parts
app.put('/inventory/updateparts/:id', (req, res) => {
  const { part_id, part_name, category, quantity, supplier_name, price, date } = req.body;
  const { id } = req.params;

  // Check if all required fields are present
  if (!part_id || !part_name || !category || !quantity || !supplier_name || !price || !date) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // SQL query for updating the part based on part_id
  const sql = `
    UPDATE inventory 
    SET part_name = ?, category = ?, quantity = ?, supplier_name = ?, price = ?, created_at = STR_TO_DATE(?, '%Y-%m-%d')
    WHERE part_id = ?
  `;

  conn.query(sql, [part_name, category, quantity, supplier_name, price, date, id], (err, result) => {
    if (err) {
      console.error("Error during query execution:", err);
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Part updated successfully', partId: id });
    } else {
      res.status(404).json({ error: 'Part not found' });
    }
  });
});

// start of order

app.post('/orders', async (req, res) => {
  let conn;
  try {
    conn = await pool.promise().getConnection();

    const { user_id, date, parts } = req.body;
    if (!user_id || !date || !parts || parts.length === 0) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    await conn.beginTransaction();

    let totalAmount = 0;
    for (const part of parts) {
      const [partInfo] = await conn.query("SELECT price, quantity FROM inventory WHERE part_id = ?", [part.part_id]);
      if (partInfo.length === 0) throw new Error(`Part ID ${part.part_id} not found`);
      if (partInfo[0].quantity < part.quantity) throw new Error(`Insufficient stock for Part ID ${part.part_id}`);

      totalAmount += partInfo[0].price * part.quantity;
    }

    // ✅ Insert into orders table
    const [orderResult] = await conn.query(
      "INSERT INTO orders (user_id, date, total_amount) VALUES (?, ?, ?)",
      [user_id, date, totalAmount]
    );

    if (!orderResult.insertId) {
      throw new Error('Failed to create order');
    }
    
    const orderId = orderResult.insertId; // ✅ Make sure orderId is defined

    for (const part of parts) {
      const [partInfo] = await conn.query("SELECT price FROM inventory WHERE part_id = ?", [part.part_id]);

      await conn.query(
        "INSERT INTO order_details (order_id, user_id, part_id, quantity, price) VALUES (?, ?, ?, ?, ?)",
        [orderId, user_id, part.part_id, part.quantity, partInfo[0].price]
      );

      await conn.query(
        "UPDATE inventory SET quantity = quantity - ? WHERE part_id = ?",
        [part.quantity, part.part_id]
      );
    }

    await conn.commit();
    res.status(201).json({ message: 'Order placed successfully', orderId });

  } catch (error) {
    if (conn) await conn.rollback();
    console.error('Order Processing Error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (conn) conn.release();
  }
});


// end of order
// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Function to send messages
const sendMessages = () => {
  const query = `SELECT * FROM user WHERE DATEDIFF(CURRENT_DATE, date) >= 90`;
  console.log(`Send message called`);
  conn.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return;
    }

    results.forEach((user) => {
      const formattedPhoneNumber = user.number.startsWith("+")
        ? user.number
        : `+91${user.number}`;

      client.messages
        .create({
          from: "whatsapp:+14155238886", // Twilio WhatsApp Sandbox Number
          body: `Hi ${user.name}, it's been 90 days since your last update!`,
          to: `whatsapp:${formattedPhoneNumber}`,
        })
        .then((message) => console.log(`Message SID: ${message.sid}`))
        .catch((err) => console.error(err));
    });
  });
};

// Trigger message sending immediately
//sendMessages();

// Optional: Run cron job every day at midnight
//cron.schedule("*/1 * * * *", sendMessages);

// To keep the script running and continuously check cron jobs
process.on("SIGINT", () => {
  conn.end(() => {
    console.log("Closing MySQL connection");
    process.exit();
  });
});