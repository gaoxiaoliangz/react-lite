import _ from 'lodash'

/**
 * vdomToDom
 * @param {Object} vdom
 * @param {String | Function} vdom.type
 * @param {Object} vdom.props
 * @param {{} | [] | String} vdom.props.children
 */
function vdomToDom(vdom) {
  if (!vdom) {
    console.warn('Empty vdom found', vdom)
    return
  }
  if (typeof vdom === 'string') {
    const text = document.createTextNode(vdom)
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
      dom.setAttribute(k, v)
    })
    const children = Array.isArray(props.children) ? props.children : [props.children]
    children
      .filter(Boolean)
      .map(child => vdomToDom(child))
      .forEach(child => {
        dom.appendChild(child)
      })
    return dom
  } else if (type.__type === 'class-component') {
    return new vdomToDom((new type(props)).render())
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
