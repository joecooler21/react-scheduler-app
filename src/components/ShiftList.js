import { useRef, useEffect } from 'react'

const ShiftList = ({ setSelectedShift, setSelectText, shiftList, defaultShiftIndex }) => {

    const sRef = useRef(null)

   
    const onChange = (e) => {
          setSelectedShift(e.currentTarget.value)
          setSelectText(e.currentTarget[e.currentTarget.selectedIndex].text)

      }

      useEffect(() => {
        sRef.current.selectedIndex = defaultShiftIndex
      }, [])

  return (
      <>
      <select ref={sRef} onChange={onChange}>{shiftList.map(e=>{return <option value={e.id} key={e.id}>{e.startShift} - {e.endShift}</option>})}</select>
      </>
  )
}

export default ShiftList
