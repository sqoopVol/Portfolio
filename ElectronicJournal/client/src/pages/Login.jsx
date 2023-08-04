import React, { useState } from 'react';
import "../style.css";
import logo from "../images/logo.svg";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import RolesWindow from '../components/RolesWindow';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [inputs, setInputs] = useState({
        login: "",
        password: "",
    });

    const [openModal, setOpenModal] = useState(false);
    const [err, setError] = useState(null);
    const { login, currentUser, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser === null && document.cookie === null)
            setOpenModal(false);
        if (currentUser && currentUser?.roles && currentUser?.roles.length > 1)
            setOpenModal(true);
        if (currentUser && currentUser?.roles === undefined)
            navigate("/student?role=0");
        if (currentUser && currentUser?.roles?.length === 1) {
            updateUser(currentUser?.roles[0].role_id);
            navigate(`/?role=${currentUser.roles[0].role_id}`);
        }
    }, [currentUser]);

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleOpenModal = async (e) => {
        e.preventDefault();
        try {
            await login(inputs);
        } catch (err) {
            setError(err.response.data);
        }
    }

    return (
        <div className='auth-container'>
            <header className="header">
                <img className="logo" src={logo} alt='' />
            </header>
            <div className="auth">
                <h1 className="auth-title">Авторизация</h1>
                <form className="form-group">
                    <div className="form-login">
                        <label className="form-name" htmlFor='input-log'>Логин:</label>
                        <input className="form-input" required type="text" name="login" id="input-log" onChange={handleChange} />
                    </div>
                    <div className="form-password">
                        <label className="form-name" htmlFor='input-pass'>Пароль:</label>
                        <input className="form-input" required type="password" name="password" id="input-pass" onChange={handleChange} />
                    </div>
                    {err && <p className="form-error">Неправильный логин или пароль!</p> || <p className="form-error"></p>}
                    <button onClick={handleOpenModal} className="auth_btn" id="open_popup">Войти</button>
                    <RolesWindow open={openModal} />
                </form>
            </div>
        </div>
    );
}

export default Login;