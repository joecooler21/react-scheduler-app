
import ScheduleEntry from './ScheduleEntry'
import { FaTimes, FaCheck, FaRegCalendarAlt, FaCalendarPlus, FaCalendarMinus, FaPrint } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import EmployeeList from './EmployeeList'
import ShiftList from './ShiftList'
import moment from 'moment'

var key = 0;

const Schedule = ({ weekRange, schedule, value, setUpdatedSchedule, updatedEmployees, updatedShifts, setShowPV, setWeeklySchedule }) => {

  const [showAdd, setShowAdd] = useState(false)
  const [employeeList, setEmployeeList] = useState([])
  const [employeeText, setEmployeeText] = useState('')
  const [shiftList, setShiftList] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [selectText, setSelectText] = useState('')
  const [selectedShift, setSelectedShift] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [hideContent, setHideContent] = useState(false)

  const getEmployees = async () => {
    const response = await fetch('http://localhost:4000/employees')
    const data = await response.json()
    setEmployeeList(data)
    setEmployeeText(`${data[0].firstName} ${data[0].lastName}`)
  }

  const getShifts = async () => {
    const response = await fetch('http://localhost:4000/shifts')
    const data = await response.json()
    setShiftList(data)
    setSelectText(`${data[0].startShift} - ${data[0].endShift}`)
  }

  useEffect(() => {
    getEmployees()
    getShifts()
    setEmployeeList(updatedEmployees)
  }, [updatedEmployees])

  useEffect(() => {
    setShiftList(updatedShifts)

  }, [updatedShifts])

  const addScheduleEntry = () => {
    setShowAdd(true)
    setHideContent(true)

  }
  // add shift to schedule
  const dialogOK = async () => {
    setShowAdd(false)
    setHideContent(false)

    const date = moment(value).format('L').replaceAll('/', '')

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: employeeText, shift: selectText, type: 'ADD_SHIFT', date: date })
    }

    const response = await fetch('http://localhost:4000/schedule', options)
    const data = await response.json()
    const updatedScheduleResponse = await fetch(`http://localhost:4000/schedule/${date}`)
    const updatedScheduleData = await updatedScheduleResponse.json()
    setUpdatedSchedule(updatedScheduleData)
  }

  const dialogCancel = () => {
    setShowAdd(false)
    setHideContent(false)
  }

  const deleteSchedule = () => {
    if (!schedule.length) return
    setConfirmDelete(true)
    setHideContent(true)

  }

  const deleteOK = async () => {
    setConfirmDelete(false)
    setHideContent(false)
    const date = moment(value).format('L').replaceAll('/', '')
    const response = await fetch(`http://localhost:4000/clearschedule/${date}`, { method: 'DELETE' })
    const data = await response.json()
    if (data.message === 'OK') setUpdatedSchedule([])
  }

  const deleteCancel = () => {
    setConfirmDelete(false)
    setHideContent(false)
  }
  // find days missing from schedule so we can append to printable view
  const findMissingDays = (days) => {
    if (weekRange.length == days.length) return []

    const dates = []
    const missing = []

    days.forEach(e => { dates.push(e.date) })

    weekRange.forEach(e => {
        if (!dates.includes(e)) missing.push(e)
    })

    return missing
}

  const formatDate = (date) => {

    let n_date = date.split('')
      n_date.splice(2, 0, '/')
      n_date.splice(5, 0, '/')

      n_date = moment(n_date.join('')).format('ddd')
      return n_date

  }

  const clickPrintableView = async () => {

    if (!weekRange.length) return
    
    const response = await fetch(`http://localhost:4000/week/${weekRange}`)
    const data = await response.json()

    const days = []

    data.forEach(e => {

      days.push({date:e.date, n_date:formatDate(e.date), shifts:e.shifts})
    })

    days.forEach(e => {
      if (!e.shifts.length)
      e.shifts.push({firstName:'NO SCHEDULE'})
    })

    const missing = findMissingDays(days)

    if (missing.length > 0) {
      missing.forEach(e => {
        days.push({date:e, n_date:formatDate(e), shifts:[{firstName:'NO SCHEDULE'}]})
      })
    }

    setWeeklySchedule(days)

    setShowPV(true)

  }

  return (
    <div>
      <div className='component-container'>
        <h3 className='caption' ><FaRegCalendarAlt /> <div>Schedule for <span style={{ fontWeight: 'bold' }}>{value.toDateString()}</span></div><div></div></h3>
        <div style={{ display: 'flex', justifyContent: 'left', marginBottom: '1em' }}>
          {hideContent ? <div></div> : <div>
            <button onClick={addScheduleEntry} style={{ marginRight: '.5em', marginLeft: '1em' }}><FaCalendarPlus style={{ color: 'green' }} /></button>
            <button onClick={deleteSchedule} style={{ marginRight: '27em' }}><FaCalendarMinus style={{ color: 'red' }} /></button>
            <button onClick={clickPrintableView}><FaPrint style={{ color: 'purple' }} /></button>

          </div>}

          {confirmDelete ? <div><label style={{ color: 'red' }}>Clear Schedule?</label><button onClick={deleteOK}><FaCheck style={{ color: 'green' }} /></button><button onClick={deleteCancel}><FaTimes style={{ color: 'red' }} /></button></div> : <div></div>}

          {showAdd ? <div style={{ width: '100%', textAlign: 'center' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Add Schedule Entry</p>
            <EmployeeList employeeList={employeeList} setEmployeeText={setEmployeeText} setSelectedEmployee={setSelectedEmployee} />
            <div></div>
            <ShiftList shiftList={shiftList} setSelectedShift={setSelectedShift} setSelectText={setSelectText} />
            <div></div>
            <button style={{ marginRight: '10px', marginTop: '5px' }} onClick={dialogOK}><FaCheck style={{ color: 'green' }} />OK</button>
            <button onClick={dialogCancel}><FaTimes style={{ color: 'red' }} />Cancel</button>
          </div> : <div></div>}

        </div>
        <table>
          <tbody>
            <tr>
              <th>Employee</th>
              <th>Shift</th>
            </tr>
            {schedule.length > 0 ? schedule.map((e, index) => {
              return (<ScheduleEntry index={index} key={key++} name={e.name} shift={e.shift} id={e.id} setUpdatedSchedule={setUpdatedSchedule} date={e.date} />)
            }) : <tr><td style={{ textAlign: 'center' }}>No Schedule Data Found</td><td></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Schedule
