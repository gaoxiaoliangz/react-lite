import _ from 'lodash'

class IterableWeakMap {
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

  forEach(fn) {
    this._keys.forEach((key, index) => {
      fn({
        key,
        value: this._wm.get(key)
      }, index)
    })
  }
}
const evaledNodes = new IterableWeakMap()

export function guid() {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return s4() + s4()
}

// TODO: a more general way to detect
function isClassComponent(v) {
  if (typeof v !== 'function') {
    return false
  }
  return v.__type === 'class-component'
}

function isVdomObject(vdom) {
  return typeof vdom === 'object' && vdom !== null
}

/** start of scope funcs */
function hasChildDeep(vdom, child) {
  if (!isVdomObject(vdom)) {
    return false
  }
  const { props: { children } } = vdom
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

function getUpperScope(vdom) {
  let found
  evaledNodes.forEach(node => {
    if (!found && node.key !== vdom) {
      const result = hasChildDeep(node.value, vdom)
      if (result) {
        found = node.key
      }
    }
  })
  return found
}
/** end of scope funcs */

// TODO: replace createDomDeep
function updateElementDeep(element, evaled, oldEvaled) {
  const { props } = evaled
  const { props: oldProps } = oldEvaled
  const attrs = getAttrs(props)
  _.forEach(attrs, (v, k) => {
    element.setAttribute(k, v)
  })
  // TODO: support more events
  if (oldProps.onClick) {
    element.removeEventListener('click', oldProps.onClick)
  }
  if (props.onClick) {
    element.addEventListener('click', props.onClick)
  }

  if (evaled.length === oldEvaled.length) {
    // assume children have the same order
    if (props.children) {
      arrayGuard(props.children).forEach((child, index) => {
        const childOld = arrayGuard(oldEvaled.props && oldEvaled.props.children)[index]
        // update text node
        if (!isVdomObject(child)) {
          if (child !== childOld) {
            element.childNodes[index].textContent = child
          }
          return
        }
        // update non text node
        const { type } = child
        if (type !== childOld.type) {
          // TODO
          // element.childNodes[index] = evalVdomDeep(child)
          return
        }
        updateElementDeep(element.childNodes[index], child, childOld)
      })
    }
    return
  }
  console.log('TODO: update children of diff len')
}

/**
 * evalVdom
 * @param {Object} vdom
 * @param {String | Function} vdom.type
 * @param {Object} vdom.props
 * @param {{} | [] | String} vdom.props.children
 */
function evalVdom(vdom) {
  const { type, props} = vdom
  if (isClassComponent(type)) {
    const compIns = new type(props)
    const evaled = compIns.render()
    evaledNodes.set(vdom, evaled)

    compIns.setWatcher(() => {
      /**
       * THE MAGIC HAPPENS HERE
       */
      const oldEvaled = evaledNodes.get(vdom)
      const newEvaled = compIns.render()
      evaledNodes.set(vdom, newEvaled)
      evalVdomDeep(newEvaled)
      updateElementDeep(oldEvaled.dom, newEvaled, oldEvaled)
      newEvaled.dom = oldEvaled.dom
    })
    return evaled
  }
  const evaled = vdom.type(vdom.props)
  evaledNodes.set(vdom, evaled)
  return evaled
}

function evalVdomDeep(vdom) {
  if (!isVdomObject(vdom)) {
    return
  }
  const { type, props } = vdom
  if (typeof type === 'string') {
    const children = Array.isArray(props.children) ? props.children : [props.children]
    const children2 = _.flattenDeep(children).forEach(evalVdomDeep)
    return
  } else if (typeof type === 'function') {
    const evaled = evalVdom(vdom)
    evalVdomDeep(evaled)
    return
  }
  console.warn('evalVdomDeep: Invalid type found', type)
}

function getAttrs(props) {
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

function arrayGuard(arrOrEle) {
  if (arrOrEle) {
    return Array.isArray(arrOrEle) ? arrOrEle : [arrOrEle]
  }
  return []
}

function createDomDeep(vdom) {
  if (!isVdomObject(vdom)) {
    let str = ''
    if (typeof vdom !== 'undefined' && vdom.toString) {
      str = vdom.toString()
    }
    return document.createTextNode(str)
  }

  const { type, props } = vdom
  if (typeof type === 'string') {
    const dom = document.createElement(type)
    const attrs = getAttrs(props)
    const children = arrayGuard(props.children)
    if (props.onClick) {
      dom.addEventListener('click', props.onClick)
    }
    _.forEach(attrs, (v, k) => {
      dom.setAttribute(k, v)
    })
    children.forEach(child => {
      dom.appendChild(createDomDeep(child))
    })
    return dom
  } else if (typeof type === 'function') {
    const evaled = evaledNodes.get(vdom)
    const dom = createDomDeep(evaled)
    if (typeof evaled === 'object') {
      evaled.dom = dom
    }
    return dom
  }
  console.warn('createDomDeep: Invalid type found', type)
  return document.createTextNode(`Invalid type: ${type}`)
}

export function render(vdom, mountTarget) {
  evalVdomDeep(vdom)
  const dom = createDomDeep(vdom)
  mountTarget.innerHTML = ''
  mountTarget.append(dom)
}
