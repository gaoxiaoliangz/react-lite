import React from 'react'
import { render } from 'react-dom'
import test from './test'

const App = test(React, React.Component)

console.log('react here')
console.log(App().props.children)
console.log(<App/>)
console.log(App())

render(<App/>, document.getElementById('root2'))
