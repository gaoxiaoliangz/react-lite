import _ from 'lodash'

const evaledNodes = new WeakMap()

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
    // TODO: magic happens here
    compIns.setWatcher(() => {
      console.log('update request')
      // const newEvaled = evalVdom(compIns.render())
      // const domPath = getParentLink(vdom)
      // console.log('domPath', domPath)
      // console.log('vdom', vdom)
    })
    return evaled
  }
  const evaled = vdom.type(vdom.props)
  evaledNodes.set(vdom, evaled)
  return evaled
}

function evalVdomDeep(vdom) {
  if (typeof vdom !== 'object') {
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

function createDomDeep(vdom) {
  if (typeof vdom !== 'object') {
    let str = ''
    if (typeof vdom !== 'undefined' && vdom.toString) {
      str = vdom.toString()
    }
    return document.createTextNode(str)
  }

  const { type, props } = vdom
  if (typeof type === 'string') {
    const dom = document.createElement(type)
    const attrs = _.omit(props, ['children', 'onClick'])
    const children = Array.isArray(props.children) ? props.children : [props.children]
    if (props.onClick) {
      dom.addEventListener('click', () => {
        console.log('clicked')
        props.onClick()
      })
      console.log('setup click for', dom)
    }
    _.forEach(attrs, (v, k) => {
      const key = k === 'className' ? 'class' : k
      dom.setAttribute(key, v)
    })
    children.forEach(child => {
      dom.appendChild(createDomDeep(child))
    })
    return dom
  } else if (typeof type === 'function') {
    const evaled = evaledNodes.get(vdom)
    return createDomDeep(evaled)
  }
  console.warn('createDomDeep: Invalid type found', type)
  return document.createTextNode(`Invalid type: ${type}`)
}

export function render(vdom, mountTarget) {
  evalVdomDeep(vdom)
  console.log(evaledNodes)
  const dom = createDomDeep(vdom)
  console.log('dom', dom)
  mountTarget.innerHTML = ''
  mountTarget.append(dom)
}
