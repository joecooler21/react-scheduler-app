import React from 'react'
import { FaTimes, FaCalendarAlt } from 'react-icons/fa'



const PrintableView = ({ show, setShowPV, day, range, weeklySchedule }) => {
    
    const closeDialog = () => {
        setShowPV(false)

    }

    const formatDate = (date) => {
        let f_date = date.split('')
        f_date.splice(2, 0, '/')
        f_date.splice(5, 0, '/')
        return f_date.join('')
    }

    return (

        <dialog open={show} style={{ width: '95%', height: '70%', top: '10%' }}>
            <h3 className='caption'><FaCalendarAlt />{!range.length ? `No Schedule` : `Schedule for ${formatDate(range[0])} - ${formatDate(range[6])}`}<button onClick={closeDialog}><FaTimes style={{ color: 'red' }} /></button></h3>
            <table style={{ width: '98%', margin: '.8em' }}>
                <tbody>

                    {
                        weeklySchedule.sort((a, b) => { return a.date - b.date }).map(e => {
                            return (<tr>
                                <td style={{ fontWeight: 'bold', fontSize: '1.2em', width:'15%' }}>{e.n_date}<div style={{ fontWeight: 'normal', fontSize: '.9em' }}>{formatDate(e.date)}</div></td>
                                {e.shifts.map(d => {
                                    return (d.firstName === 'NO SCHEDULE' ? <td style={{borderRight:'none'}}>No Schedule</td> : <td>{`${d.firstName} ${d.lastName}`}<br></br><span style={{ fontWeight: 'bold' }}>{`${d.startShift} - ${d.endShift}`}</span></td>)
                                })}
                            </tr>)
                        })
                    }


                </tbody>
            </table>
        </dialog>
    )
}

export default PrintableView



