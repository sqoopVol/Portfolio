import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user") || null));

    const login = async (inputs) => {
        const res = await axios.post("/auth/login", inputs);
        setCurrentUser(res.data);
    };

    const logout = async () => {
        await axios.post("/auth/logout");
        setCurrentUser(null);
    }

    const updateUser = (selectedRole) => {

        const data = {
            id_employee: currentUser.id_employee,
            last_name: currentUser.last_name,
            first_name: currentUser.first_name,
            patronymic: currentUser.patronymic,
            user_id: currentUser.user_id,
            roles: currentUser.roles,
            selected_role: selectedRole,
        }

        setCurrentUser(data);
    }

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    return <AuthContext.Provider value={{ currentUser, login, logout, updateUser }}>
        {children}
    </AuthContext.Provider>;
}

