import React from 'react'
import ReactDom from 'react-dom'

import('./btn').then(comp => {
  console.log(comp.default)
})

const App = () => {
  return <div>
    Yes!
  </div>
}

ReactDom.render(<App/>, document.getElementById('root'))
