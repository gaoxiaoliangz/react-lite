// @ts-check
import _ from 'lodash'
import invariant from 'invariant'
import { createNode } from './node'
import { TwoWayWeakMap, updateAttrs, getNodeIndex, removeNode } from './utils'
import { checkElement } from './element'
// node -> DOM
import { nodeDOMMap } from './store'

export const render = (reactElement, domNode) => {
  createDOMFromNode(createNode(reactElement), domNode)
}

export const applyPatches = patches => {
  console.log(patches)
  patches.forEach(applyPatch)
}

const applyPatch = patch => {
  const { type, payload } = patch
  switch (type) {
    case 'added': {
      const { node, parentNode, previousSiblingNode } = payload
      const dom = createDOMFromNode(node)
      const parentDOM = nodeDOMMap.get(parentNode)
      const siblingDOM = previousSiblingNode
        ? nodeDOMMap.get(previousSiblingNode).nextSibling
        : parentDOM.childNodes[0]
      parentDOM.insertBefore(dom, siblingDOM)
      node.dom = dom
      node.mounted = true
      break
    }
    case 'textChanged': {
      console.log('todo')
      break
    }
    case 'attributeChanged': {
      console.log('todo')
      break
    }
    case 'removed': {
      const dom = nodeDOMMap.get(payload)
      dom.parentNode.removeChild(dom)
      // @todo call lifecycle
      break
    }
    case 'reordered': {
      console.log('todo')
      break
    }
    default:
      console.error(`Unknown type: ${type}`)
      break
  }
}

export const updateDOMListeners = (dom, listeners, prevListeners) => {
  if (prevListeners) {
    _.forEach(prevListeners, (handler, key) => {
      dom.removeEventListener(key, handler)
    })
  }
  _.forEach(listeners, (handler, key) => {
    dom.addEventListener(key, handler)
  })
}

export const addListeners = (dom, listeners) => {
  _.forEach(listeners, (handler, key) => {
    dom.addEventListener(key, handler)
  })
}

export const removeListeners = (dom, listeners) => {
  _.forEach(listeners, (handler, key) => {
    dom.removeEventListener(key, handler)
  })
}

export const removeNodeListeners = node => {
  if (node.nodeType === 1 || node.childNodes.length) {
    if (node.listeners) {
      const dom = nodeDOMMap.get(node)
      removeListeners(dom, node.listeners)
    }
    node.childNodes.forEach(removeNodeListeners)
  }
}

export const addNodeListeners = node => {
  if (node.nodeType === 1 || node.childNodes.length) {
    if (node.listeners) {
      console.log(node)
      invariant(node.mounted, `${node} has not been mounted yet`)
      addListeners(node.dom, node.listeners)
    }
    node.childNodes.forEach(addNodeListeners)
  }
}

const createDOMFromNode = (node, parentDOM) => {
  const {
    nodeType,
    attributes,
    listeners,
    tagName,
    textContent,
    childNodes,
    ref,
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
      if (ref) {
        ref(dom)
      }
      updateAttrs(dom, attributes)
      // _.forEach(listeners, (handler, key) => {
      //   dom.addEventListener(key, handler)
      // })
      updateDOMListeners(dom, listeners)
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
    childNodes.forEach(childNode => {
      const childDOM = createDOMFromNode(childNode)
      dom.appendChild(childDOM)
      childNode.mounted = true
      childNode.dom = childDOM
      const { element, instance } = childNode._store
      if (checkElement(element) === 'class') {
        if (instance.componentDidMount) {
          instance.componentDidMount()
        }
      }
    })
  }
  nodeDOMMap.set(node, dom)
  if (parentDOM) {
    parentDOM.appendChild(dom)
    node.mounted = true
    node.dom = dom
  }

  return dom
}
