import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SignUp from './components/SignUp'
import LogIn from './components/LogIn'

function App() {

  return (
    <>
      <SignUp />
      <LogIn/>
    </>
  )
}

export default App
