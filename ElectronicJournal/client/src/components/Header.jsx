import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import logo from "../images/logo.svg";
import dropdownArrow from "../images/dropdownArrow.svg";
import logoutIcon from "../images/logout.svg";
import "../style.css";
import { Link } from 'react-router-dom';

const Navbar = () => {

    const { currentUser, updateUser, logout } = useContext(AuthContext);

    return (
        <header className='header'>
            <div className='header-container'>
                <div className='header-logo'>
                    <img src={logo} alt='' />
                </div>
                <ul>
                    <li><Link className='header-link'>Темы занятий</Link></li>
                    {currentUser?.roles && <li>
                        <span className='header-link'>Отчёт<img src={dropdownArrow} /></span>
                        <div className='header-dropdown'>
                            <ul>
                                <li><Link className='header-link'>Отчёт 1</Link></li>
                                <li><Link className='header-link'>Отчёт 2</Link></li>
                                <li><Link className='header-link'>Отчёт 3</Link></li>
                                <li><Link className='header-link'>Отчёт 4</Link></li>
                            </ul>
                        </div>
                    </li>}
                    {currentUser?.roles?.length > 1 && <li>
                        <span className='header-link'>Роль<img src={dropdownArrow} /></span>
                        <div className='header-dropdown'>
                            <ul>
                                {currentUser?.roles?.length > 1 && currentUser.roles.map((item) => (
                                    <li key={item.role_id}><Link className='header-link' onClick={() => updateUser(item.role_id)} to={`/?role=${item.role_id}`}>{item.role}</Link></li>
                                ))}
                            </ul>
                        </div>
                    </li>}
                    <li><span onClick={logout} className='header-link'>Выйти<img src={logoutIcon} /></span></li>
                </ul>
            </div>
        </header>
    )
}

export default Navbar;