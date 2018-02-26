import _ from 'lodash'
import { arrayGuard, getAttrs, isClassComponent } from './utils'
import { isReactTextElement, isReactElement } from './react-element'

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
    this.attributes = {}
    this.key = null
    this.valid = true

    // events
    this.onClick = null

    this._create(reactElement)
  }

  _create(reactElement0) {
    let reactElement = reactElement0
    let { type, props, key } = reactElement || {}
    
    if (typeof type === 'function') {
      this.reactElement = reactElement
      if (isClassComponent(type)) {
        const instance = new type(props) // eslint-disable-line
        this.classComponentInstance = instance
        reactElement = instance.render()
      } else {
        reactElement = type(props)
      }
      type = reactElement.type
      props = reactElement.props
      key = reactElement.key || key
    }

    if (isReactTextElement(reactElement)) {
      this.nodeType = 3
      this.textContent = reactElement
      return
    }

    if (!isReactElement(reactElement) && !isReactTextElement(reactElement)) {
      this.valid = false
      return
    }

    this.key = key
    this.nodeType = 1
    this.tagName = type.toUpperCase()
    this.attributes = getAttrs(props)

    if (props.onClick) {
      this.onClick = props.onClick
    }
    _.flattenDeep(arrayGuard(props.children)).forEach(childElement => {
      const node = createElement(childElement)
      if (node.valid) {
        this.appendChild(node)
      }
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
