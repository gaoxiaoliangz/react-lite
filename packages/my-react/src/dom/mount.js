// @ts-check
import invariant from 'invariant'
import { FLAGS } from '../vnode'
import { updateAttrs } from './utils'
import { addListeners } from './event'

const createDOMElement = vNode => {
  const { ref } = vNode
  const dom = document.createElement(vNode.type)
  updateAttrs(dom, vNode.attributes)
  addListeners(dom, vNode.listeners)
  vNode.children.forEach(child => {
    mount(child, dom)
  })
  if (ref) {
    ref(dom)
  }
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
  const instance = new vNode.type(vNode.props, {
    vNode,
  })
  vNode.instance = instance
  const rendered = instance.render()
  vNode.rendered = rendered
  instance.$context = {
    vNode,
  }
  const dom = mount(rendered, parentDOM)
  if (instance.componentDidMount) {
    instance.componentDidMount()
  }
  vNode.dom = dom
  return dom
}

const mountFunctionComponent = (vNode, parentDOM) => {
  const rendered = vNode.type(vNode.props)
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
