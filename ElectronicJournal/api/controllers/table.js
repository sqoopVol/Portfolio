import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getStudents = (req, res) => {
    const query = "SELECT s.id_student, s.last_name, s.first_name, s.patronymic FROM electronic_journal.students s WHERE s.group_id = ?";

    db.execute(query, [req.body.id_group], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(404).json("Students not found!");
        return res.json(data);
    })
}

export const getDates = (req, res) => {
    const query = "SELECT id_dates_of_classes, date FROM dates_of_classes WHERE group_id = ? AND subject_id = ? AND MONTH(date) = ?";

    db.query(query, [req.body.group_id, req.body.subject_id, req.body.month], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
}

export const getGrades = (req, res) => {
    
    const query = "SELECT g.id_grade, g.grade, g.dates_of_classes_id, g.subject_id, g.student_id FROM grades g JOIN students stud ON stud.id_student = g.student_id JOIN dates_of_classes dof ON dof.id_dates_of_classes = g.dates_of_classes_id WHERE g.subject_id = ? AND stud.group_id = ? AND MONTH(dof.date) = ?";

    db.query(query, [req.body.subject_id, req.body.group_id, req.body.month], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
}

export const getTeacher = (req, res) => {

    const query = "SELECT e.last_name, e.first_name, e.patronymic FROM employees e JOIN group_subjects gs ON gs.teacher_id = e.id_employee WHERE gs.group_id = ? AND gs.subject_id = ?";

    db.execute(query, [req.body.group_id, req.body.subject_id], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(404).json("Teacher not found!");
        return res.json(data);
    })
}

export const getCurator = (req, res) => {

    const query = "SELECT e.last_name, e.first_name, e.patronymic FROM employees e JOIN electronic_journal.groups g ON e.id_employee = g.curator_id WHERE g.id_group = ?";

    db.execute(query, [req.body.id_group], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(404).json("Teacher not found!");
        return res.json(data);
    })
}

export const addDates = (req, res) => {

    const query = "INSERT INTO `electronic_journal`.`dates_of_classes` (`date`, `group_id`, `subject_id`) VALUES (?)";

    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        
        let values = [
            `${new Date(req.body.date).getFullYear().toString()}-${(1 + parseInt(new Date(req.body.date).getMonth())).toString()}-${new Date(req.body.date).getDate().toString()}`,
            req.body.group,
            req.body.subject
        ]

        db.query(query, [values], (err) => {
            if (err) return res.json(err);
            return res.json("Date inserted!");
        });
    });
}

export const updateDates = (req, res) => {

    const query = "UPDATE `electronic_journal`.`dates_of_classes` SET date = ? WHERE id_dates_of_classes = ?";

    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        let date = `${new Date(req.body.date).getFullYear().toString()}-${(1 + parseInt(new Date(req.body.date).getMonth())).toString()}-${new Date(req.body.date).getDate().toString()}`;

        db.query(query, [date, req.body.id], (err) => {
            if (err) return res.json(err);
            return res.json("Date updated!");
        });
    });
}

export const deleteDates = (req, res) => {
    const gradeQuery = "DELETE FROM electronic_journal.grades WHERE dates_of_classes_id = ?";
    const dateQuery = "DELETE FROM electronic_journal.dates_of_classes WHERE id_dates_of_classes = ?";

    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        db.query(gradeQuery, [req.body.id_dates_of_classes], (err) => {
            if (err) return res.json(err);
            db.query(dateQuery, [req.body.id_dates_of_classes], (err) => {
                if (err) return res.json(err);
                return res.json("Date deleted!");
            });
        });
    });
}

export const addGrades = (req, res) => {

    const dateQuery = "SELECT id_dates_of_classes FROM dates_of_classes WHERE date = ? AND group_id = ? AND subject_id = ?"

    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        
        let date = `${new Date(req.body.grade.date).getFullYear().toString()}-${(1 + parseInt(new Date(req.body.grade.date).getMonth())).toString()}-${new Date(req.body.grade.date).getDate().toString()}`;
        
        db.query(dateQuery, [date, req.body.group, req.body.subject], (err, data) => {
            if (err) return res.json(err);
            if (data.length !== 0) {

                const gradeQuery = "INSERT INTO `electronic_journal`.`grades` (`grade`, `dates_of_classes_id`, `subject_id`, `student_id`, `teacher_id`) VALUES (?)";

                let values = [
                    req.body.grade.grade,
                    data[0].id_dates_of_classes,
                    req.body.subject,
                    req.body.grade.student_id,
                    userInfo.id
                ];
    
                db.query(gradeQuery, [values], (err) => {
                    if (err) return res.json(err);
                    return res.json("Grade inserted!");
                });
            }
        });
    });
}

export const updateGrades = (req, res) => {

    const query = "UPDATE `electronic_journal`.`grades` SET grade = ? WHERE id_grade = ?";

    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        db.query(query, [req.body.grade.grade, req.body.grade.id_grade], (err) => {
            if (err) return res.json(err);
            return res.json("Grade updated!");
        });
    });
}

export const deleteGrades = (req, res) => {
    const query = "DELETE FROM electronic_journal.grades WHERE id_grade = ?";

    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        db.query(query, [req.body.id_grade], (err) => {
            if (err) return res.json(err);
            return res.json("Grade deleted!");
        });
    });
}