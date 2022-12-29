import { useRef, useEffect } from 'react'

const EmployeeList = ({ employeeList, setSelectedEmployee, setEmployeeText, defaultEmployeeIndex }) => {

    const sRef = useRef(null)
    
    const onChange = (e) => {
        setSelectedEmployee(e.currentTarget.value)
        setEmployeeText(e.currentTarget[e.currentTarget.selectedIndex].text)
    }

    useEffect(() => {
        sRef.current.selectedIndex = defaultEmployeeIndex;
    }, [])

    return (
        <>
            <select ref={sRef} onChange={onChange}>{employeeList.map(e => { return <option value={e.id} key={e.id}>{e.firstName} {e.lastName}</option> })}</select>
        </>
    )
}

export default EmployeeList
