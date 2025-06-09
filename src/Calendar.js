import { loadAllWorkouts, saveWorkout } from './firebaseHelpers';
import React, { Component } from 'react';
import CalendarDays from './CalendarDays';
import Graph from './Graph';
import './calendar.css'

export default class Calendar extends Component {
    constructor() {
        super();
        this.months = ['January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'];

        this.state = {
            currentPage: "calendar",
            currentDay: new Date(),
            showPopup: false,
            selectedDay: null,
            workoutsByDay: {}
        }
    }
    // Constructor includes all possible weekdays and months which we go through, and state
    // Holds our currentDay object that we update

    changeCurrentDay = (day) => {
        this.setState({ currentDay: new Date(day.year, day.month, day.number)})
    }
    // Changes currentDay and represented by red number

    previousMonth = () => {
        this.setState({ currentDay: new Date(this.state.currentDay.getFullYear(), this.state.currentDay.getMonth() - 1, 1)})
    }
    // setState to first day of previous month to move through months

    nextMonth = () => {
        this.setState({ currentDay: new Date(this.state.currentDay.getFullYear(), this.state.currentDay.getMonth() + 1, 1)})
    }
    // setState to first day of next month to move through months


    // POPUP WINDOW
    openPopupForDay = (day) => {
        this.setState({
            selectedDay: day,
            showPopup: true
        })
    }
    // Clicking a day will open it and show the popup to add a workout

    closePopup = () => {
        this.setState({
            showPopup: false,
            selectedDay: null
        })
    }
    // Closes the opened popup for corresponding day

    getDateKey = (day) => {
        const mm = String(day.month + 1).padStart(2, '0');
        const dd = String(day.number).padStart(2, '0');
        return `${day.year}-${mm}-${dd}`;
      };
    // Parse data to store into a table

    handleAddRow = (day) => {
        const key = this.getDateKey(day);
        const existingEntry = this.state.workoutsByDay[key] || {};
        const existingData = existingEntry.tableData || [];
      
        const newRow = { workout: "", sets: "", reps: "", weight: "" };
      
        this.setState((prevState) => ({
          workoutsByDay: {
            ...prevState.workoutsByDay,
            [key]: {
              ...existingEntry,
              tableData: [...existingData, newRow],
            },
          },
        }));
      };
    // Adds row and maintains preexisting data
    
    handleDeleteRow = (day) => {
        const key = this.getDateKey(day);
        const existingEntry = this.state.workoutsByDay[key];
      
        if (!existingEntry || !existingEntry.tableData) return;
      
        const newData = [
          ...existingEntry.tableData.slice(0, -1),
        ];
      
        this.setState((prevState) => ({
          workoutsByDay: {
            ...prevState.workoutsByDay,
            [key]: {
              ...existingEntry,
              tableData: newData,
            },
          },
        }));
        
      };
    // Deletes last row by slicing everything but last index, then updates state with newData

    handleRowChange = (day, rowIndex, field, value) => {
        const key = this.getDateKey(day);
        const existingEntry = this.state.workoutsByDay[key] || {};
        const existingData = existingEntry.tableData || [];
      
        const newData = existingData.map((row, index) => {
          if (index === rowIndex) {
            return { ...row, [field]: value };
          }
          return row;
        });
      
        this.setState((prevState) => ({
          workoutsByDay: {
            ...prevState.workoutsByDay,
            [key]: {
              ...existingEntry,
              tableData: newData,
            },
          },
        }));
      };
    // When data is changed in a certain row this is updated in each day's table

    handleWorkoutTypeChange = (day, value) => {
        const key = this.getDateKey(day);
        this.setState((prevState) => ({
          workoutsByDay: {
            ...prevState.workoutsByDay,
            [key]: {
              ...prevState.workoutsByDay[key],
              workoutType: value,
              weight: prevState.workoutsByDay[key]?.weight || "",
              tableData: prevState.workoutsByDay[key]?.tableData || [],
            },
          },
        }));
    };
    // Accesses specific key to update tableData to the newly selected workoutType

    handleWeightChange = (day, value) => {
        const key = this.getDateKey(day);
        this.setState((prevState) => ({
          workoutsByDay: {
            ...prevState.workoutsByDay,
            [key]: {
              ...prevState.workoutsByDay[key],
              weight: value,
              tableData: prevState.workoutsByDay[key]?.tableData || [],
              workoutType: prevState.workoutsByDay[key]?.workoutType || ""
            },
          },
        }));
      };
    // POPUP WINDOW


    // KEYBOARD FUNCTIONALITY
    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyPress);

        const storedData = localStorage.getItem('workoutsByDay');
        if (storedData) {
          this.setState({ workoutsByDay: JSON.parse(storedData) });
        }
        // Local storage

        this.loadWorkoutsFromFirebase();
        // Firebase storage
    }

    async loadWorkoutsFromFirebase() {
      try {
        const workouts = await loadAllWorkouts();
        this.setState({ workoutsByDay: workouts || {} });
      } catch (error) {
        console.error("Failed to load workouts from Firebase:", error);
      }
    }
    // Load workouts from Firebase
      
    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyPress);
    }
      
    handleKeyPress = (event) => {
        if (event.key === "ArrowLeft") {
          this.previousMonth();
        } else if (event.key === "ArrowRight") {
          this.nextMonth();
        }
    };
    // Added functionality to use arrow keys to navigate through months
    // KEYBOARD FUNCTIONALITY

    // LOCAL STORAGE SAVE
    componentDidUpdate(prevProps, prevState) {
    const prevWorkouts = prevState.workoutsByDay || {};
    for (const [dateKey, workoutData] of Object.entries(this.state.workoutsByDay)) {
      if (
        !prevWorkouts[dateKey] ||
        JSON.stringify(prevWorkouts[dateKey]) !== JSON.stringify(workoutData)
      ) {
        saveWorkout(dateKey, workoutData);
      }
    }
}
    // If component is updated make these changes and save them to workoutsByDay and turn it to string
    // LOCAL STORAGE SAVE

    render() {
        return (
        <div className="calendar">
            <div className="navigation-buttons">
                <button onClick={() => this.setState({ currentPage: 'calendar' })}>Calendar</button>
                <button onClick={() => this.setState({ currentPage: 'graph' })}>Graph</button>
            </div>
            <h1 className = "calendar-title"> Exercise Logger </h1>
            <div className="body">
            {this.state.currentPage === 'calendar' && (
            <CalendarDays day={this.state.currentDay} changeCurrentDay={this.changeCurrentDay} openPopup={this.openPopupForDay} workoutsByDay={this.state.workoutsByDay}
            getDateKey={this.getDateKey} nextMonth={this.nextMonth} previousMonth={this.previousMonth} months={this.months}/>
            )}
            {this.state.currentPage === 'graph' && (
            <Graph
                workoutsByDay={this.state.workoutsByDay}
            />
            )}
        </div>
            {
            this.state.showPopup && (
                <div className="popup-overlay" onClick={this.closePopup}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={this.closePopup}>X</button>
                            <h3>
                               {this.months[this.state.selectedDay.month]} {this.state.selectedDay.number}, {this.state.selectedDay.year}
                            </h3>

                                <select
                                    value={(this.state.workoutsByDay[this.getDateKey(this.state.selectedDay)]?.workoutType) || ""}
                                    onChange={(e) => this.handleWorkoutTypeChange(this.state.selectedDay, e.target.value)}
                                >
                                    <option value="">Select Workout Type</option>
                                    <option value="Push">Push</option>
                                    <option value="Pull">Pull</option>
                                    <option value="Legs">Legs</option>
                                    <option value="Other">Other</option>
                                </select>

                                <label className = "weight-textbox">
                                        <input
                                            type="text"
                                            placeholder = "Enter Weight Here"
                                            value={
                                            this.state.workoutsByDay[this.getDateKey(this.state.selectedDay)]?.weight || ""
                                            }
                                            onChange={(e) =>
                                            this.handleWeightChange(this.state.selectedDay, e.target.value)
                                            }
                                        />
                                </label>

                            <table className="popup-table">
                                <thead>
                                    <tr>
                                    <th>Workout</th>
                                    <th>Sets</th>
                                    <th>Reps</th>
                                    <th>Weight</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {(this.state.workoutsByDay[this.getDateKey(this.state.selectedDay)]?.tableData || []).map((row, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input 
                                                type="text"
                                                value={row.workout}
                                                onChange={(e) =>
                                                    this.handleRowChange(this.state.selectedDay, index, 'workout', e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input 
                                                type="text"
                                                value={row.sets}
                                                onChange={(e) =>
                                                    this.handleRowChange(this.state.selectedDay, index, 'sets', e.target.value)
                                            }/>
                                        </td>
                                        <td>
                                            <input 
                                                type="text"
                                                value={row.reps}
                                                onChange={(e) =>
                                                    this.handleRowChange(this.state.selectedDay, index, 'reps', e.target.value)
                                            }/>
                                        </td>
                                        <td>
                                            <input 
                                                type="text"
                                                value={row.weight}
                                                onChange={(e) =>
                                                    this.handleRowChange(this.state.selectedDay, index, 'weight', e.target.value)
                                            }/>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                                {/* tbody renders information for each day, handles row changes by accessing date keys to obtain data for each day */}
                            </table>
                            <button onClick={() => this.handleAddRow(this.state.selectedDay)}>Add Row</button>
                            <button onClick={() => this.handleDeleteRow(this.state.selectedDay)}>Delete Row</button>
                             {/* Add and delete rows in popup */}
                    </div>
                </div>
            )
            }
        </div>
        )
  }
  // Organizes html render
  // Popup to add workouts, weight, and workout type, then save the information to local storage for offline use and firebase for storage
  // Select Calendar or Graph page and gets stored in body
  // div names for CSS styling
}