import _ from 'lodash'
import { createVNode } from './vnode'

export const createElement = (type, props, ...children) => {
  return createVNode(type, props, children)
}
