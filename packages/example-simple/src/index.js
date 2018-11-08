import MyReact, { ReactDOM as MyReactDOM } from 'my-react'
// import React3, { render as render3 } from 'inferno-compat'
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
    onUpdate: () => {},
  })

  // mount({
  //   domNode: document.getElementById('root2'),
  //   renderFn: render3,
  //   react: React3,
  //   onUpdate: () => {
  //     console.log('update from inferno')
  //   },
  // })

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
          console.log('diffRendered: They are the same')
        }
      }, 100)
    },
  })
}

render()
window.__render = render
