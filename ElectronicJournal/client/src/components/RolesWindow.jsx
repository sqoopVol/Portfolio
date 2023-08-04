import React from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { AuthContext } from '../context/authContext';
import "../style.css";

const RolesWindow = ({ open }) => {

    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [roleIsSelected, setRoleIsSelected] = useState(true);
    const { currentUser, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (open && currentUser?.roles) {
            setRoles(currentUser.roles);
        }
    }, [open, currentUser])

    const handleChoose = (e) => {
        e.preventDefault();
        setSelectedRole(roles.find(role => role.role === e.target.textContent).role_id);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedRole) {
            updateUser(selectedRole);
            navigate(`/?role=${selectedRole}`);
        }
        else
            setRoleIsSelected(false);
    }



    if (!open) return null;

    return (
        <div className="popup">
            <div className="popup-container">
                <div className="popup-body">
                    <div className="popup-title">Под какой ролью выполнить вход?</div>
                    <div className='popup-button-container'>
                        {roles.map((role) => (
                            <button type='button' onClick={handleChoose} className='button-popup' key={role.role_id}>{role.role}</button>
                        ))}
                    </div>
                    {!roleIsSelected && <p className="popup-error">Выберите роль!</p> || <p className="popup-error"></p>}
                    <button onClick={handleSubmit} className="button-popup-input">Вход</button>
                </div>
            </div>
        </div>
    )
}

export default RolesWindow;