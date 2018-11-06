import _ from 'lodash'

class VNode {
  constructor({ type, props, ref, key, textContent }) {
    this.type = type
    this.props = {
      // 这边的逻辑和 React 的一样
      ..._.omit(props, ['key', 'ref', '__source', '__self']),
      ...(children.length !== 0 && {
        children: children.length === 1 ? children[0] : children,
      }),
    }
    this.ref = ref
    this.key = key
    this.validated = false
    this.textContent = textContent
  }
}

export const createVNodeFromElement = element => {
  const flag = getElementFlag(element)
}


