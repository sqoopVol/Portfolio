import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getGroups = (req, res) => {
    let query = "";
    switch (req.query.role) {
        case '1': 
            query = "SELECT g.id_group, g.group, g.study_start_date, g.study_end_date FROM electronic_journal.groups g JOIN group_subjects gs ON g.id_group = gs.group_id WHERE gs.teacher_id = ?";
            break;
        case '2':
            query = "SELECT g.id_group, g.group, g.study_start_date, g.study_end_date FROM electronic_journal.groups g WHERE g.curator_id = ?";
            break;
        case '3':
            query = "SELECT g.id_group, g.group, g.study_start_date, g.study_end_date FROM electronic_journal.groups g JOIN department_professions dp ON dp.profession_id = g.profession_id JOIN departments_heads dh ON dp.department_id = dh.department_id WHERE dh.employee_id = ?";
            break;
    }

    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        db.execute(query, [userInfo.id], (err, data) => {
            if (err) return res.json(err);
            if (data.length === 0) return res.status(404).json("Groups not found!");
            
            return res.json(data);
        })
    })
}