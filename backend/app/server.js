import dotenv from "dotenv";

dotenv.config();
import connection from '../config/connection.js';
import app from "./index.js"
const PORT = process.env.PORT||8000;

// connnection to mongodb
connection();

app.listen (PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})