import express from "express";
import authRoutes from "./routes/auth.js";
import groupRoutes from "./routes/groups.js";
import subjectRoutes from "./routes/subjects.js";
import tableRoutes from "./routes/table.js";
import studentsTableRoutes from "./routes/studentsTable.js";
import employeeRoutes from "./routes/employees.js";
import cookieParser from "cookie-parser";


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/table", tableRoutes);
app.use("/api/students-table", studentsTableRoutes)
app.use("/api/employees", employeeRoutes);


app.listen(8800, () => {
    console.log("Connected!");
});