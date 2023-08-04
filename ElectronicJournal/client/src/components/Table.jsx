import React, { useEffect } from 'react'
import { useState } from 'react';
import '../style.css';
import slideLeft from '../images/slideLeft.svg'
import slideRight from '../images/slideRight.svg'
import TableCell from './TableCell';
import axios from 'axios';
import TableDate from './TableDate';
import TableCalendar from './TableCalendar';

const Table = ({students, monthes, dates, grades, group, subject, disableEdit, isBack, isSave, isAddDate, isRemoveDate, selectedMonthCallback, incorrectGradeCallback, newDateCallback, addDateCallback, removeDateCallback}) => {

    const [monthesIndex, setMonthesIndex] = useState(0);
    const [editableDate, setEditableDate] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [newGrades, setNewGrades] = useState([]);

    useEffect(() => {
        setNewGrades([]);
    }, [subject])

    const handlePrevMonth  = () => {
        setEditableDate(null);
        selectedMonthCallback(monthes[monthesIndex - 1]);
        setMonthesIndex((prev) => prev -= 1);
    }

    const handleNextMonth = () => {
        setEditableDate(null);
        selectedMonthCallback(monthes[monthesIndex + 1]);
        setMonthesIndex((prev) => prev += 1);
    }

    const handleSetGrades = (grade, date) => {
        if (newGrades.filter(item => item.dates_of_classes_id === grade.dates_of_classes_id && item.student_id === grade.student_id).length > 0)
            setNewGrades(prev => {
                return prev.map(item => {
                    return item.dates_of_classes_id === grade.dates_of_classes_id && item.student_id === grade.student_id ? {...item, grade: grade.grade} : item;
                })
            });
        else setNewGrades(prev => [...prev, {...grade, date: date}]);
    }

    useEffect(() => {
        if (isSave) {
            const isCorrect = newGrades.filter(grade => grade.grade === "" || grade.grade === "2" ||
            grade.grade === "3" || grade.grade === "4" || grade.grade === "5" ||
            grade.grade === "н/б" || grade.grade === "о").length === newGrades.length;

            if (isCorrect) {
                dates.filter(date => date.query !== undefined).map(date => {
                    if (date.query === "add") {
                        addDates(date, group, subject);
                        newDateCallback(date, "clear");
                    }
                    if (date.query === "update") {
                        updateDates(date);
                        newDateCallback(date, "clear");
                    }
                    if (date.query === "delete") {
                        deleteDates(date);
                        newDateCallback(date, "clear");
                    }
                })

                console.log(newGrades);

                newGrades.map(grade => {
                    if (grade.id_grade === undefined && grade.grade !== "")
                        addGrades(grade, group, subject);
                    if (grade.id_grade !== undefined && grade.grade !== "")
                        updateGrades(grade);
                    if (grade.id_grade !== undefined && grade.grade === "")
                        deleteGrades(grade);
                });
                setNewGrades([]);
                incorrectGradeCallback(false);
            }
            else {
                alert("Некорректное заполнение полей с оценками!");
                incorrectGradeCallback(true);
            }
        }
    }, [isSave]);

    useEffect(() => {
        if (isBack) {
            setNewGrades([]);
            setSelectedDate(null);
            setEditableDate(null);
            setOpenCalendar(false);
        }
    }, [isBack]);

    useEffect(() => {
        if (isAddDate) {
            setSelectedDate(null);
            setEditableDate({
                id_dates_of_classes: null,
                date: new Date(monthes[monthesIndex].year, monthes[monthesIndex].number, 0).toISOString()
            });
            setOpenCalendar(true);
        }
    }, [isAddDate]);

    useEffect(() => {
        if (isRemoveDate && selectedDate !== null) {
            if (window.confirm("Вы уверены, что хотите удалить выбранный столбец?")) {
                newDateCallback(selectedDate, "delete");
                setSelectedDate(null);
                removeDateCallback();
            }
            else {
                setSelectedDate(null);
                removeDateCallback();
            }
        }
        else {
            removeDateCallback();
        }
    }, [isRemoveDate]);

    const addDates = async (date, group, subject) => {
        try {
            await axios.post("/table/add-dates", {date: date.date, group: group, subject: subject});
        } catch (err) {
            console.log(err);
        } 
    }

    const updateDates = async (date) => {
        try {
            await axios.put("/table/update-dates", {date: date.date, id: date.id_dates_of_classes});
        } catch (err) {
            console.log(err);
        }
    }

    const deleteDates = async (date) => {
        try {
            await axios.delete("/table/delete-dates", {data: date});
        } catch (err) {
            console.log(err);
        }
    }

    const addGrades = async (grade, group, subject) => {
        try {
            await axios.post("/table/add-grades", {grade: grade, group: group, subject: subject});
        } catch (err) {
            console.log(err);
        }      
    }

    const updateGrades = async (grade) => {
        try {
            await axios.put("/table/update-grades", {grade: grade});
        } catch (err) {
            console.log(err);
        }
    }

    const deleteGrades = async (grade) => {
        try {
            await axios.delete("/table/delete-grades", {data: grade});
        } catch (err) {
            console.log(err);
        }
    }

    const handleSelectDate = (date) => {
        if (!disableEdit) {
            setSelectedDate(date);
        }
    }

    const dateCallback = (date) => {
        if (!disableEdit) {
            if (date === selectedDate) 
                setOpenCalendar(true)
            setEditableDate(date);
        }
    }

    const closeCalendarCallback = (close) => {
        if (close) {
            setOpenCalendar(false);
            setEditableDate(null);
            setSelectedDate(null);
            addDateCallback();
        }
    }

    const calendarCallback = (date) => {
        if (date.id_dates_of_classes === null) {
            newDateCallback(date, "add");
        }
        else {
            newDateCallback(date, "update")
        }
    }

    return (
        <div className='table-container'>
            <table className='table'>
                <thead>
                    <tr>
                        <th rowSpan={2}>№<br />п/п</th>
                        <th rowSpan={2}>ФИО студента</th>
                        <th colSpan={dates.length !== 0 ? dates.filter(date => date?.query !== "delete").length : 1}>
                            <div className='table-month'>
                                {disableEdit && 
                                <img className={monthesIndex > 0 ? 'table-month-slide show' : 'table-month-slide'} onClick={handlePrevMonth} src={slideLeft} />}
                                <span>{monthes[monthesIndex].month}</span>
                                {disableEdit && 
                                <img className={monthesIndex < monthes.length - 1 ? 'table-month-slide show' : 'table-month-slide'} onClick={handleNextMonth} src={slideRight} />}
                            </div>
                        </th>
                        <th rowSpan={2}>Ср.<br />балл</th>
                        <th rowSpan={2}>Кол-во<br />пропусков</th>
                    </tr>
                    <tr className='table-dates'>
                        {dates.length !== 0 ? dates.filter(date => date?.query !== "delete").sort((date1, date2) => new Date(date1.date) - new Date(date2.date)).map((date, index) => (
                            <th key={index} onClick={() => {handleSelectDate(date)}}><TableDate date={date} dateCallback={dateCallback} /></th>
                        )) : <th></th>}
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, studentIndex) => (
                        <tr key={studentIndex} className='table-row'>
                            <td>{studentIndex + 1}</td>
                            <td><div className='table-student_info'><p>{`${student.last_name} ${student.first_name} ${student.patronymic}`}</p></div></td>
                            {dates.length !== 0 ? dates.filter(date => date?.query !== "delete").sort((date1, date2) => new Date(date1.date) - new Date(date2.date)).map((date) => (
                                grades.find(grade => grade.student_id === student.id_student && grade.dates_of_classes_id === date.id_dates_of_classes) !== undefined 
                                ? <td className={selectedDate === date ? "table_cell-active" : ""} key={date.id_dates_of_classes}>
                                    <TableCell grade={grades.find(grade => grade.student_id === student.id_student && grade.dates_of_classes_id === date.id_dates_of_classes)}
                                    date={date.date} disableEdit={disableEdit} isSave={isSave} Callback={handleSetGrades} />
                                    </td>
                                : <td className={selectedDate === date ? "table_cell-active" : ""} key={date.id_dates_of_classes}>
                                    <TableCell grade={{grade: "", dates_of_classes_id: date.id_dates_of_classes, student_id: student.id_student}} 
                                    date={date.date} disableEdit={disableEdit} isSave={isSave} Callback={handleSetGrades} />
                                    </td>
                            )) : <td></td>}
                            <td>{grades.filter(grade => grade.student_id === student.id_student && grade.grade !== "н/б" && grade.grade !== "о").length !== 0 
                            ? (grades.filter(grade => grade.student_id === student.id_student && grade.grade !== "н/б" && grade.grade !== "о")
                            .reduce((sum, current) => sum + parseInt(current.grade), 0) / 
                            grades.filter(grade => grade.student_id === student.id_student && grade.grade !== "н/б" && grade.grade !== "о").length).toFixed(2) 
                            : "——"}</td>
                            <td>{grades.filter((grade) => grade.student_id === student.id_student && grade.grade === "н/б").length * 2 + 
                            grades.filter((grade) => grade.student_id === student.id_student && grade.grade === "о").length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {openCalendar && 
            <TableCalendar date={editableDate} selectDateCallback={calendarCallback} closeCalendarCallback={closeCalendarCallback} />}
        </div>
    );
}

export default Table;