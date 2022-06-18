

const EmployeeList = ({ employeeList, setSelectedEmployee, setEmployeeText }) => {

    const onChange = (e) => {
        setSelectedEmployee(e.currentTarget.value)
        setEmployeeText(e.currentTarget[e.currentTarget.selectedIndex].text)
    }

    return (
        <>
            <select onChange={onChange}>{employeeList.map(e => { return <option value={e.id} key={e.id}>{e.firstName} {e.lastName}</option> })}</select>
        </>
    )
}

export default EmployeeList
