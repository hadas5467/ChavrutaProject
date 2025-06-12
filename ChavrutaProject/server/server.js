import users from "./routes/userRoutes.js";
import calls from "./routes/callRoutes.js"
import chavrutas from "./routes/chavrutaRoutes.js";
import joinRequests from "./routes/joinRequestRoutes.js";
import express from 'express';
import cors from 'cors';


const app = express();

// Middlewares
app.use(cors());

app.use(express.json());

// Routes
app.use("/api/users", users);
app.use('/api/calls', calls);
app.use("/api/chavrutas", chavrutas);
app.use("/api/joinRequests", joinRequests);


app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
