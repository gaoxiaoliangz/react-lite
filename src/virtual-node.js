import { IterableWeakMap, arrayGuard, updateAttrs, getAttrs, getNodeIndex, uuid } from './utils'
import { CLASS_COMPONENT_TYPE } from './react-component'

class VirtualNode {
  constructor(reactElement) {
    this.onStateChange = null
    this.nodeType = null
    this.tagName = null
    this.parentNode = null
    this.childNodes = []
    this.reactElement = null
    this.classComponentInstance = null
    this.nodeId = null
    
    // events
    this.onClick = null

    this._create(reactElement)
  }

  _create(reactElement0) {
    let reactElement = reactElement0
    
    // todo
    if (!reactElement && reactElement !== '') {
      return
    }

    let { type, props, key } = reactElement
    if (typeof type === 'function') {
      this.reactElement = reactElement
      if (type.type === CLASS_COMPONENT_TYPE) {
        const instance = new type(props) // eslint-disable-line
        this.classComponentInstance = instance
        reactElement = instance.render()
      } else {
        reactElement = type(props)
      }
      type = reactElement.type
      props = reactElement.props
      key = reactElement.key
    }

    // todo
    if (typeof reactElement === 'string') {
      this.nodeType = 3
      this.textContent = reactElement
      return
    }

    this.nodeType = 1
    this.tagName = type.toUpperCase()

    // todo
    // updateAttrs($node, getAttrs(props))
    if (props.onClick) {
      this.onClick = props.onClick
    }
    arrayGuard(props.children).forEach(childElement => {
      const node = createElement(childElement)
      this.appendChild(node)
    })
  }

  appendChild(node) {
    node.parentNode = this // eslint-disable-line
    node.previousSibling = node.parentNode.lastChild // eslint-disable-line
    if (node.previousSibling) {
      node.previousSibling.nextSibling = node // eslint-disable-line
    }
    this.childNodes.push(node)
  }

  get lastChild() {
    return this.childNodes[this.childNodes.length - 1]
  }
}

let nodeId = 0

export const createElement = (reactElement) => {
  const node = new VirtualNode(reactElement)
  node.nodeId = nodeId
  nodeId++
  return node
}
