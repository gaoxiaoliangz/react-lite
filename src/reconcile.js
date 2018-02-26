import { IterableWeakMap, TwoWayWeakMap, arrayGuard, updateAttrs, getAttrs, getNodeIndex } from './utils'
import { CLASS_COMPONENT_TYPE } from './react-component'
import { createElement as vCreateElement } from './virtual-node'

export class Reconciler {
  constructor() {
    this._twoWayNodeMap = new TwoWayWeakMap()
  }

  _createNode(parentNode, vnode) {
    if (vnode.nodeType === 1) {
      const element = document.createElement(vnode.tagName)

      if (vnode.classComponentInstance) {
        let lastVnode
        const instance = vnode.classComponentInstance
        instance.setWatcher(() => {
          const prevVnode = lastVnode || vnode
          const newVnode = vCreateElement(instance.render())

          newVnode.reactElement = prevVnode.reactElement
          newVnode.classComponentInstance = instance
          this.start(parentNode, newVnode, prevVnode)
          lastVnode = newVnode
        })
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

  _updateNode(parentNode, vnode, prevVnode) {
    // todo attrs

    // update node, vnode relations


    if ((vnode.reactElement !== prevVnode.reactElement || vnode.tagName !== prevVnode.tagName) && vnode.nodeType !== 3) {
      // todo
      console.log('todo: complete update')
    } else if (vnode.nodeType === 3) {
      if (vnode.textContent !== prevVnode.textContent) {
        this._updateTextContent(vnode, prevVnode)
      }
    } else if (vnode.nodeType === 1) {
      // todo: attrs
      const parentNode2 = this._twoWayNodeMap.get(prevVnode)
      vnode.childNodes.forEach((childVnode, index) => {
        // todo: key
        this.start(parentNode2, childVnode, prevVnode.childNodes[index])
      })
      this._updateNodeMap(vnode, prevVnode)
    } else {
      // todo
      console.error('todo: should not be here!!!')
    }
  }

  _updateTextContent(vnode, prevVnode) {
    const node = this._twoWayNodeMap.get(prevVnode)
    if (!node) {
      throw new Error('`oldVnode` should have corresponding `node`!')
    }
    const parentNode = node.parentNode
    const nodeIndex = getNodeIndex(node)
    if (parentNode.childNodes[nodeIndex].textContent !== vnode.textContent) {
      parentNode.childNodes[nodeIndex].textContent = vnode.textContent
    }
    this._updateNodeMap(vnode, prevVnode)
  }

  _updateAttributes() {

  }

  _removeNode() {

  }

  _updateNodeMap(vnode, prevVnode) {
    const node = this._twoWayNodeMap.get(prevVnode)
    this._twoWayNodeMap.remove(prevVnode)
    this._twoWayNodeMap.set(node, vnode)
  }

  start(parentNode, vnode, oldVnode) {
    if (!oldVnode) {
      this._createNode(parentNode, vnode)
    } else {
      this._updateNode(parentNode, vnode, oldVnode)
    }
  }
}
