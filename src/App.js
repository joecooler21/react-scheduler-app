import 'react-calendar/dist/Calendar.css'
import './App.css'
import Calendar from 'react-calendar'
import Schedule from './components/Schedule.js'
import { useState, useEffect } from 'react'
import moment from 'moment'
import ShiftEmployeeManagement from './components/ShiftEmployeeManagement'

function App() {
  const [value, onChange] = useState(new Date())
  const [currentDay, setCurrentDay] = useState('')
  const [currentSchedule, setCurrentSchedule] = useState([])
  const [updatedSchedule, setUpdatedSchedule] = useState([])
  const [updatedEmployees, setUpdatedEmployees] = useState([])
  const [updatedShifts, setUpdatedShifts] = useState([])

  useEffect(() => {
    setCurrentSchedule(updatedSchedule)
  }, [updatedSchedule, setUpdatedSchedule])

  const onClickDay = async (value, event) => {
    const date = moment(value).format('L').replaceAll('/', '')


    setCurrentDay(date)
    const response = await fetch(`http://localhost:4000/schedule/${date}`, { method: 'GET' })
    const data = await response.json()
    setCurrentSchedule(data)
  }


  return (
    <div>
      <div className='container'>
        <ShiftEmployeeManagement setUpdatedEmployees={setUpdatedEmployees} setUpdatedShifts={setUpdatedShifts} />
        <div>
          <Calendar value={value} onChange={onChange} onClickDay={onClickDay} />
        </div>
        <Schedule updatedEmployees={updatedEmployees} updatedShifts={updatedShifts} schedule={currentSchedule} setUpdatedSchedule={setUpdatedSchedule} value={value} />
      </div>
    </div>
  );
}

export default App;
