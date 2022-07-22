
import ScheduleEntry from './ScheduleEntry'
import { FaTimes, FaCheck, FaRegCalendarAlt, FaCalendarPlus, FaCalendarMinus } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import EmployeeList from './EmployeeList'
import ShiftList from './ShiftList'
import moment from 'moment'

var key = 0;

const Schedule = ({ schedule, value, setUpdatedSchedule, updatedEmployees, updatedShifts }) => {

  const [showAdd, setShowAdd] = useState(false)
  const [employeeList, setEmployeeList] = useState([])
  const [employeeText, setEmployeeText] = useState('')
  const [shiftList, setShiftList] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [selectText, setSelectText] = useState('')
  const [selectedShift, setSelectedShift] = useState('')
  const [confirmDelete, setConfirmDelete] = useState('hidden')

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

  }
  // add shift to schedule
  const dialogOK = async () => {
    setShowAdd(false)

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
  }

  const deleteSchedule = () => {
    if (!schedule.length) return
    setConfirmDelete('visible')

  }

  const deleteOK = async () => {
    setConfirmDelete('hidden')
    const date = moment(value).format('L').replaceAll('/', '')
    const response = await fetch(`http://localhost:4000/clearschedule/${date}`, { method: 'DELETE' })
    const data = await response.json()
    if (data.message === 'OK') setUpdatedSchedule([])
  }

  const deleteCancel = () => {
    setConfirmDelete('hidden')
  }

  return (
    <div>
      <dialog style={{ top: '20%' }} open={showAdd}>
        <h3 className='caption'><FaCalendarPlus /> Add Shift <div></div></h3>
        <div className='dialog-container'>
          <EmployeeList employeeList={employeeList} setEmployeeText={setEmployeeText} setSelectedEmployee={setSelectedEmployee} />
          <div></div>
          <ShiftList shiftList={shiftList} setSelectedShift={setSelectedShift} setSelectText={setSelectText} />
          <div></div>
          <button onClick={dialogOK}><FaCheck style={{ color: 'green' }} />OK</button>
          <button onClick={dialogCancel}><FaTimes style={{ color: 'red' }} />Cancel</button>
        </div>
      </dialog>

      <div className='component-container'>
        <h3 className='caption' ><FaRegCalendarAlt /> <div>Schedule for <span style={{ fontWeight: 'bold' }}>{value.toDateString()}</span></div><div></div></h3>
        <div style={{ display: 'flex', justifyContent: 'left', marginBottom: '1em' }}>
          <button onClick={addScheduleEntry} style={{ marginRight: '.5em', marginLeft: '1em' }}><FaCalendarPlus style={{ color: 'green' }} /></button>
          <button onClick={deleteSchedule}><FaCalendarMinus style={{ color: 'red' }} /></button>
          <div style={{ visibility: confirmDelete }}><label style={{ color: 'red' }}>Clear Schedule?</label><button onClick={deleteOK}><FaCheck style={{ color: 'green' }} /></button><button onClick={deleteCancel}><FaTimes style={{ color: 'red' }} /></button></div>
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
