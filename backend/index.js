// Import the necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors middleware
const bcrypt = require('bcryptjs');
const router = express.Router();

// Initialize Express app
const app = express();
// Enable CORS middleware
app.use(cors());
app.get("/",(req,res)=>
{
  res.json("Hello");
})
//Define a schema and model for your users collection
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    entries: { type: Number, default: 0 }, // Add the entries field with default value 0
  });
  

// Connect to MongoDB Atlas using the connection string
const connectionString = 'mongodb+srv://tusharbhatia599:123654@smartbrainloginsignup.1ofdbsd.mongodb.net/test';
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

//Use bodyParser middleware to parse JSON requests
app.use(bodyParser.json());


const User = mongoose.model('User', userSchema);

// // Handle register endpoint
// // Handle register endpoint
// app.post('/register', (req, res) => {
//     // Extract data from request body
//     const { name, email, password } = req.body;

//     // Hash the password
//     bcrypt.genSalt(10, (err, salt) => {
//         bcrypt.hash(password, salt, (err, hash) => {
//             if (err) {
//                 console.error('Error hashing password:', err);
//                 return res.status(500).json({ error: 'Error hashing password' });
//             }

//             // Create a new user document with hashed password
//             const newUser = new User({
//                 name: name,
//                 email: email,
//                 password: hash, // Store hashed password
//             });

//             // Save the user to the database
//             newUser.save()
//                 .then((user) => {
//                     // Respond with the newly created user object
//                     res.status(200).json(user);
//                 })
//                 .catch((error) => {
//                     // Handle errors
//                     console.error('Error registering user:', error);
//                     res.status(500).json({ error: 'Error registering user' });
//                 });
//         });
//     });
// });

// //endpoint for signin
// Handle signin endpoint
app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    
    // Find user by email
    User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        // If user is not found, send an error response
        console.log("user not found");
        return res.status(400).json({ success: false, error: 'User not found' });
      }
  
      // Compare the provided password with the hashed password stored in the database
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          // If password matches, send user data with success flag as response
          res.json({ success: true, user: user });
        } else {
          // If password does not match, send an error response
          res.status(400).json({ success: false, error: 'Invalid credentials' });
          console.log("invalid credentials");
        }
      });
    })
    .catch((error) => {
      // Handle errors
      console.error('Error signing in:', error);
      res.status(500).json({ success: false, error: 'Error signing in' });
    });
  });
  
app.put('/image', (req, res) => {
    const { name } = req.body;
    console.log("User's name:", name); // Log the user's name
    // Find user by name and update entries field
    User.findOneAndUpdate({ name: name }, { $inc: { entries: 1 } }, { new: true })
    .then(user => {
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ error: 'User not found' });
        }
        const entryCount = parseInt(user.entries); // Convert to number if necessary
        if (isNaN(entryCount)) {
            console.error('Invalid entry count:', user.entries);
            return res.status(500).json({ error: 'Invalid entry count' });
        }
        res.json(entryCount); // Return updated entry count as a number
    })
        .catch(err => {
            console.error('Error updating user entries:', err);
            res.status(500).json({ error: 'Error updating user entries' });
        });
});
// // Endpoint to fetch leaderboard
app.get('/leaderboard', async (req, res) => {
  try {
    // Fetch users from the database and sort them by entries in descending order
    const leaderboard = await User.find({}, 'name entries').sort({ entries: -1 });
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
