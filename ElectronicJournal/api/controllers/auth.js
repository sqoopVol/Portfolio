import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const login = (req, res) => {

    const query = "SELECT * FROM users WHERE login = ?";

    db.execute(query, [req.body.login], (err, data) => {

        if (err) return res.json(err);
        if (data.length === 0) return res.status(404).json("User not found!");
        if (!(req.body.password === data[0].password)) return res.status(400).json("Wrong login or password!");

        const id = data[0].id_user;

        const query = "SELECT * FROM students WHERE user_id = ?";

        db.execute(query, [id], (err, data) => {

            if (err) return res.json(err);
            if (data.length === 0) {

                const query = "SELECT e.id_employee, e.last_name, e.first_name, e.patronymic, e.user_id, r.id_role, r.role FROM employees e JOIN roles_of_employees roe JOIN roles r ON e.id_employee = roe.employee_id AND r.id_role = roe.role_id WHERE e.user_id = ?";

                db.execute(query, [id], (err, data) => {

                    if (err) return res.json(err);
                    if (data.length === 0) return res.status(404).json("User not found!");
                    data[0].roles = data.map((item) => {
                        const container = {};

                        container.role_id = item.id_role;
                        container.role = item.role;

                        return container;
                    });

                    delete data[0].id_role;
                    delete data[0].role;

                    data[0].selected_role = "";

                    const token = jwt.sign({
                        id: data[0].id_employee,
                    }, "jwtkey");
                    const { password, ...other } = data[0];

                    return res.cookie("access_token", token, {
                        httpOnly: true
                    }).status(200).json(other)
                });
            }

            else {

                const token = jwt.sign({
                    id: data[0].id_student,
                }, "jwtkey");
                const { password, ...other } = data[0];

                return res.cookie("access_token", token, {
                    httpOnly: true
                }).status(200).json(other)
            }
        });
    });
}

export const logout = (req, res) => {
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true
    }).status(200).json("User has been logged out!");
}