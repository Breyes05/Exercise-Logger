import React, {} from 'react';

function CalendarDays(props) {
    let firstDayOfMonth = new Date(props.day.getFullYear(), props.day.getMonth(), 1);
    let weekdayOfFirstDay = firstDayOfMonth.getDay();
    let currentDays = [];
    let weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

    for (let day = 0; day < 42; day++) {
        if (day === 0 && weekdayOfFirstDay === 0) {
          firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 7);
        } else if (day === 0) {
          firstDayOfMonth.setDate(firstDayOfMonth.getDate() + (day - weekdayOfFirstDay));
        } else {
          firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);
        }
    
        let calendarDay = {
          currentMonth: (firstDayOfMonth.getMonth() === props.day.getMonth()),
          date: (new Date(firstDayOfMonth)),
          month: firstDayOfMonth.getMonth(),
          number: firstDayOfMonth.getDate(),
          selected: (firstDayOfMonth.toDateString() === props.day.toDateString()),
          year: firstDayOfMonth.getFullYear()
        }
    
        currentDays.push(calendarDay);
    }
    // Generates calendar, 6 weeks because most calendars contain other months within them.
    // Calendar always starts on a Sunday, so for months that do not start on a Sunday the 
    // calendar starts on previous months.

    return (
      <div className="calendar-body">
        <div className="calendar-header">
          <button className="prev-month-btn" onClick={props.previousMonth}>
            &larr;
          </button>
          <button className="next-month-btn" onClick={props.nextMonth}>
            &rarr;
          </button>
          <h2 className="month-year">
            {props.months[props.day.getMonth()]} {props.day.getFullYear()}
          </h2> 
        </div>
        <div className="table-container">
          <div className="table-header">
            {weekdays.map((day, index) => (
            <div className="weekday" key={index}>
            <p>{day}</p>
            </div>
            ))}
          </div>
          <div className="table-content">
          {
            currentDays.map((day) => {
              const dateKey = props.getDateKey(day);
              const workoutType = props.workoutsByDay?.[dateKey]?.workoutType || "";
              const workoutClass = workoutType ? ` ${workoutType.toLowerCase()}-day` : "";
              return (
                <div
                  className={
                    "calendar-day" +
                    (day.currentMonth ? " current" : "") +
                    (day.selected ? " selected" : "") +
                    workoutClass
                }
                onClick={() => {
                  props.changeCurrentDay(day);
                  props.openPopup(day);
                }}>
                  <p>{day.number}</p>
                </div>
                );
            })
          }
          </div>
          </div>
        </div>
    )
  }
  export default CalendarDays;