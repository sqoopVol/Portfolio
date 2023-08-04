import React from 'react'

const Footer = () => {
  return (
    <footer className='footer'>
        <span>© ГБПОУ НСО «Новосибирский авиационный технический колледж<br />имени Б.С. Галущака», 2015 - {`${new Date(Date.now()).getFullYear().toString()}`}</span>
        <span>Адрес электронной почты: naviatk@edu54.ru</span>
    </footer>
  )
}

export default Footer;