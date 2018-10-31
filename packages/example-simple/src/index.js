import MyReact, { render as myRender } from 'my-react'
import React from 'react'
import { render } from 'react-dom'
import test from './test'
import './style.css'

const mount = ({ domNode, renderFn, react }) => {
  renderFn(test(react), domNode)
}

mount({
  domNode: document.getElementById('root'),
  renderFn: myRender,
  react: MyReact,
})

mount({
  domNode: document.getElementById('root2'),
  renderFn: render,
  react: React,
})
