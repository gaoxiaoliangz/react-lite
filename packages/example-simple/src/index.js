import MyReact, { render as myRender } from 'my-react'
import React from 'react'
import { render } from 'react-dom'
import app from './app'
import './style.css'

const mount = ({ domNode, renderFn, react }) => {
  const App = app(react, {
    render: renderFn,
    onUpdate: () => {
      console.log('update')
    },
  })
  renderFn(<App />, domNode)
}

// mount({
//   domNode: document.getElementById('root'),
//   renderFn: myRender,
//   react: MyReact,
// })

mount({
  domNode: document.getElementById('root2'),
  renderFn: render,
  react: React,
})
