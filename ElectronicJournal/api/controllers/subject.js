import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getSubjects = (req, res) => {

    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const query = (req.query.role == "1")
        ? `SELECT s.id_subject, s.subject FROM subjects s JOIN group_subjects gs ON gs.subject_id = s.id_subject AND gs.teacher_id = ${userInfo.id} WHERE gs.group_id = ?`
        : `SELECT s.id_subject, s.subject FROM subjects s JOIN group_subjects gs ON gs.subject_id = s.id_subject WHERE gs.group_id = ?`;

        db.execute(query, [req.body.id_group], (err, data) => {
            if (err) return res.json(err);
            if (data.length === 0) return res.status(404).json("Subjects not found!");
    
            return res.json(data);
        })
    })
}