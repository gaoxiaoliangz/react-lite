import { IterableWeakMap, arrayGuard, updateAttrs, getAttrs, getNodeIndex } from './utils'
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

    // events
    this.onClick = null

    this._create(reactElement)
  }

  _create(reactElement0) {
    // console.log(reactElement0)
    let reactElement = reactElement0
    
    // todo
    if (!reactElement && reactElement !== '') {
      return
    }

    let { type, props, key } = reactElement
    if (typeof type === 'function') {
      this.reactElement = reactElement
      if (type.type === CLASS_COMPONENT_TYPE) {
        const instance = new type(props)
        this.classComponentInstance = instance
        reactElement = instance.render()
        // console.log(reactElement0)
        instance.setWatcher(() => {
          /**
           * THE MAGIC HAPPENS HERE
           */
          const node = createElement(instance.render())
          node.reactElement = reactElement0
          node.classComponentInstance = instance
          node.onStateChange = this.onStateChange
          if (this.onStateChange) {
            this.onStateChange(node)
          }
        })
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
    node.parentNode = this
    this.childNodes.push(node)
  }
}

export const createElement = (reactElement) => {
  return new VirtualNode(reactElement)
}
