import _ from 'lodash'

/**
 * vdomToDom
 * @param {Object} vdom
 * @param {String | Function} vdom.type
 * @param {Object} vdom.props
 * @param {{} | [] | String} vdom.props.children
 */
function vdomToDom(vdom) {
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
      dom.addEventListener('click', props.onClick)
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
  } else if (type.__type === 'class-component') {
    const compIns = new type(props)
    const dom = vdomToDom(compIns.render())
    compIns.setWatcher(() => {
      console.log('update request')
      const newDom = vdomToDom(compIns.render())
      console.log(newDom)
      dom.innerHTML = newDom.innerHTML
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
  mountTarget.innerHTML = ''
  mountTarget.append(dom)
}
