import { FLAGS } from '../vnode'

const unmount = vNode => {
  if (vNode.flag === FLAGS.CLASS && vNode.instance.componentWillUnmount) {
    vNode.instance.componentWillUnmount()
  }
  vNode.dom.parentNode.removeChild(vNode.dom)
}

export default unmount
