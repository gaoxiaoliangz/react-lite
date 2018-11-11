import _ from 'lodash'
import { createVNode } from './vnode'

export const createElement = (type, props, ...children) => {
  return createVNode(type, {
    ...props,
    ...(children.length !== 0 && {
      children: children.length === 1 ? children[0] : children,
    }),
  })
}
