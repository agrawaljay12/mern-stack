import dotenv from "dotenv";

dotenv.config();
import connection from '../config/connection.js';
import { migrateLikeIndexes } from '../config/migrate_like.js';
import app from "./index.js"
const PORT = process.env.PORT||8000;

// connnection to mongodb
connection().then(async () => {
    await migrateLikeIndexes();
}).catch((error) => {
    console.error("MongoDB connection failed:", error);
});

app.listen (PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})