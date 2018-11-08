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
  const textNode = createDOMTextElement(vNode, parentDOM)
  mountChild(textNode, parentDOM, prevSibling)
  vNode.dom = textNode
  return textNode
}

const mountElement = (vNode, parentDOM, prevSibling) => {
  const dom = createDOMElement(vNode)
  mountChild(dom, parentDOM, prevSibling)
  vNode.dom = dom
  return dom
}

const mount = (vNode, parentDOM, prevSibling) => {
  const { flag } = vNode
  let dom

  switch (flag) {
    case FLAGS.CLASS:
      dom = mountClassComponent(vNode, parentDOM, prevSibling)
      break
    case FLAGS.FUNC:
      dom = mountFunctionComponent(vNode, parentDOM, prevSibling)
      break
    case FLAGS.ELEMENT:
      dom = mountElement(vNode, parentDOM, prevSibling)
      break
    case FLAGS.TEXT:
      dom = mountText(vNode, parentDOM, prevSibling)
      break
    default:
      throw new Error(`Unknown flag ${flag}`)
  }

  invariant(dom, 'mount dom null')
  return dom
}

export default mount
