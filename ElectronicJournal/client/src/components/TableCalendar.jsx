import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import "../style.css"

const TableCalendar = ({date, selectDateCallback, closeCalendarCallback}) => {

    const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

    const [calendarDates, setCalendarDates] = useState([]);

    useEffect(() => {
        setCalendarDates([]);
        const firstDayOfWeek = new Date(new Date(date.date).getFullYear(), new Date(date.date).getMonth(), 0).getDay();
        for (let i = 0; i < (firstDayOfWeek === 0 ? 7 : firstDayOfWeek); i++) {
            setCalendarDates(prev => [...prev, ""]);
        }
        for (let i = 0; i < new Date(new Date(date.date).getFullYear(), new Date(date.date).getMonth() + 1, 0).getDate(); i++) {
            if (new Date(new Date(date.date).getFullYear(), new Date(date.date).getMonth(), i + 1).getDay() !== 0)
                setCalendarDates(prev => [...prev, new Date(new Date(date.date).getFullYear(), new Date(date.date).getMonth(), i + 1)]);
        }
    }, [date]);

    const handleClose = () => {
        closeCalendarCallback(true);
    }

    const handleSelectDate = (selectedDate) => {
        selectDateCallback({id_dates_of_classes: date.id_dates_of_classes, date: new Date(selectedDate).toISOString()});
        closeCalendarCallback(true);
    }

  return (
    <div className='calendar'>
        <div className='calendar-container'>
            <div className='calendar-info'>
                <span>Выберите дату:</span>
                <span className='calendar-close' onClick={handleClose}>x</span>
            </div>
            <div className='calendar-content'>
            {daysOfWeek.map((day, daysIndex) => (
                <div className='calendar-day_of_week' key={daysIndex}><span>{day}</span></div>
            ))}
            {calendarDates.length !== 0 && calendarDates.map((date, datesIndex) => (
                <div className={date !== "" ? 'calendar-date' : ""} onClick={() => {handleSelectDate(date)}} key={datesIndex}><span>{date !== "" ? new Date(date).getDate() : ""}</span></div>
            ))}
            </div>
        </div>
    </div>
  )
}

export default TableCalendar;