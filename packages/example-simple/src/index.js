import MyReact, { render as myRender } from 'my-react'
import React from 'react'
import { render } from 'react-dom'
import test from './test'
import './style.css'
// import test0 from './test-simple'

const App = test(MyReact, MyReact.Component, true)
const App2 = test(React, React.Component, true)

myRender(<App />, document.getElementById('root'))

// fbs
render(<App2 />, document.getElementById('root2'))
