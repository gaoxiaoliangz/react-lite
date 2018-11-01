import { createElementWithValidation as createElement } from './react-element'
import Component from './react-component'
import { Reconciler } from './reconcile'
import { createElement as vCreateElement } from './virtual-node'

const React = {
  createElement,
  Component
}

export const render = (reactElement, target) => {
  target.innerHTML = null // eslint-disable-line
  const r = new Reconciler()
  const v = vCreateElement(reactElement)
  r.start(target, v)
}

export default React
