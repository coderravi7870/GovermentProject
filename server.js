import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/monogDB.js';
import adminRouter from './routes/adminRoutes.js';
import cors from 'cors';
import threadRouter from './routes/ThreadRoutes.js';
import superAdminRouter from './routes/superAdminRoutes.js';
import blockRouter from './routes/blockRoutes.js';
import blockHeadRouter from './routes/blockHeadRoutes.js';
import departmentRouter from './routes/departmentRoutes.js';
import departmentHeadRouter from './routes/departmentHeadRoutes.js';
import districtRouter from './routes/districtRoutes.js';
import districtHeadRouter from './routes/districtHeadRoutes.js';
import coOperatorRoutes from './routes/coOperatorRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { fileURLToPath } from "url";
import path from "path";
import adminLoginRouter from './routes/adminLoginRoutes.js';
import adminThreadRouter from './routes/adminThreadsRoutes.js';
import adminMessageRouter from './routes/adminMessageRoutes.js';
import districtHeadLoginRouter from './routes/districtLoginRoutes.js';
import districtThreadRouter from './routes/districtThreadsRoutes.js';
import districtMessageRouter from './routes/districtMessageRoutes.js';
// import AdminthreadsWithUnreadCountRouter from './routes/AdminthreadsWithUnreadCountRoutes.js';

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
app.use("/api/admin", adminRouter);
app.use("/api/threads", threadRouter);

//super admin routes
app.use("/api/super-admin", superAdminRouter);

//admin login routes
app.use("/api/admin", adminLoginRouter);
app.use("/api/admin/threads", adminThreadRouter);
app.use("/api/admin/messages", adminMessageRouter);

//district routes
app.use("/api/district-admin", districtHeadLoginRouter);
app.use("/api/district-admin/threads", districtThreadRouter);
app.use("/api/district-admin/messages", districtMessageRouter);

// Block routes
app.use("/api/blocks", blockRouter)
app.use("/api/blocks-head", blockHeadRouter)
app.use("/api/departments", departmentRouter)
app.use("/api/departments-head", departmentHeadRouter)
app.use("/api/districts", districtRouter)
app.use("/api/district-head", districtHeadRouter)
app.use("/api/co-operators", coOperatorRoutes)


app.use("/api/messages", messageRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



// Start server after DB connection
const startServer = async () => {
    try {
        await connectDB(); // Connect to MongoDB
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("DB Connection Failed:", err);
    }
};

startServer();

export default app;
