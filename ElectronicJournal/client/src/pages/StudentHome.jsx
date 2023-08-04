import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState } from 'react'
import { useContext } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {AuthContext} from "../context/authContext.js";
import Table from '../components/Table';
import StudentsTable from '../components/StudentsTable.jsx';

const StudentHome = () => {

    const [monthes, setMonthes] = useState([
        {number: 9, month: "Сентябрь"}, {number: 10, month: "Октябрь"},
        {number: 11, month: "Ноябрь"}, {number: 12, month: "Декабрь"},
        {number: 1, month: "Январь"}, {number: 2, month: "Февраль"},
        {number: 3, month: "Март"}, {number: 4, month: "Апрель"},
        {number: 5, month: "Май"}, {number: 6, month: "Июнь"},
    ]);

    const gradesInfo = ["Оценки за месяц", "Оценки за семестр", "Результаты сессии", "Контрольные недели", "Курсовые/практики"];
    const [selectedGradeInfo, setSelectedGradeInfo] = useState({gradeInfo: "Оценки за месяц"});
    const [selectedMonth, setSelectedMonth] = useState({number: 9, month: "Сентябрь"});

    const [subjects, setSubjects] = useState([]);
    const [dates, setDates] = useState([]);
    const [grades, setGrades] = useState([]);
    const [curator, setCurator] = useState(null);

    const {currentUser, logout} = useContext(AuthContext);
    const role = useLocation().search ?? null;
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser === null) {
            logout();
            navigate("/login");
        }
        else if (role === null || currentUser?.selected_role !== role) {
            navigate(`/student?role=0`);
        }
    }, [currentUser]);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await axios.post("/students-table/subjects", {group: currentUser.group_id});

                setSubjects(res.data);
                fetchDates(currentUser.group_id, selectedMonth.number);
                fetchGrades(currentUser.group_id, selectedMonth.number);
            } catch (err) {
                console.log(err);
                if (Cookies.get("access_token") === undefined) logout();
            }
        }
        fetchSubjects();
    }, [selectedMonth]);
    
    useEffect(() => {
        const fetchCurator = async () => {
            try {
                const res = await axios.post("/table/curator", {id_group: currentUser.group_id});
                setCurator(res.data[0]);
            } catch (err) {
                console.log(err);
            }
        }
        fetchCurator();
    }, []);

    const fetchDates = async (group, month) => {
        try {
            const res = await axios.post("/students-table/dates", {group: group, month: month});
            setDates(res.data.sort((date1, date2) => new Date(date1.date) - new Date(date2.date)));
        } catch (err) {
            console.log(err);
        }
    }

    const fetchGrades = async (group, month) => {
        try {
            const res = await axios.post("/students-table/grades", {group: group, month: month});
            setGrades(res.data.sort((grade1, grade2) => grade1.subject_id - grade2.subject_id && grade1.dates_of_classes_id - grade2.dates_of_classes_id));
        } catch (err) {
            console.log(err);
        }
    }

    const chooseGradeInfo = (e) => {
        e.preventDefault();
        setSelectedGradeInfo((prev) => ({...prev, gradeInfo: e.target.textContent}))
    }

    const handleChooseMonth = (month) => {
        setSelectedMonth(month);
    }

    return (
        <div className='home-container'>
            <div className='content'>
                <div className='menu_bar'>                
                    <div className='menu_bar-item'>
                        <button className='menu_bar-button'>Информация об успеваемости</button>
                        <div className={'menu_bar-list show'}>
                            {gradesInfo.map((gradeInfo, index) => (
                                <button key={index} onClick={(chooseGradeInfo)} className={gradeInfo === selectedGradeInfo.gradeInfo ? 'menu_bar-list-button selected' : 'menu_bar-list-button'}>{gradeInfo}</button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='content-table'>
                    <div className='table-employees'>
                        <div>
                            <span>Студент:</span>
                            <span>{`${currentUser?.last_name} ${currentUser?.first_name} ${currentUser?.patronymic}`}</span>
                        </div>
                        <div>
                            <span>Куратор:</span>
                            <span>{curator !== null && `${curator?.last_name} ${curator?.first_name} ${curator?.patronymic}`}</span>
                        </div>
                    </div>
                    {subjects.length !== 0 && 
                    <StudentsTable monthes={monthes} subjects={subjects} dates={dates} grades={grades} selectedMonthCallback={handleChooseMonth} />}
                </div>
            </div>
        </div>
    )
}

export default StudentHome;