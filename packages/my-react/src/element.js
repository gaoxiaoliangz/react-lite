import _ from 'lodash'

const _createElement = (type, props = {}, ...children) => {
  const element = {
    type,
    props: {
      // 这边的逻辑和 React 的一样
      ..._.omit(props, ['key', 'ref', '__source', '__self']),
      ...(children.length !== 0 && {
        children: children.length === 1 ? children[0] : children,
      }),
    },
    key: props.key,
    ref: props.ref,
  }
  element._store = {}

  Object.defineProperty(element._store, 'validated', {
    configurable: false,
    enumerable: false,
    writable: true,
    value: false,
  })

  Object.freeze(element)

  return element
}

// @todo: 处理 array in array 的情况，需要递归校验
const validateChildKeys = node => {
  // a simple validation (key validation to be specific)
  if (Array.isArray(node) && node.length !== 0) {
    const reactElements = node.filter(
      n => checkElement(n) !== 'text' && !n._store.validated,
    )
    if (reactElements.length !== 0) {
      const keys = reactElements
        .map(v => v.key)
        .filter(key => !_.isUndefined(key))
      if (keys.length !== 0 && keys.length !== _.union(keys).length) {
        // TODO: show exactly which key
        console.warn('Encountered two children with the same key')
      }
      if (
        keys.length === 0 ||
        keys.length !== keys.filter(k => typeof k !== 'undefined').length
      ) {
        // TODO: print component trace
        console.warn(
          'Each child in an array or iterator should have a unique "key" prop.',
        )
      }
    }
  } else if (node && node._store) {
    node._store.validated = true // eslint-disable-line
  }
}

export const createElement = (type, props, ...children) => {
  const reactElement = _createElement(type, props, ...children)
  children.forEach(validateChildKeys)
  return reactElement
}

export const cloneElement = (element, props, ...children) => {
  const cloned = _createElement(
    element.type,
    {
      ...element.props,
      ...props,
    },
    ...(children.length > 0
      ? children
      : Array.isArray(element.props.children)
        ? element.props.children
        : [element.props.children]),
  )
  Object.keys(element._store)
    .concat('validated')
    .forEach(key => {
      cloned._store[key] = element._store[key]
    })
  return cloned
}

export const getElementFlag = ele => {
  if (ele !== null && typeof ele === 'object' && ele.type && ele.props) {
    if (typeof ele.type === 'function') {
      if (ele.type._isClass) {
        return 'class'
      }
      return 'func'
    }
    return 'dom'
  }
  return 'text'
}
