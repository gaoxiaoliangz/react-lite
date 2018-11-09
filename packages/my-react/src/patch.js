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
    const idx = getNodeIndex(prevVNode.dom)
    const type = typeof vNode.textContent
    const textContent =
      type === 'number' || type === 'string' ? vNode.textContent.toString() : ''

    prevVNode.dom.parentNode.childNodes[idx].textContent = textContent
    invariant(prevVNode.dom !== null, 'patchTextElement dom null')

    // 这么做感觉会有 bug，比如有多个空的 textNode
    // 但不这样会多一个空的 textNode，就和 react 的实现不一样
    // 等排序实现了之后这里解开在试一遍
    // if (textContent) {
    //   prevVNode.dom.parentNode.childNodes[idx].textContent = textContent
    //   vNode.dom = prevVNode.dom
    // } else {
    //   mount(vNode, prevVNode.dom.parentNode)
    //   unmount(prevVNode)
    // }
  }
}

const patch = (vNode, prevVNode) => {
  if (vNode === prevVNode) {
    return
  }
  // @todo 是否必要？
  // vNode.parent = prevVNode.parent
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

  // reorder
  // _.times(currentChildren.length).forEach(idx => {
  //   parentDOM.appendChild(currentChildren[idx].dom)
  // })

  return results
}

export default patch
