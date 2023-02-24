import React, { useState, useEffect } from 'react'

function ArrayBar({ value, status }) {
  

  const [color, setColor] = useState('')

  useEffect(() => {
    // console.log(status)
    if (status === 'unsorted'){
      setColor('#ACD7EC')
    } else if (status === 'sorted') {
      setColor('#478978')
    } else if (status === "comparing") {
      setColor('#C94277')
    } else if (status === 'swapping') {
      setColor('#E3C0D3')
    }
  }, [JSON.stringify(status)])

  return (
    <div className='arrayBar' style={{
       height: `${value}px`,
       backgroundColor: `${color}`}}>

    </div>
  )
}

export default ArrayBar