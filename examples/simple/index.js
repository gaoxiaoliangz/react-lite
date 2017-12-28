// import React from 'react'
// import ReactDom from 'react-dom'
import React from '../../src'
import Btn from './btn'

const handleClick = () => {
  console.log('clicked')
}

const App = () => {
  return <div onClick={handleClick} className={'abc' + 12}>
    <Btn>text</Btn>
  </div>
}

// ReactDom.render(<App/>, document.getElementById('root'))

console.log(App)
console.log(App())
