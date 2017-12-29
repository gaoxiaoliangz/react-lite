import _ from 'lodash'

// TODO: a more general way to detect
function isClassComponent(v) {
  if (typeof v !== 'function') {
    return false
  }
  return v.__type === 'class-component'
}

/**
 * vdomToDom
 * @param {Object} vdom
 * @param {String | Function} vdom.type
 * @param {Object} vdom.props
 * @param {{} | [] | String} vdom.props.children
 */
const vdomToDom = vdom => {
  if (typeof vdom === 'undefined' || typeof vdom === 'string' || typeof vdom === 'number' || vdom === null) {
    let str
    try {
      str = vdom.toString()
    } catch (error) {
      str = vdom
    }
    const text = document.createTextNode(str)
    return text
  }

  const { type, props } = vdom
  if (typeof type === 'string') {
    const dom = document.createElement(type)
    const attrs = _.omit(props, ['children', 'onClick'])
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
    const children = Array.isArray(props.children) ? props.children : [props.children]
    _.flattenDeep(children)
      .map(child => {
        return vdomToDom(child)
      })
      .forEach(child => {
        dom.appendChild(child)
      })
    return dom
  } else if (isClassComponent(type)) {
    const compIns = new type(props)
    const dom = vdomToDom(compIns.render())
    
    // magic happens here
    compIns.setWatcher(() => {
      console.log('update request')
      const newDom = vdomToDom(compIns.render())
      console.log(newDom)
      dom.innerHTML = newDom.innerHTML
      // document.getElementById('root3').appendChild(newDom)
      document.getElementById('root3').innerHTML = newDom.innerHTML
    })

    return dom
  } else if (typeof type === 'function') {
    return vdomToDom(type(props))
  }
  console.warn('Invalid type found', type)
  return
}

export function render(vdom, mountTarget) {
  const dom = vdomToDom(vdom)
  // TODO
  mountTarget.innerHTML = ''
  mountTarget.append(dom)
}
