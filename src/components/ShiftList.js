const ShiftList = ({ setSelectedShift, setSelectText, shiftList }) => {

   
    const onChange = (e) => {
          setSelectedShift(e.currentTarget.value)
          setSelectText(e.currentTarget[e.currentTarget.selectedIndex].text)

      }

  return (
      <>
      <select onChange={onChange}>{shiftList.map(e=>{return <option value={e.id} key={e.id}>{e.startShift} - {e.endShift}</option>})}</select>
      </>
  )
}

export default ShiftList
