import { getElementFlag } from '../element'
import { createVNodeFromElement } from '../vnode'

const mountClassComponent = (vNode, parentDOM) => {
  if (vNode.instance) {
  }
  const instance = new vNode.type(vNode.props, {
    vNode,
  })
  const rendered = instance.render()
  mount(rendered, parentDOM)
}

const mountFunctionComponent = (vNode, parentDOM) => {
  const rendered = vNode.type(vNode.props)
  mount(rendered, parentDOM)
}

const mountText = (vNode, parentDOM) => {
  // parentDOM.
}

const mountElement = (vNode, parentDOM) => {}

const mount = (element, parentDOM) => {
  const vNode = createVNodeFromElement(element)
  const { flag } = vNode

  switch (flag) {
    case 'class':
      mountClassComponent(vNode, parentDOM)
      break

    case 'func':
      mountFunctionComponent(vNode, parentDOM)
      break
    case 'element':

    case 'text':

    default:
      break
  }
}

export default mount
