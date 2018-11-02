import MyReact, { ReactDOM as MyReactDOM } from 'my-react'
import React from 'react'
import ReactDOM from 'react-dom'
import app from './app'
import './style.css'
import diffRendered from './diffRendered'

const mount = ({ domNode, renderFn, react, onUpdate = () => {} }) => {
  const App = app(react, {
    render: renderFn,
    onUpdate,
  })
  renderFn(react.createElement(App), domNode)
}

const render = () => {
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
      setTimeout(() => {
        const diff = diffRendered(
          document.getElementById('root').innerHTML,
          document.getElementById('root2').innerHTML
        )
        if (diff) {
          console.log(diff.join('\n'))
        } else {
          console.log('diffRendered: They are same')
        }
      }, 100)
    },
  })
}

render()
window.__render = render
