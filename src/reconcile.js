import { IterableWeakMap, TwoWayWeakMap, arrayGuard, updateAttrs, getAttrs, getNodeIndex } from './utils'
import { CLASS_COMPONENT_TYPE } from './react-component'
import { createElement as vdomCreateElement } from './virtual-dom'

export class Reconciler {
  constructor() {
    this._twoWayNodeMap = new TwoWayWeakMap()
  }

  _createNode(parentNode, vnode) {
    if (vnode.nodeType === 1) {
      const element = document.createElement(vnode.tagName)
      if (vnode.classComponentInstance) {
        vnode.onStateChange = newNode => {
          console.log(newNode)
          this.start(parentNode, newNode, vnode)
        }
      }
      if (vnode.onClick) {
        element.addEventListener('click', () => {
          console.log('clicked')
          vnode.onClick()
        })
      }
      parentNode.appendChild(element)
      vnode.childNodes.forEach(childNode => {
        this._createNode(element, childNode)
      })
      this._twoWayNodeMap.set(vnode, element)
    } else if (vnode.nodeType === 3) {
      const textNode = document.createTextNode(vnode.textContent)
      this._twoWayNodeMap.set(vnode, textNode)
      parentNode.appendChild(textNode)
    }
  }

  _updateNode(parentNode, vnode, oldVnode) {
    if (!oldVnode) {
      this._createNode(parentNode, vnode)
      return
    }

    // todo attrs

    if ((vnode.reactElement !== oldVnode.reactElement || vnode.tagName !== oldVnode.tagName) && vnode.nodeType !== 3) {
      // todo
      console.log('todo: complete update')
      console.log(vnode)
      console.log(oldVnode)
      console.log(vnode.reactElement, oldVnode.reactElement)
    } else if (vnode.nodeType === 3) {
      if (vnode.textContent !== oldVnode.textContent) {
        // console.log(parentNode,)
        this._updateTextContent(vnode, oldVnode)
      }
      return
    } else if (vnode.nodeType === 1) {
      // todo: attrs
      const parentNode2 = this._twoWayNodeMap.get(oldVnode)
      vnode.childNodes.forEach((childVnode, index) => {
        // todo: key
        this._updateNode(parentNode2, childVnode, oldVnode.childNodes[index])
      })
      return
    } else {
      console.log('should not be here!!!')
    }
  }

  _updateTextContent(vnode, oldVnode) {
    const node = this._twoWayNodeMap.get(oldVnode)
    const parentNode = node.parentNode
    const index = getNodeIndex(parentNode, node)
    parentNode.childNodes[index].textContent = vnode.textContent
  }

  _updateAttributes() {

  }

  _updateChildren() {

  }

  start(parentNode, vnode, oldVnode) {
    if (!oldVnode) {
      this._createNode(parentNode, vnode)
    } else {
      this._updateNode(parentNode, vnode, oldVnode)
    }
  }
}
