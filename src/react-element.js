import _ from 'lodash'

export function createElement(type, props, ...children) {
  const { key } = props || {}

  // a simple validation (key validation to be specific)
  children.forEach(child => {
    if (Array.isArray(child)) {
      const keys = child.filter(isReactElement).map(v => v.key)
      if (keys.length !== _.union(keys).length) {
        // TODO: show exactly which key
        console.warn('Encountered two children with the same key')
      }
      if (keys.length !== keys.filter(key => typeof key !== 'undefined').length) {
        // TODO: print component trace
        console.warn('Each child in an array or iterator should have a unique "key" prop.')
      }
    }
  })

  return {
    type,
    props: {
      ..._.omit(props, ['key']),
      ...children.length !== 0 && {
        children: children.length === 1 ? children[0] : children
      }
    },
    key,
  }
}

export function notEmpty(input) {
  return ![undefined, null, false, true].includes(input)
}

export function isReactElement(element) {
  if (notEmpty(element)) {
    return typeof element === 'object' && element.type && element.props
  }
  return false
}

// export function isTextVnode(vnode) {
//   return !isVnodeObject(vnode)
// }
