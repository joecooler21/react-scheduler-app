
import EmployeeList from './EmployeeList'
import { FaCheck, FaPlus, FaTimes, FaUserClock, FaRegCalendarPlus, FaRegCalendarMinus, FaCalendarPlus, FaCalendarMinus } from 'react-icons/fa'
import { FaUserPlus, FaUserMinus } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import ShiftList from './ShiftList'
import moment from 'moment'



const ShiftEmployeeManagement = ({ setUpdatedEmployees, setUpdatedShifts }) => {
  const [selectedShift, setSelectedShift] = useState({})
  const [selectedEmployee, setSelectedEmployee] = useState({})
  const [selectText, setSelectText] = useState('')
  const [employeeText, setEmployeeText] = useState('')
  const [shiftList, setShiftList] = useState([])
  const [employees, setEmployees] = useState([])
  const [modalRemoveShiftVisible, setModalRemoveShiftVisible] = useState(false)
  const [modalRemoveEmployeeVisible, setModalRemoveEmployeeVisible] = useState(false)
  const [modalAddShiftVisible, setModalAddShiftVisible] = useState(false)
  const [modalAddEmployeeVisible, setModalAddEmployeeVisible] = useState(false)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [employeeName, setEmployeeName] = useState({ firstName: '', lastName: '' })
  const [hideContent, setHideContent] = useState(false)

  const getShifts = async () => {
    const response = await fetch('http://localhost:4000/shifts')
    const data = await response.json()
    setShiftList(data)
    setSelectedShift(data[0].id)
    setSelectText(`${data[0].startShift} - ${data[0].endShift}`)
  }

  const getEmployees = async () => {
    const response = await fetch('http://localhost:4000/employees')
    const data = await response.json()
    setEmployees(data)
    setSelectedEmployee(data[0].id)
    setEmployeeText(`${data[0].firstName} ${data[0].lastName}`)
  }

  useEffect(() => {
    getShifts()
    getEmployees()
  }, [])


  const removeShift = async () => {
    const response = await fetch(`http://localhost:4000/shifts/${selectedShift}`, { method: 'DELETE' })
    const data = await response.json()
    setShiftList(data)
    // when a shift is removed pass up updated list
    setUpdatedShifts(data)
    setSelectedShift(data[0].id)


  }

  const removeEmployee = async () => {
    const response = await fetch(`http://localhost:4000/employees/${selectedEmployee}`, { method: 'DELETE' })
    const data = await response.json()
    setEmployees(data)
    // when an employee is removed pass up updated list
    setUpdatedEmployees(data)
    setSelectedEmployee(data[0].id)

  }

  // add shift modal functions

  const addShiftModalOK = async () => {
    if (startTime == '' || endTime == '') return

    const start = moment(startTime, 'HH:mm').format('LT')
    const end = moment(endTime, 'HH:mm').format('LT')

    // check for duplicates

    shiftList.forEach(e => {
      if (start == e.startShift && end == e.endShift) {
        return
      }
    })

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startShift: start, endShift: end })
    }

    const response = await fetch(`http://localhost:4000/shifts`, options)
    const data = await response.json()
    setShiftList(data)
    // when a shift is added pass up updated list
    setUpdatedShifts(data)

    setModalAddShiftVisible(false)
    setHideContent(false)
    setStartTime('')
    setEndTime('')
  }

  const addShiftModalCancel = () => {
    setModalAddShiftVisible(false)
    setHideContent(false)
    setStartTime('')
    setEndTime('')
  }

  const showAddShiftModal = () => {
    setModalAddShiftVisible(true)
    setHideContent(true)
  }

  const startInputChange = (e) => {
    setStartTime(e.currentTarget.value)

  }
  const endInputChange = (e) => {
    setEndTime(e.currentTarget.value)

  }
  ///////////////////////////////

  // remove shift modal functions
  const removeShiftModalOK = async () => {
    setModalRemoveShiftVisible(false)
    setHideContent(false)
    removeShift()

  }
  const removeShiftModalCancel = () => {
    setModalRemoveShiftVisible(false)
    setHideContent(false)
  }
  const showRemoveShiftModal = () => {
    setModalRemoveShiftVisible(true)
    setHideContent(true)
  }
  ////////////////////////////////////

  // add employee modal functions
  const showAddEmployeeModal = () => {
    setModalAddEmployeeVisible(true)
    setHideContent(true)
  }

  const addEmployeeModalCancel = () => {
    setModalAddEmployeeVisible(false)
    const blank = { ...employeeName, firstName: '', lastName: '' }
    setEmployeeName(blank)
    setHideContent(false)
  }

  const addEmployeeModalOK = async () => {
    if (employeeName.firstName == '' || employeeName.lastName == '') return
    setModalAddEmployeeVisible(false)
    setHideContent(false)

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeName)
    }

    const response = await fetch(`http://localhost:4000/employees`, options)
    const data = await response.json()
    setEmployees(data)
    // when an employee is added pass up updated employee list
    setUpdatedEmployees(data)
    const blank = { ...employeeName, firstName: '', lastName: '' }
    setEmployeeName(blank)
  }

  const inputFirstNameChange = (e) => {
    const newVal = { ...employeeName, firstName: e.currentTarget.value }
    setEmployeeName(newVal)

  }

  const inputLastNameChange = (e) => {
    const newVal = { ...employeeName, lastName: e.currentTarget.value }
    setEmployeeName(newVal)

  }

  // remove employee modal

  const showRemoveEmployeeModal = () => {
    setModalRemoveEmployeeVisible(true)
    setHideContent(true)

  }

  const removeEmployeeModalOK = () => {
    setModalRemoveEmployeeVisible(false)
    setHideContent(false)
    removeEmployee()

  }

  const removeEmployeeModalCancel = () => {
    setModalRemoveEmployeeVisible(false)
    setHideContent(false)

  }

  return (
    <div>
      <div className='component-container'>
        <h3 className='caption'><FaUserClock /> Employee/Shift Management <div></div></h3>

        {modalAddShiftVisible ? <div className='dialog-container'>
          <p style={{fontWeight:'bold', margin:'0px'}}>Add Shift</p>
          <div></div>
          <input value={startTime} onChange={startInputChange} type='time'></input>
          <label>to</label>
          <input value={endTime} onChange={endInputChange} type='time'></input>
          <div></div>
          <button onClick={addShiftModalOK}><FaCheck style={{ color: 'green' }} />OK</button>
          <button onClick={addShiftModalCancel}><FaTimes style={{ color: 'red' }} />Cancel</button>
          </div> : <div></div>}

          {modalRemoveShiftVisible ? <div className='dialog-container'>
          <p style={{ fontWeight: 'bold', margin: '0px' }}>{selectText}</p>
          <p>Are you sure you want to remove this shift?</p>
          <button onClick={removeShiftModalOK}><FaCheck style={{ color: 'green' }} />OK</button>
          <button onClick={removeShiftModalCancel}><FaTimes style={{ color: 'red' }} />Cancel</button>
        </div> : <div></div>}

        {modalAddEmployeeVisible ? <div className='dialog-container'>
          <p style={{fontWeight:'bold', margin:'0px'}}>Add Employee</p>
          <br></br>
          <label>First </label>
          <input value={employeeName.firstName} onChange={inputFirstNameChange} type='text'></input>
          <div></div>
          <label>Last </label>
          <input value={employeeName.lastName} onChange={inputLastNameChange} type='text'></input>
          <div></div>
          <button onClick={addEmployeeModalOK}><FaCheck style={{ color: 'green' }} />OK</button>
          <button onClick={addEmployeeModalCancel}><FaTimes style={{ color: 'red' }} />Cancel</button>
        </div>:<div></div>}

        {modalRemoveEmployeeVisible ? <div className='dialog-container'>
          <p style={{ fontWeight: 'bold', margin: '0px' }}>{employeeText}</p>
          <p>Are you sure you want to remove this employee?</p>
          <button onClick={removeEmployeeModalOK}><FaCheck style={{ color: 'green' }} />OK</button>
          <button onClick={removeEmployeeModalCancel}><FaTimes style={{ color: 'red' }} />Cancel</button>
        </div>: <div></div>}

        <div style={hideContent ? { display: 'none' } : { display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <div>
            <div>Shifts</div>
            <ShiftList setSelectText={setSelectText} shiftList={shiftList} setSelectedShift={setSelectedShift} />

            <button onClick={showAddShiftModal} style={{ marginRight: '.5em' }}><FaCalendarPlus style={{ color: 'green' }} /></button>
            <button onClick={showRemoveShiftModal}><FaCalendarMinus style={{ color: 'red' }} /></button>
          </div>

          <div>
            <div>Employees</div>
            <EmployeeList setEmployeeText={setEmployeeText} setSelectedEmployee={setSelectedEmployee} employeeList={employees} />
            <button onClick={showAddEmployeeModal} style={{ marginRight: '.5em' }}><FaUserPlus style={{ color: 'green' }} /></button>
            <button onClick={showRemoveEmployeeModal}><FaUserMinus style={{ color: 'red' }} /></button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ShiftEmployeeManagement
