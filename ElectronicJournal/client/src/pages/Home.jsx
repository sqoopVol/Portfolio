import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState } from 'react'
import { useContext } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {AuthContext} from "../context/authContext.js";
import Table from '../components/Table';

const Home = () => {

    const [selected, setSelected] = useState([
        {id: 0, value: false},
        {id: 1, value: false},
        {id: 2, value: false},
    ]);

    const [monthes, setMonthes] = useState([
        {number: 9, month: "Сентябрь"}, {number: 10, month: "Октябрь"},
        {number: 11, month: "Ноябрь"}, {number: 12, month: "Декабрь"},
        {number: 1, month: "Январь"}, {number: 2, month: "Февраль"},
        {number: 3, month: "Март"}, {number: 4, month: "Апрель"},
        {number: 5, month: "Май"}, {number: 6, month: "Июнь"},
    ]);

    const [groups, setGroups] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const gradesInfo = ["Оценки за месяц", "Оценки за семестр", "Результаты сессии", "Контрольные недели", "Курсовые/практики"];
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedGradeInfo, setSelectedGradeInfo] = useState({gradeInfo: "Оценки за месяц"});
    const [selectedMonth, setSelectedMonth] = useState({number: 9, month: "Сентябрь"});

    const [students, setStudents] = useState([]);
    const [dates, setDates] = useState([]);
    const [grades, setGrades] = useState([]);
    const [teacher, setTeacher] = useState(null);
    const [curator, setCurator] = useState(null);

    const [isDisableEdit, setIsDisableEdit] = useState(true);
    const [isClickToSave, setIsClickToSave] = useState(false);
    const [isClickToBack, setIsClickToBack] = useState(false);
    const [isAddDate, setIsAddDate] = useState(false);
    const [isRemoveDate, setIsRemoveDate] = useState(false);

    const {currentUser, logout} = useContext(AuthContext);
    const role = useLocation().search ?? null;
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser === null) {
            logout();
            navigate("/login");
        }
        else if (role === null || currentUser?.selected_role !== role) {
            navigate(`/?role=${currentUser.selected_role}`);
            setIsClickToBack(true);
            setIsDisableEdit(true);
            setIsClickToSave(false);
            setIsAddDate(false);
            setIsRemoveDate(false);
        }
    }, [currentUser]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await axios.get(`/groups${role}`);
 
                setGroups([...new Map(res.data.map(item => [item["id_group"], item])).values()]); 

                setMonthes(prev => {
                    return prev.map(item => {
                        return item.number > 8 ?
                        {...item, year: new Date(res.data[0].study_start_date).getFullYear()} : 
                        {...item, year: new Date(res.data[0].study_end_date).getFullYear()};
                    });
                });

                setSelectedGroup(res.data[0]);
                fetchStudents(res.data[0]);

            } catch (err) {
                console.log(err);
                if (Cookies.get("access_token") === undefined) logout();
            }
        };

        fetchGroups();
    }, [role]);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await axios.post(`/subjects${role}`, selectedGroup);

                setSubjects(res.data);
                setSelectedSubject(res.data[0]);
                fetchDates(selectedGroup, res.data[0], selectedMonth);
                fetchGrades(selectedGroup, res.data[0], selectedMonth);
            } catch (err) {
                console.log(err);
                if (Cookies.get("access_token") === undefined) logout();
            }
        }

        if (selectedGroup !== null) fetchSubjects();

    }, [role, selectedGroup]);
    
    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const res = await axios.post("/table/teacher", {group_id: selectedGroup.id_group, subject_id: selectedSubject.id_subject});
                setTeacher(res.data[0]);
            } catch (err) {
                console.log(err);
            }
        }

        const fetchCurator = async () => {
            try {
                const res = await axios.post("/table/curator", selectedGroup);
                setCurator(res.data[0]);
            } catch (err) {
                console.log(err);
            }
        }

        if (selectedGroup !== null) fetchCurator();
        if (selectedGroup !== null && selectedSubject !== null) fetchTeacher();

    }, [selectedGroup, selectedSubject]);

    const fetchStudents = async (selectedGroup) => {
        try {
            const res = await axios.post("/table/students", selectedGroup);
            setStudents(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    const fetchDates = async (selectedGroup, selectedSubject, selectedMonth) => {
        try {
            const res = await axios.post("/table/dates", {group_id: selectedGroup.id_group, subject_id: selectedSubject.id_subject, month: selectedMonth.number});
            setDates(res.data.sort((date1, date2) => new Date(date1.date) - new Date(date2.date)));
        } catch (err) {
            console.log(err);
        }
    }

    const fetchGrades = async (selectedGroup, selectedSubject, selectedMonth) => {
        try {
            const res = await axios.post("/table/grades", {group_id: selectedGroup.id_group, subject_id: selectedSubject.id_subject, month: selectedMonth.number});
            setGrades(res.data.sort((grade1, grade2) => grade1.student_id - grade2.student_id && grade1.dates_of_classes_id - grade2.dates_of_classes_id));
        } catch (err) {
            console.log(err);
        }
    }

    const toggle = (i) => {
        setSelected((state) => {
            return state.map((item) => {
                return item.id === i ? {...item, value: !item.value} : item
        })});
    }

    const chooseGroup = (e) => {
        e.preventDefault();
        fetchStudents(groups.find(group => group.group === e.target.textContent));
        setSelectedGroup(groups.find(group => group.group === e.target.textContent));
        setIsClickToBack(true);
        setIsDisableEdit(true);
        setIsClickToSave(false);
        setIsAddDate(false);
        setIsRemoveDate(false);
    }

    const chooseSubject = (e) => {
        e.preventDefault();
        fetchDates(selectedGroup, subjects.find(subject => subject.subject === e.target.textContent), selectedMonth);
        fetchGrades(selectedGroup, subjects.find(subject => subject.subject === e.target.textContent), selectedMonth);
        setSelectedSubject(subjects.find(subject => subject.subject === e.target.textContent));
        setIsClickToBack(true);
        setIsDisableEdit(true);
        setIsClickToSave(false);
        setIsAddDate(false);
        setIsRemoveDate(false);
    }

    const chooseGradeInfo = (e) => {
        e.preventDefault();
        setSelectedGradeInfo((prev) => ({...prev, gradeInfo: e.target.textContent}))
    }

    const handleChooseMonth = (month) => {
        setSelectedMonth(month);
        fetchDates(selectedGroup, selectedSubject, month);
        fetchGrades(selectedGroup, selectedSubject, month);
    }

    const handleClickToEdit = () => {
        setIsClickToBack(false);
        setIsDisableEdit(false);
        setIsClickToSave(false);
        setIsAddDate(false);
        setIsRemoveDate(false);
    }

    const handleClickToBack = () => {
        setDates([]);
        setGrades([]);
        fetchDates(selectedGroup, selectedSubject, selectedMonth);
        fetchGrades(selectedGroup, selectedSubject, selectedMonth);  
        setIsClickToBack(true);
        setIsDisableEdit(true);
        setIsClickToSave(false);
        setIsAddDate(false);
        setIsRemoveDate(false);
    }

    const handleClickToSave = () => {
        setIsClickToSave(true);
    }

    const incorrectGradeCallback = (incorrect) => {
        if (incorrect && isClickToSave) {
            setIsClickToSave(false);
            setIsAddDate(false);
            setIsRemoveDate(false);
        }
        if (!incorrect && isClickToSave) {
            fetchDates(selectedGroup, selectedSubject, selectedMonth);
            fetchGrades(selectedGroup, selectedSubject, selectedMonth);  
            setIsDisableEdit(true);
            setIsAddDate(false);
            setIsRemoveDate(false);          
        }
    }

    const handleClickToAddDate = () => {
        setIsAddDate(true);
    }

    const addDateCallback = () => {
        setIsAddDate(false);
    }

    const handleClickToRemoveDate = () => {
        setIsRemoveDate(true);
    }

    const removeDateCallback = () => {
        setIsRemoveDate(false);
    }

    const newDateCallback = (date, query) => {
        if (query === "add") {
            setDates(prev => [...prev, {
                id_dates_of_classes: prev.length > 0 ? Math.max.apply(Math, prev.map(date => date.id_dates_of_classes)) + 1 : 1,
                date: date.date,
                query: query
            }]);
        }
        if (query === "update") {
            setDates(prev => {
                return prev.map(item => {
                    if (item.id_dates_of_classes === date.id_dates_of_classes) {
                        if (item.query === undefined)
                            return {...item, date: date.date, query: "update"};
                        else if (item.query === "add" || item.query === "update")
                            return {...item, date: date.date};
                        else return item;
                    }
                    else return item;
                })
            })
        }
        if (query === "delete") {
            setDates(prev => {
                return prev.map(item => {
                    if (item.id_dates_of_classes === date.id_dates_of_classes) {
                        if (item.query === undefined)
                            return {...item, query: "delete"};
                        else if (item.query === "add")
                            return {...item, query: "null"};
                        else if (item.query === "update")
                            return {...item, query: "delete"}
                        else return item;
                    }
                    else return item;
                })
            });
            setDates(prev => prev.filter(item => item?.query !== "null"));
        }
        if (query === "clear") {
            setDates(prev => {
                return prev.map(item => {
                    return item.id_dates_of_classes === date.id_dates_of_classes ? {...item, query: "clear"} : item;
                });
            });
        }
    }

    return (
        <div className='home-container'>
            <div className='content'>
                <div className='menu_bar'>
                    <div className='menu_bar-item'>
                        <button onClick={() => toggle(0)} className='menu_bar-button'>Группы</button>
                        <div className={selected[0].value ? 'menu_bar-list show' : 'menu_bar-list'}>
                            {groups.map((group, groupsIndex) => (
                                <button key={groupsIndex} onClick={(chooseGroup)} className={group.id_group === selectedGroup.id_group ? 'menu_bar-list-button selected' : 'menu_bar-list-button'}>{group.group}</button>
                            ))}
                        </div>
                    </div>
                    <div className='menu_bar-item'>
                        <button onClick={() => toggle(1)} className='menu_bar-button'>Дисциплины</button>
                        <div className={selected[1].value ? 'menu_bar-list show' : 'menu_bar-list'}>
                            {subjects.map((subject, subjectsIndex) => (
                                <button key={subjectsIndex} onClick={(chooseSubject)} className={subject.id_subject === selectedSubject.id_subject ? 'menu_bar-list-button selected' : 'menu_bar-list-button'}>{subject.subject}</button>
                            ))}
                        </div>
                    </div>
                    <div className='menu_bar-item'>
                        <button onClick={() => toggle(2)} className='menu_bar-button'>Информация об успеваемости</button>
                        <div className={selected[2].value ? 'menu_bar-list show' : 'menu_bar-list'}>
                            {gradesInfo.map((gradeInfo, index) => (
                                <button key={index} onClick={(chooseGradeInfo)} className={gradeInfo === selectedGradeInfo.gradeInfo ? 'menu_bar-list-button selected' : 'menu_bar-list-button'}>{gradeInfo}</button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='content-table'>
                    <div className='table-employees'>
                        <div>
                            <span>Куратор:</span>
                            <span>{curator !== null && `${curator?.last_name} ${curator?.first_name} ${curator?.patronymic}`}</span>
                        </div>
                        <div>
                            <span>Преподаватель:</span>
                            <span>{teacher !== null && `${teacher?.last_name} ${teacher?.first_name} ${teacher?.patronymic}`}</span>
                        </div>
                    </div>
                    {selectedGroup !== null && selectedSubject !== null &&
                    <Table students={students} monthes={monthes} dates={dates} grades={grades}
                    group={selectedGroup.id_group} subject={selectedSubject.id_subject} disableEdit={isDisableEdit}
                    isSave={isClickToSave} selectedMonthCallback={handleChooseMonth}
                    incorrectGradeCallback={incorrectGradeCallback} addDateCallback={addDateCallback} 
                    isBack={isClickToBack} isAddDate={isAddDate} isRemoveDate={isRemoveDate}
                    removeDateCallback={removeDateCallback} newDateCallback={newDateCallback}/>}
                    <div className={new URLSearchParams(role).get("role") === "1" ? 'table-edit_buttons show' : 'table-edit_buttons'}>
                        {!isDisableEdit && <button onClick={handleClickToBack}>Назад</button>}
                        {!isDisableEdit && <button onClick={handleClickToRemoveDate}>Удалить столбец</button>}
                        {!isDisableEdit && <button onClick={handleClickToAddDate}>Добавить столбец</button>}
                        {isDisableEdit && <button onClick={handleClickToEdit}>Редактировать</button>}
                        {!isDisableEdit && <button onClick={handleClickToSave}>Сохранить</button>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;