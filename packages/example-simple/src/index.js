import MyReact, { ReactDOM as MyReactDOM } from 'my-react'
import React from 'react'
import ReactDOM from 'react-dom'
import app from './app'
import './style.css'

const mount = ({ domNode, renderFn, react, onUpdate = () => {} }) => {
  const App = app(react, {
    render: renderFn,
    onUpdate,
  })
  renderFn(react.createElement(App), domNode)
}

mount({
  domNode: document.getElementById('root'),
  renderFn: MyReactDOM.render,
  react: MyReact,
  onUpdate: () => {
    console.log('update from my react')
  },
})

mount({
  domNode: document.getElementById('root2'),
  renderFn: ReactDOM.render,
  react: React,
  onUpdate: () => {
    console.log('update from fb react')
  },
})
