// import React from 'react'
// import { render } from 'react-dom'
import React, { render } from '../../src'

import Btn from './btn'
import Dot from './dot'

const handleClick = () => {
  console.log('clicked')
}

// return <div onClick={handleClick} className={'abc' + 12}>
//   <Btn>
//     {
//       [
//         <Dot key="1"/>,
//         <Dot key="2"/>
//       ]
//     }
//   </Btn>
// </div>
// return (
//   <div>
//     <h1>title1</h1>
//     <ul>
//       <li>
//         <span>123</span>
//       </li>
//       <li>234</li>
//     </ul>
//   </div>
// )
const App = () => {
  return (
    <ul>
      <Btn>hahahha</Btn>
      1
      <li>2</li>
    </ul>
  )
}

console.log(App().props.children)
console.log(<App/>)

render(<App/>, document.getElementById('root'))
