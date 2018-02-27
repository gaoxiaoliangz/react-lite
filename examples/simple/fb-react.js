import React from 'react'
import { render } from 'react-dom'
import test from './test'
// import test0 from './test-simple'

const App = test(React, React.Component, true)

render(<App />, document.getElementById('root2'))
