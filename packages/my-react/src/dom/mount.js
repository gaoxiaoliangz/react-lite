import { FLAGS } from '../vnode'
import { updateAttrs } from './utils'
import { addListeners } from './event'

const createElement = vNode => {
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

const createTextElement = vNode => {
  const type = typeof vNode.textContent
  const textContent =
    type === 'number' || type === 'string' ? vNode.textContent : ''
  const dom = document.createTextNode(textContent)
  return dom
}

const mountChild = (child, parent, prevSibling) => {
  // if (prevSibling) {
  // } else {
  //   parent.appendChild(child)
  // }
  // parent.insertBefore(child, prevSibling.nextSibling || parent.childNodes[0])
  parent.appendChild(child)
}

// mount
const mountClassComponent = (vNode, parentDOM, prevSibling) => {
  const instance = new vNode.type(vNode.props, {
    vNode,
  })
  vNode.instance = instance
  const rendered = instance.render()
  vNode.rendered = rendered
  instance.$context = {
    vNode,
  }
  const dom = mount(rendered, parentDOM, prevSibling)
  if (instance.componentDidMount) {
    instance.componentDidMount()
  }
  vNode.dom = dom
  return dom
}

const mountFunctionComponent = (vNode, parentDOM, prevSibling) => {
  const rendered = vNode.type(vNode.props)
  vNode.rendered = rendered
  const dom = mount(rendered, parentDOM, prevSibling)
  vNode.dom = dom
  return dom
}

const mountText = (vNode, parentDOM, prevSibling) => {
  const textNode = createTextElement(vNode, parentDOM)
  mountChild(textNode, parentDOM, prevSibling)
  vNode.dom = textNode
  return textNode
}

const mountElement = (vNode, parentDOM, prevSibling) => {
  const dom = createElement(vNode)
  mountChild(dom, parentDOM, prevSibling)
  vNode.dom = dom
  return dom
}

const mount = (vNode, parentDOM, prevSibling) => {
  const { flag } = vNode

  switch (flag) {
    case FLAGS.CLASS:
      return mountClassComponent(vNode, parentDOM, prevSibling)
    case FLAGS.FUNC:
      return mountFunctionComponent(vNode, parentDOM, prevSibling)
    case FLAGS.ELEMENT:
      return mountElement(vNode, parentDOM, prevSibling)
    case FLAGS.TEXT:
      return mountText(vNode, parentDOM, prevSibling)
    default:
      break
  }
}

export default mount
