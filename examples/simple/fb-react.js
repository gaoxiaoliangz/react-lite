import React from 'react'
import { render } from 'react-dom'
import test from './test'

const App = test(React, React.Component, true)

render(<App />, document.getElementById('root2'))

const Test = () => {
  return (
    <div>
      {0}
      {1}
      {undefined}
      {null}
      {true}
      {false}
      {[]}
    </div>
  )
}
// console.log(Test())
