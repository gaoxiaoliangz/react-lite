import _ from 'lodash'

export function notEmpty(input) {
  return ![undefined, null, false, true].includes(input)
}

export function isReactElement(element) {
  if (notEmpty(element)) {
    return typeof element === 'object' && element.type && element.props
  }
  return false
}

export function isReactTextElement(input) {
  const type = typeof input
  if (!isReactElement(input) && type === 'object' && input !== null && !Array.isArray(input)) {
    throw new Error(`Objects are not valid as a React child (found: object with keys ${JSON.stringify(input)}). If you meant to render a collection of children, use an array instead.`)
  }
  return type === 'string' || type === 'number'
}

export function createElement(type, props, ...children) {
  const element = {
    type,
    props: {
      ..._.omit(props, ['key']),
      ...children.length !== 0 && {
        children: children.length === 1 ? children[0] : children
      }
    },
    key: _.get(props, 'key'),
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

function validateChildKeys(node) {
  // a simple validation (key validation to be specific)
  if (Array.isArray(node) && node.length !== 0) {
    const reactElements = node.filter(n => isReactElement(n) && !n._store.validated)
    if (reactElements.length !== 0) {
      const keys = reactElements.map(v => v.key).filter(key => !_.isUndefined(key))
      if (keys.length !== 0 && keys.length !== _.union(keys).length) {
        // TODO: show exactly which key
        console.warn('Encountered two children with the same key')
      }
      if (keys.length === 0 || keys.length !== keys.filter(k => typeof k !== 'undefined').length) {
        // TODO: print component trace
        console.warn('Each child in an array or iterator should have a unique "key" prop.')
      }
    }
  } else if (node && node._store) {
    node._store.validated = true // eslint-disable-line
  }
}

export function createElementWithValidation(type, props, ...children) {
  const reactElement = createElement.call(null, type, props, ...children)
  children.forEach(validateChildKeys)
  return reactElement
}
