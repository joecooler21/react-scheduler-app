import 'react-calendar/dist/Calendar.css'
import './App.css'
import Calendar from 'react-calendar'
import Schedule from './components/Schedule.js'
import { useState, useEffect } from 'react'
import moment from 'moment'
import ShiftEmployeeManagement from './components/ShiftEmployeeManagement'
import PrintableView from './components/PrintableView.js'

function App() {
  const [value, onChange] = useState(new Date())
  const [currentDay, setCurrentDay] = useState('')
  const [currentSchedule, setCurrentSchedule] = useState([])
  const [updatedSchedule, setUpdatedSchedule] = useState([])
  const [updatedEmployees, setUpdatedEmployees] = useState([])
  const [updatedShifts, setUpdatedShifts] = useState([])
  const [weekRange, setWeekRange] = useState([])
  const [showDialog, setShowDialog] = useState(false)
  const [showPV, setShowPV] = useState(false)
  const [weeklySchedule, setWeeklySchedule] = useState([])

  // erase all db data and fill current month with randomized schedule data
  const loadDummyData = async () => {
    let allDays = []
    let month = moment().month() + 1
    if (month <= 9) {
      month = '0' + month
    }
    let days = moment().daysInMonth()
    let year = moment().year()

    for (let i = 1; i <= days; i++) {
      let currDay = ''
      if (i <= 9) {
        currDay = '0' + i
        allDays.push(`${month}${currDay}${year}`)
        continue
      }
      allDays.push(`${month}${i}${year}`)
    }

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({dates:allDays})
    }

    try {
      const response = await fetch(`http://localhost:4000/fill`, options)
      const data = response.json()
    } catch {
      console.log('error')
    }
    
  }

  useEffect(() => {
    setCurrentSchedule(updatedSchedule)
    loadDummyData()
  }, [updatedSchedule, setUpdatedSchedule])

  const onClickDay = async (value, event) => {
    const date = moment(value).format('L').replaceAll('/', '')

    setCurrentDay(date)
    const response = await fetch(`http://localhost:4000/schedule/${date}`, { method: 'GET' })
    const data = await response.json()
    setCurrentSchedule(data)

    // get all dates for current week
    const weekStart = moment(value).startOf('week');
    const days = [];
    for (let i = 0; i <= 6; i++) {
      days.push(moment(weekStart).add(i, 'days').format('L').replaceAll('/', ''));
    }

    setWeekRange(days)


  }


  return (
    <div>
      <div style={{visibility:showPV ? 'hidden' : 'visible'}} className='container'>
      <div>
          <Calendar value={value} onChange={onChange} onClickDay={onClickDay} />
        </div>
        <ShiftEmployeeManagement setUpdatedEmployees={setUpdatedEmployees} setUpdatedShifts={setUpdatedShifts} />
        <Schedule setWeeklySchedule={setWeeklySchedule} weekRange={weekRange} setShowPV={setShowPV} updatedEmployees={updatedEmployees} updatedShifts={updatedShifts} schedule={currentSchedule} setUpdatedSchedule={setUpdatedSchedule} value={value} />
      </div>
      <div>
        <PrintableView show={showPV} setShowPV={setShowPV} day={currentDay} range={weekRange} weeklySchedule={weeklySchedule} />
      </div>
    </div>
  );
}

export default App;
