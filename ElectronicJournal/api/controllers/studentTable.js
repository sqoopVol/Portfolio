import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getSubjects = (req, res) => {
    const query = "SELECT s.id_subject, s.subject FROM subjects s JOIN group_subjects gr ON gr.subject_id = s.id_subject WHERE gr.group_id = ?";
    const token = req.cookies.access_token;

    if (!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        db.query(query, [req.body.group], (err, data) => {
            if (err) return res.json(err);
            if (data.length === 0) return res.status(404).json("Subjects not found!");
            return res.json(data);
        });
    });
}

export const getDates = (req, res) => {
    const query = "SELECT dof.id_dates_of_classes, dof.date FROM dates_of_classes dof WHERE dof.group_id = ? AND MONTH(dof.date) = ?";
    const token = req.cookies.access_token;

    if (!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        db.query(query, [req.body.group, req.body.month], (err, data) => {
            if (err) return res.json(err);
            return res.json(data);
        });
    });
}

export const getGrades = (req, res) => {
    const query = "SELECT g.id_grade, g.grade, g.dates_of_classes_id, g.subject_id FROM grades g JOIN group_subjects gs ON gs.subject_id = g.subject_id JOIN dates_of_classes dof ON dof.id_dates_of_classes = g.dates_of_classes_id WHERE gs.group_id = ? AND MONTH(dof.date) = ? AND g.student_id = ?";
    const token = req.cookies.access_token;

    if (!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        db.query(query, [req.body.group, req.body.month, userInfo.id], (err, data) => {
            if (err) return res.json(err);
            return res.json(data);
        });
    });
}