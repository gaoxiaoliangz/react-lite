// @ts-check
import _ from 'lodash'
import { createNode } from './node'
import { TwoWayWeakMap, updateAttrs, getNodeIndex, removeNode } from './utils'

export const render = (reactElement, domNode) => {
  domNode.appendChild(createDOMFromNode(createNode(reactElement)))
}

const applyPatch = ({ attributeChanged }) => {}

const createDOMFromNode = node => {
  const {
    nodeType,
    attributes,
    listeners,
    tagName,
    textContent,
    childNodes,
  } = node
  let dom
  switch (nodeType) {
    case -1: {
      // @todo: reactFragment
      dom = createDOMFromNode(childNodes[0])
      break
    }

    case 1: {
      dom = document.createElement(tagName)
      updateAttrs(dom, attributes)
      _.forEach(listeners, (handler, key) => {
        dom.addEventListener(key, handler)
      })
      break
    }

    case 3: {
      dom = document.createTextNode(textContent)
      break
    }

    default:
      throw new Error(`Unknown nodeType ${nodeType}!`)
  }
  if (nodeType !== -1) {
    childNodes.forEach(child => {
      dom.appendChild(createDOMFromNode(child))
    })
  }

  return dom
}
