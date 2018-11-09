import MyReact, { ReactDOM as MyReactDOM } from 'my-react'
import invariant from 'invariant'
// import React3, { render as render3 } from 'inferno-compat'
import React from 'react'
import ReactDOM from 'react-dom'
import app from './app'
import './style.css'
import diffRendered from './diffRendered'
import Controller from './Controller/Controller'
import parseQuery from './parseQuery'

const mount = ({
  domNode,
  renderFn,
  react,
  onUpdate = () => {},
  component,
}) => {
  const queryObj = parseQuery(window.location.search.substr(1))
  const App =
    component ||
    app(react, {
      render: renderFn,
      onUpdate,
      activeGroup: queryObj.group,
      activeTest: queryObj.test,
    })
  renderFn(react.createElement(App), domNode)
}

const render = () => {
  mount({
    domNode: document.getElementById('controller'),
    renderFn: ReactDOM.render,
    react: React,
    component: Controller,
  })

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
          document.getElementById('root2').innerHTML,
        )
        invariant(!diff, `renders differently!\n${(diff || []).join('\n')}`)
      }, 100)
    },
  })
}

render()
window.__render = render
