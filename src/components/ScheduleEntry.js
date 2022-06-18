import { FaEdit, FaTimes, FaSave, FaCheck } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import ShiftList from './ShiftList'
import EmployeeList from './EmployeeList'

const buttonStyles = {
    marginLeft: '.2em',
    marginRight: '.2em',
    paddingTop: '.2em'
}

const ScheduleEntry = ({ name, shift, id, setUpdatedSchedule, date, index }) => {

    const [editShift, setEditShift] = useState(false)
    const [shiftList, setShiftList] = useState([])
    const [employeeList, setEmployeeList] = useState([])
    const [selectedShift, setSelectedShift] = useState('')
    const [selectedEmployee, setSelectedEmployee] = useState('')
    const [employeeText, setEmployeeText] = useState('')
    const [shiftText, setShiftText] = useState('')
    const [nameState, setNameState] = useState({ firstName: name.split(' ')[0], lastName: name.split(' ')[1] })
    const [shiftState, setShiftState] = useState({ startShift: shift.split(' - ')[0], endShift: shift.split(' - ')[1] })
    const [dialogRemove, showDialogRemove] = useState(false)

    const getShifts = async () => {
        const response = await fetch('http://localhost:4000/shifts')
        const data = await response.json()
        setShiftList(data)
        setShiftText(`${data[0].startShift} - ${data[0].endShift}`)
    }

    const getEmployees = async () => {
        const response = await fetch('http://localhost:4000/employees')
        const data = await response.json()
        setEmployeeList(data)
        setEmployeeText(`${data[0].firstName} ${data[0].lastName}`)
    }

    const dialogOK = async () => {
        showDialogRemove(false)
        // delete schedule entry
        const response = await fetch(`http://localhost:4000/schedule/${id}`, { method: 'DELETE' })
        const data = await response.json()
        // retrieve updated entry
        const updatedSchedule = await fetch(`http://localhost:4000/schedule/${date}`, { method: 'GET'})
        const updatedScheduleData = await updatedSchedule.json()
        // pass updated schedule up to App component
        setUpdatedSchedule(updatedScheduleData)

    }

    const dialogCancel = () => {
        showDialogRemove(false)
    }

    const deleteScheduleEntry = () => {
        showDialogRemove(true)
    }

    useEffect(() => {
        getShifts()
        getEmployees()
    }, [])



    const editClick = () => {
        editShift ? setEditShift(false) : setEditShift(true)
        if (!editShift) {
            getEmployees()
            getShifts()
        }

        if (editShift) {
            const updateSchedule = async () => {
                const options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: id, name: employeeText, shift: shiftText })

                }
                const response = await fetch('http://localhost:4000/schedule', options)
                const data = await response.json()
                data.shifts.map(e => {
                    if (e._id === id) {
                        const nameCopy = { ...nameState, firstName: e.firstName, lastName: e.lastName }
                        setNameState(nameCopy)
                        const shiftCopy = { ...shiftState, startShift: e.startShift, endShift: e.endShift }
                        setShiftState(shiftCopy)
                        return
                    }
                })
            }
            updateSchedule()
        }
    }
    return (

        <tr>
            <td>{editShift ? <EmployeeList employeeList={employeeList} setSelectedEmployee={setSelectedEmployee} setEmployeeText={setEmployeeText} /> : `${nameState.firstName} ${nameState.lastName}`}</td>
            <td style={{ display: 'flex', justifyContent: 'space-between' }}>
                {editShift ? <ShiftList shiftList={shiftList} setSelectedShift={setSelectedShift} setSelectText={setShiftText} /> : `${shiftState.startShift} - ${shiftState.endShift}`}
                <div style={{ display: 'inline-block' }}>
                    <button onClick={editClick} style={buttonStyles}>
                        {editShift ? <FaSave style={{ color: 'purple' }} /> : <FaEdit style={{ color: 'green' }} />}
                    </button>
                    <button onClick={deleteScheduleEntry} style={buttonStyles}><FaTimes style={{ color: 'red' }} />
                    </button>

                    <dialog style={{ top: '55%' }} open={dialogRemove}>
                        <h3 className='caption'>Confirm Schedule Entry Deletion</h3>
                        <div className='dialog-container'>
                            <div style={{ fontWeight: 'bold' }}>{employeeText}</div>
                            <div style={{ fontWeight: 'bold' }}>{shiftText}</div>
                            <p>Are you sure you want to remove this entry?</p>
                            <button onClick={dialogOK}><FaCheck style={{ color: 'green' }} />OK</button>
                            <button onClick={dialogCancel}><FaTimes style={{ color: 'red' }} />Cancel</button>
                        </div>

                    </dialog>
                </div>
            </td>
        </tr>
    )
}

export default ScheduleEntry
