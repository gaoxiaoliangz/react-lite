import { createElement } from './react-element'
import Component from './react-component'
import { Reconciler } from './reconcile'
import { createElement as vdomCreateElement } from './virtual-dom'

const React = {
  createElement,
  Component
}

export const render = (reactElement, target) => {
  const r = new Reconciler()
  const v = vdomCreateElement(reactElement)
  r.start(target, v)
}

export default React
