// @ts-check
import _ from 'lodash'
import invariant from 'invariant'
import { FLAGS } from './vnode'
import mount from './dom/mount'
import unmount from './dom/unmount'
import { updateAttrs, getNodeIndex } from './dom/utils'
import { removeListeners, addListeners } from './dom/event'

const patchClassComponent = (vNode, prevVNode) => {
  vNode.instance = prevVNode.instance
  vNode.instance.props = vNode.props
  // 因为这个问题排查了很久，一开始表现为 dom 为 null，事件触发两次
  vNode.instance.$context.vNode = vNode
  const newRendered = prevVNode.instance.render()
  vNode.rendered = newRendered
  vNode.dom = prevVNode.dom
  invariant(prevVNode.dom !== null, 'patchClassComponent dom null')
  return patch(newRendered, prevVNode.rendered)
}

const patchFunctionComponent = (vNode, prevVNode) => {
  const newRendered = vNode.type(vNode.props)
  // 需要手动更新 rendered
  // 其实可以写成 vNode.render() 然后自己更新内部状态，但那样太 OO 了
  vNode.rendered = newRendered
  vNode.dom = prevVNode.dom
  invariant(prevVNode.dom !== null, 'patchFunctionComponent dom null')
  return patch(newRendered, prevVNode.rendered)
}

const patchElement = (vNode, prevVNode) => {
  vNode.dom = prevVNode.dom
  if (!_.isEqual(vNode.attributes, prevVNode.attributes)) {
    updateAttrs(vNode.dom, vNode.attributes)
  }
  invariant(prevVNode.dom !== null, 'patchElement dom null')
  removeListeners(prevVNode.dom, prevVNode.listeners)
  addListeners(vNode.dom, vNode.listeners)
  patchChildren(vNode.children, prevVNode.children, prevVNode.dom)
}

const patchTextElement = (vNode, prevVNode) => {
  // 这个之前居然放到判断里了，导致之前未更新的 text 节点在之后的更新里找不到 dom
  vNode.dom = prevVNode.dom
  if (vNode.textContent !== prevVNode.textContent) {
    const type = typeof vNode.textContent
    const textContent =
      type === 'number' || type === 'string' ? vNode.textContent.toString() : ''
    invariant(prevVNode.dom !== null, 'patchTextElement dom null')

    // 没有真正采用和 react 一样的实现，担心会引入各种 dom 为 null 的问题
    // 现在在 chrome 里面通过检查器至少看不到 ""
    if (textContent) {
      prevVNode.dom.textContent = textContent
      vNode.dom = prevVNode.dom
    } else {
      mount(vNode, prevVNode.dom.parentNode)
      unmount(prevVNode)
    }
  }
}

const patch = (vNode, prevVNode) => {
  if (vNode === prevVNode) {
    return
  }
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
  const lastChildInUse = []
  let results = []
  currentChildren.forEach((currentVNode, idx) => {
    const { key } = currentVNode
    if (lastChildren[idx] && key === lastChildren[idx].key) {
      patch(currentVNode, lastChildren[idx])
      lastChildInUse.push(lastChildren[idx])
    } else {
      const match = lastChildren.find(child => child.key === key)
      if (match) {
        lastChildInUse.push(match)
        patch(currentVNode, match)
      } else {
        mount(currentVNode, parentDOM)
      }
    }
  })

  const lastChildNotInUse = lastChildren.filter(
    child => !lastChildInUse.includes(child)
  )

  // reorder
  lastChildNotInUse.forEach(unmount)
  currentChildren.forEach((currentVNode, idx) => {
    const domIdx = getNodeIndex(currentVNode.dom)
    if (domIdx !== idx) {
      parentDOM.insertBefore(currentVNode.dom, parentDOM.childNodes[idx])
    }
  })

  return results
}

export default patch
