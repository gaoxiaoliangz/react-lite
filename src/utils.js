import _ from 'lodash'

export class IterableWeakMap {
  constructor() {
    this._wm = new WeakMap()
    this._keys = []
  }

  set(key, val) {
    this._wm.set(key, val)
    this._keys.push(key)
  }

  get(key) {
    return this._wm.get(key)
  }

  has(key) {
    return this._wm.has(key)
  }

  forEach(fn) {
    this._keys.forEach((key, index) => {
      fn({
        key,
        value: this._wm.get(key)
      }, index)
    })
  }
}

export function guid() {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return s4() + s4()
}

// TODO: a more general way to detect
export function isClassComponent(v) {
  if (typeof v !== 'function') {
    return false
  }
  return v.__type === 'class-component'
}

export function isVnodeObject(vdom) {
  if (notEmptyNode(vdom)) {
    return typeof vdom === 'object' && vdom.type && vdom.props
  }
  return false
}

export function isTextVnode(vnode) {
  return !isVnodeObject(vnode)
}

export function hasChildDeep(vnode, child) {
  if (!isVnodeObject(vnode)) {
    return false
  }
  const { props: { children } } = vnode
  if (children) {
    const children2 = Array.isArray(children) ? children : [children]
    return children2.some(child2 => {
      if (child2 === child) {
        return true
      }
      return hasChildDeep(child2, child)
    })
  }
  return false
}

export function getUpperScope(evaledNodes, vnode) {
  let found
  evaledNodes.forEach(node => {
    if (!found && node.key !== vnode) {
      const result = hasChildDeep(node.value.evaled, vnode)
      if (result) {
        found = node.key
      }
    }
  })
  return found
}

export function getAttrs(props) {
  return _.flow(
    _.curryRight(_.omitBy)((v, k) => ['children', 'onClick'].includes(k)),
    _.curryRight(_.mapKeys)((v, k) => {
      if (k === 'className') {
        return 'class'
      }
      return k
    })
  )(props)
}

export function arrayGuard(arrOrEle) {
  if (arrOrEle) {
    return Array.isArray(arrOrEle) ? arrOrEle : [arrOrEle]
  }
  return []
}

export function notEmptyNode(node) {
  return ![undefined, null, false, true].includes(node)
}

export function updateAttrs($dom, attrsObject) {
  _.forEach(attrsObject, (v, k) => {
    $dom.setAttribute(k, v)
  })
}
