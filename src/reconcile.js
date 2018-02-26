import { IterableWeakMap, TwoWayWeakMap, arrayGuard, updateAttrs, getAttrs, getNodeIndex } from './utils'
import { CLASS_COMPONENT_TYPE } from './react-component'
import { createElement as vdomCreateElement } from './virtual-node'

export class Reconciler {
  constructor() {
    this._twoWayNodeMap = new TwoWayWeakMap()
  }

  _createNode(parentNode, vnode) {
    if (vnode.nodeType === 1) {
      const element = document.createElement(vnode.tagName)
      if (vnode.classComponentInstance) {
        let oldVnode
        vnode.onStateChange = newNode => { // eslint-disable-line
          this.start(parentNode, newNode, oldVnode || vnode)
          oldVnode = newNode
        }
      }
      if (vnode.onClick) {
        element.addEventListener('click', () => {
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

  _updateNode(parentNode, vnode, oldVnode, nodeIndex) {
    if (!oldVnode) {
      this._createNode(parentNode, vnode)
      return
    }

    // todo attrs

    if ((vnode.reactElement !== oldVnode.reactElement || vnode.tagName !== oldVnode.tagName) && vnode.nodeType !== 3) {
      // todo
      console.log('todo: complete update')
    } else if (vnode.nodeType === 3) {
      if (vnode.textContent !== oldVnode.textContent) {
        this._updateTextContent(vnode, oldVnode, nodeIndex)
      }
    } else if (vnode.nodeType === 1) {
      // todo: attrs
      const parentNode2 = this._twoWayNodeMap.get(oldVnode)
      vnode.childNodes.forEach((childVnode, index) => {
        // todo: key
        this._updateNode(parentNode2, childVnode, oldVnode.childNodes[index], index)
      })
    } else {
      // todo
      console.error('todo: should not be here!!!')
    }
  }

  _updateTextContent(vnode, oldVnode, nodeIndex) {
    const node = this._twoWayNodeMap.get(oldVnode)
    if (!node) {
      throw new Error('`oldVnode` should have corresponding `node`!')
    }
    const parentNode = node.parentNode
    if (parentNode.childNodes[nodeIndex].textContent !== vnode.textContent) {
      parentNode.childNodes[nodeIndex].textContent = vnode.textContent
    }
    this._twoWayNodeMap.remove(oldVnode)
    this._twoWayNodeMap.set(node, vnode)
  }

  _updateAttributes() {

  }

  _removeNode() {

  }

  start(parentNode, vnode, oldVnode) {
    if (!oldVnode) {
      this._createNode(parentNode, vnode)
    } else {
      this._updateNode(parentNode, vnode, oldVnode)
    }
  }
}
