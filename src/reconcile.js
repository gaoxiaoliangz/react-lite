import _ from 'lodash'
import { TwoWayWeakMap, updateAttrs, getNodeIndex, removeNode } from './utils'
import { createElement as vCreateElement } from './virtual-node'

export class Reconciler {
  constructor() {
    this._twoWayNodeMap = new TwoWayWeakMap()
  }

  _createNode(parentNode, vnode, nextSiblingNode) {
    if (vnode.nodeType === 1) {
      const element = document.createElement(vnode.tagName)
      updateAttrs(element, vnode.attributes)
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

      parentNode.insertBefore(element, nextSiblingNode)
      vnode.childNodes.forEach(childNode => {
        this._createNode(element, childNode)
      })
      this._twoWayNodeMap.set(vnode, element)
    } else if (vnode.nodeType === 3) {
      const textNode = document.createTextNode(vnode.textContent)
      this._twoWayNodeMap.set(vnode, textNode)
      parentNode.insertBefore(textNode, nextSiblingNode)
    }
  }

  _getNode(vnode) {
    return this._twoWayNodeMap.get(vnode)
  }

  _updateNode(parentNode, vnode, prevVnode) {
    if ((vnode.reactElement !== prevVnode.reactElement || vnode.tagName !== prevVnode.tagName) && vnode.nodeType !== 3) {
      // a complete update
      // console.log('complete update', vnode, prevVnode)
      // console.log(vnode.reactElement !== prevVnode.reactElement)
      // console.log('tag', vnode.tagName !== prevVnode.tagName)
      // setTimeout(() => {
      //   console.log('tag to', vnode.tagName !== prevVnode.tagName)
      // }, 200)
      const node = this._getNode(prevVnode)
      this._createNode(parentNode, vnode, node.nextSibling)
      this._removeNode(node)
    } else if (vnode.nodeType === 3) {
      // update text node
      if (vnode.textContent !== prevVnode.textContent) {
        this._updateTextContent(vnode, prevVnode)
      }
    } else if (vnode.nodeType === 1) {
      // update element node
      const node = this._getNode(prevVnode)
      if (!_.isEqual(vnode.attributes, prevVnode.attributes)) {
        updateAttrs(node, vnode.attributes)
      }
      const parentNode2 = this._twoWayNodeMap.get(prevVnode)
      vnode.childNodes.forEach((childVnode, index) => {
        // todo: key
        this.start(parentNode2, childVnode, prevVnode.childNodes[index])
      })
      this._updateNodeMap(vnode, prevVnode)
    } else {
      // todo: other type of nodes
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

  _removeNode(node) {
    removeNode(node)
    // todo: node unmount
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
