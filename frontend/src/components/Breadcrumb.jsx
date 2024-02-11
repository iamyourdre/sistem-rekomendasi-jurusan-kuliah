import React from 'react'

const Breadcrumb = ({ menu, submenu }) => {
  return (
    <div>
      <p className="font-light text-xl"> {menu} {' | '} <span className='font-bold'>{submenu}</span></p>
    </div>
  )
}

export default Breadcrumb
