import { createNode } from './node'

export const render = (reactElement, domNode) => {
  domNode.appendChild(createDOMFromNode(createNode(reactElement)))
}

const applyPatch = ({ attributeChanged }) => {}

const createDOMFromNode = node => {
  return document.createElement('div')
}
