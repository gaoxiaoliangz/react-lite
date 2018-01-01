import _ from 'lodash'

let evaledVdom

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

function getParentLink(self) {
  const parentLink = []
  const exec = element => {
    const parent = element.parent
    if (parent) {
      parentLink.push(parent)
      exec(parent)
    }
  }
  exec(self)
  return parentLink
}

/**
 * evalVdom
 * @param {Object} vdom
 * @param {String | Function} vdom.type
 * @param {Object} vdom.props
 * @param {{} | [] | String} vdom.props.children
 */
function evalVdom(vdom) {
  if (typeof vdom === 'undefined' || typeof vdom === 'string' || typeof vdom === 'number' || vdom === null) {
    let str
    try {
      str = vdom.toString()
    } catch (error) {
      console.warn('Eval vdom', vdom,  error)
      str = vdom || ''
    }
    return str
  }

  const { type, props } = vdom
  if (typeof type === 'string') {
    const children = Array.isArray(props.children) ? props.children : [props.children]
    const children2 = _.flattenDeep(children).map(child => {
      const evaled = evalVdom(child)
      if (typeof evaled === 'object') {
        evaled.parent = vdom
      }
      return evaled
      // return typeof evaled === 'object'
      //   ? {
      //     ...evaled,
      //     parent: vdom
      //   }
      //   : evaled
    })
    vdom.props.children = children2.length === 1 ? children2[0] : children2
    return vdom
    // return {
    //   ...vdom,
    //   props: {
    //     ...props,
    //     children: 
    //   },
    //   // uuid: guid()
    // }
  } else if (isClassComponent(type)) {
    const compIns = new type(props)
    const evaled = evalVdom(compIns.render())
    // magic happens here
    compIns.setWatcher(() => {
      console.log('update request')
      const newEvaled = evalVdom(compIns.render())
      const domPath = getParentLink(vdom)
      console.log('domPath', domPath)
      console.log('vdom', vdom)
    })

    vdom.evaled = evaled
    return vdom
    // return {
    //   ...vdom,
    //   evaled,
    //   // uuid: guid()
    // }
  } else if (typeof type === 'function') {
    const evaled = evalVdom(type(props))
    vdom.evaled = evaled
    return vdom
    // return {
    //   ...vdom,
    //   evaled,
    //   // uuid: guid()
    // }
  }
  console.warn('Invalid type found', type)
  return
}

const createDomFromEvaledVdom = vdom => {
  if (typeof vdom === 'string') {
    return document.createTextNode(vdom)
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
      dom.appendChild(createDomFromEvaledVdom(child))
    })
    return dom
  } else if (typeof type === 'function') {
    return createDomFromEvaledVdom(vdom.evaled)
  }
  console.warn('Invalid type found', type)
  return
}

export function render(vdom, mountTarget) {
  evaledVdom = evalVdom(vdom)
  console.log('evaledVdom', evaledVdom)
  const dom = createDomFromEvaledVdom(evaledVdom)
  console.log('dom', dom)
  mountTarget.innerHTML = ''
  mountTarget.append(dom)
}
