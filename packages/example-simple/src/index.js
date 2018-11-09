import React from 'react'
import ReactDOM from 'react-dom'
import React1, { ReactDOM as ReactDOM1 } from 'my-react'
import React2, { render as react2Render } from 'inferno-compat'
import invariant from 'invariant'
import app from './app'
import './style.css'
import diffRendered from './diffRendered'
import Controller from './Controller/Controller'
import parseQuery from './parseQuery'

const reactMap = {
  react: {
    react: React,
    reactDom: ReactDOM,
  },
  myReact: {
    react: React1,
    reactDom: ReactDOM1,
  },
  inferno: {
    react: React2,
    reactDom: {
      render: react2Render,
    },
  },
}

const mount = ({
  domId,
  whichReact = reactMap.react,
  onUpdate = () => {},
  component,
}) => {
  const { react, reactDom } = whichReact
  const queryObj = parseQuery(window.location.search.substr(1))
  const App =
    component ||
    app(react, {
      render: reactDom.render,
      onUpdate,
      activeGroup: queryObj.group,
      activeTest: queryObj.test,
    })
  reactDom.render(react.createElement(App), document.getElementById(domId))
}

const render = () => {
  // mount controller
  mount({
    domId: 'controller',
    component: Controller,
  })

  // mount my react
  mount({
    domId: 'root',
    whichReact: reactMap.myReact,
  })

  // mount facebook react
  mount({
    domId: 'root2',
    whichReact: reactMap.react,
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
