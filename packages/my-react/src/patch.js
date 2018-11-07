// @ts-check
import _ from 'lodash'
import { FLAGS } from './vnode'
import mount from './dom/mount'
import unmount from './dom/unmount'
import { updateAttrs, getNodeIndex } from './dom/utils'
import { removeListeners, addListeners } from './dom/event'

const patchClassComponent = (vNode, prevVNode) => {
  console.log('todo p class')
  vNode.dom = prevVNode.dom
}

const patchFunctionComponent = (vNode, prevVNode) => {
  const newRendered = vNode.type(vNode.props)
  // 需要手动更新 rendered
  // 其实可以写成 vNode.render() 然后自己更新内部状态，但那样太 OO 了
  vNode.rendered = newRendered
  vNode.dom = prevVNode.dom
  return patch(newRendered, prevVNode.rendered)
}

const patchElement = (vNode, prevVNode) => {
  if (!_.isEqual(vNode.attributes, prevVNode.attributes)) {
    updateAttrs(vNode.dom, vNode.attributes)
  }
  removeListeners(prevVNode.dom, prevVNode.listeners)
  vNode.dom = prevVNode.dom
  removeListeners(prevVNode.dom, prevVNode.listeners)
  addListeners(vNode.dom, vNode.listeners)
  patchChildren(vNode.children, prevVNode.children, prevVNode.dom)
}

const patchTextElement = (vNode, prevVNode) => {
  if (vNode.textContent !== prevVNode.textContent) {
    const idx = getNodeIndex(prevVNode.dom)
    const type = typeof vNode.textContent
    const textContent =
      type === 'number' || type === 'string' ? vNode.textContent.toString() : ''
    if (textContent) {
      prevVNode.dom.parentNode.childNodes[idx].textContent = textContent
      vNode.dom = prevVNode.dom
    } else {
      mount(vNode, prevVNode.dom.parentNode)
      unmount(prevVNode)
    }
  }
}

const patch = (vNode, prevVNode) => {
  const { flag, type } = vNode

  if (prevVNode.flag !== flag || type !== prevVNode.type) {
    const parentDOM = prevVNode.dom.parentNode
    unmount(prevVNode)
    mount(vNode, parentDOM)
    return
  }

  switch (flag) {
    case FLAGS.CLASS:
      patchClassComponent(vNode, prevVNode)
      break
    case FLAGS.FUNC:
      patchFunctionComponent(vNode, prevVNode)
      break
    case FLAGS.ELEMENT:
      patchElement(vNode, prevVNode)
    case FLAGS.TEXT:
      patchTextElement(vNode, prevVNode)
    default:
      break
  }
}

export const patchChildren = (currentChildren, lastChildren, parentDOM) => {
  const lastNodeInUse = []
  let results = []
  currentChildren.forEach((currentVNode, idx) => {
    const { key } = currentVNode
    if (lastChildren[idx] && key === lastChildren[idx].key) {
      patch(currentVNode, lastChildren[idx])
      lastNodeInUse.push(idx)
    } else {
      // @todo: reordered
      const match = lastChildren.find(child => child.key === key)
      if (match) {
        lastNodeInUse.push(lastChildren.indexOf(match))
        patch(currentVNode, match)
      } else {
        mount(currentVNode, parentDOM)
      }
    }
  })
  lastChildren
    .filter((child, idx) => !lastNodeInUse.includes(idx))
    .forEach(unmount)

  return results
}

export default patch
