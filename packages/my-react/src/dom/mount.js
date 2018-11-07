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

const mountClassComponent = (vNode, parentDOM) => {
  if (vNode.instance) {
  }
  const instance = new vNode.type(vNode.props, {
    vNode,
  })
  vNode.instance = instance
  const rendered = instance.render()
  mount(rendered, parentDOM)
  if (instance.componentDidMount) {
    instance.componentDidMount()
  }
}

const mountFunctionComponent = (vNode, parentDOM) => {
  const rendered = vNode.type(vNode.props)
  mount(rendered, parentDOM)
}

const mountText = (vNode, parentDOM) => {
  const textNode = createTextElement(vNode, parentDOM)
  parentDOM.appendChild(textNode)
  vNode.dom = textNode
}

const mountElement = (vNode, parentDOM) => {
  const dom = createElement(vNode)
  parentDOM.appendChild(dom)
  vNode.dom = dom
}

const mount = (vNode, parentDOM) => {
  const { flag } = vNode

  switch (flag) {
    case FLAGS.CLASS:
      mountClassComponent(vNode, parentDOM)
      break
    case FLAGS.FUNC:
      mountFunctionComponent(vNode, parentDOM)
      break
    case FLAGS.ELEMENT:
      mountElement(vNode, parentDOM)
    case FLAGS.TEXT:
      mountText(vNode, parentDOM)
    default:
      break
  }
}

export default mount
