// @ts-check
import invariant from 'invariant'
import { FLAGS } from '../vnode'
import { updateAttrs } from './utils'
import { addListeners } from './event'
import { reactState, funcStates } from '../hooks';

const createDOMElement = vNode => {
  const { ref } = vNode
  const dom = document.createElement(vNode.type)
  updateAttrs(dom, vNode.attributes)
  addListeners(dom, vNode.listeners)
  vNode.children.forEach(child => {
    mount(child, dom)
  })
  return dom
}

const createDOMTextElement = vNode => {
  const type = typeof vNode.textContent
  const textContent =
    type === 'number' || type === 'string' ? vNode.textContent.toString() : ''
  const dom = document.createTextNode(textContent)
  return dom
}

const mountChild = (child, parent) => {
  parent.appendChild(child)
}

// mount
const mountClassComponent = (vNode, parentDOM) => {
  const instance = new vNode.type(vNode.props)
  vNode.instance = instance
  instance._vNode = vNode
  const rendered = instance.render()
  vNode.rendered = rendered
  const dom = mount(rendered, parentDOM)
  vNode.dom = dom
  if (instance.componentDidMount) {
    instance.componentDidMount()
  }
  // @todo: 这里处理 ref 的时机和 react 并不一样，不知道 react 是出于什么考虑
  if (vNode.ref) {
    vNode.ref(instance)
  }
  return dom
}

const mountFunctionComponent = (vNode, parentDOM) => {
  reactState.currentVNode = vNode
  reactState.isCreatingState = true
  const rendered = vNode.type(vNode.props)
  // reset cursor if function component uses hooks
  if (funcStates.get(vNode)) {
    funcStates.get(vNode).cursor = -1
  }
  vNode.rendered = rendered
  const dom = mount(rendered, parentDOM)
  vNode.dom = dom
  return dom
}

const mountText = (vNode, parentDOM) => {
  const textNode = createDOMTextElement(vNode)
  mountChild(textNode, parentDOM)
  vNode.dom = textNode
  return textNode
}

const mountElement = (vNode, parentDOM) => {
  const dom = createDOMElement(vNode)
  mountChild(dom, parentDOM)
  if (vNode.ref) {
    vNode.ref(dom)
  }
  vNode.dom = dom
  return dom
}

const mount = (vNode, parentDOM) => {
  const { flag } = vNode
  let dom

  switch (flag) {
    case FLAGS.CLASS:
      dom = mountClassComponent(vNode, parentDOM)
      break
    case FLAGS.FUNC:
      dom = mountFunctionComponent(vNode, parentDOM)
      break
    case FLAGS.ELEMENT:
      dom = mountElement(vNode, parentDOM)
      break
    case FLAGS.TEXT:
      dom = mountText(vNode, parentDOM)
      break
    default:
      throw new Error(`Unknown flag ${flag}`)
  }

  invariant(dom, 'mount dom null')
  return dom
}

export default mount
