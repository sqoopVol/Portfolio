import React from 'react'
import { useState } from 'react';
import '../style.css';
import slideLeft from '../images/slideLeft.svg'
import slideRight from '../images/slideRight.svg'

const StudentsTable = ({monthes, subjects, dates, grades, selectedMonthCallback}) => {

    const [monthesIndex, setMonthesIndex] = useState(0);

    const handlePrevMonth  = () => {
        selectedMonthCallback(monthes[monthesIndex - 1]);
        setMonthesIndex((prev) => prev -= 1);
    }

    const handleNextMonth = () => {
        selectedMonthCallback(monthes[monthesIndex + 1]);
        setMonthesIndex((prev) => prev += 1);
    }

    return (
        <div className='table-container'>
            <table className='table'>
                <thead>
                    <tr>
                        <th rowSpan={2}>№<br />п/п</th>
                        <th rowSpan={2}>Дисциплина</th>
                        <th colSpan={dates.length !== 0 ? dates.length : 1}>
                            <div className='table-month'>
                                <img className={monthesIndex > 0 ? 'table-month-slide show' : 'table-month-slide'} onClick={handlePrevMonth} src={slideLeft} />
                                <span>{monthes[monthesIndex].month}</span>
                                <img className={monthesIndex < monthes.length - 1 ? 'table-month-slide show' : 'table-month-slide'} onClick={handleNextMonth} src={slideRight} />
                            </div>
                        </th>
                        <th rowSpan={2}>Ср.<br />балл</th>
                        <th rowSpan={2}>Кол-во<br />пропусков</th>
                    </tr>
                    <tr className='table-dates'>
                        {dates.length !== 0 ? dates.sort((date1, date2) => new Date(date1.date) - new Date(date2.date)).map((date, index) => (
                            <th key={index}>{new Date(date.date).getDate()}</th>
                        )) : <th></th>}
                    </tr>
                </thead>
                <tbody>
                    {subjects.map((subject, subjectIndex) => (
                        <tr key={subjectIndex} className='table-row'>
                            <td>{subjectIndex + 1}</td>
                            <td><div className='table-subject_info'><p>{subject.subject}</p></div></td>
                            {dates.length !== 0 ? dates.sort((date1, date2) => new Date(date1.date) - new Date(date2.date)).map((date) => (
                                grades.find(grade => grade.subject_id === subject.id_subject && grade.dates_of_classes_id === date.id_dates_of_classes) !== undefined 
                                ? <td key={date.id_dates_of_classes}>
                                    {grades.find(grade => grade.subject_id === subject.id_subject && grade.dates_of_classes_id === date.id_dates_of_classes).grade}
                                    </td>
                                : <td key={date.id_dates_of_classes}></td>
                            )) : <td></td>}
                            <td>{grades.filter(grade => grade.subject_id === subject.id_subject && grade.grade !== "н/б" && grade.grade !== "о").length !== 0 
                            ? (grades.filter(grade => grade.subject_id === subject.id_subject && grade.grade !== "н/б" && grade.grade !== "о")
                            .reduce((sum, current) => sum + parseInt(current.grade), 0) / 
                            grades.filter(grade => grade.subject_id === subject.id_subject && grade.grade !== "н/б" && grade.grade !== "о").length).toFixed(2) 
                            : "——"}</td>
                            <td>{grades.filter((grade) => grade.subject_id === subject.id_subject && grade.grade === "н/б").length * 2 + 
                            grades.filter((grade) => grade.subject_id === subject.id_subject && grade.grade === "о").length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StudentsTable;