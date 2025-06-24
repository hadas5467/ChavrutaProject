import users from "./routes/userRoutes.js";
import calls from "./routes/callRoutes.js"
import chavrutas from "./routes/chavrutaRoutes.js";
import joinRequests from "./routes/joinRequestRoutes.js";
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';


const app = express();

// Middlewares
const corsOptions = {
   origin: [
    'http://localhost:5173',
    'http://localhost:5175',
    'http://localhost:5176'
  ], 
  credentials: true,               // מאפשר שליחת cookies
};
app.use(cors(corsOptions));
app.use(express.json());

app.use(cookieParser());


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
