/**
 * 
 * @param {Object} vdom
 * @param {String | Function} vdom.type
 * @param {Object} vdom.props
 * @param {{} | []} vdom.props.children
 */
function vdomToDom(vdom) {
  if (typeof vdom === 'string') {
    const text = document.createTextNode(vdom)
    return text
  }
  const { type, props } = vdom
  if (typeof type === 'string') {
    const dom = document.createElement(type)
    const children = Array.isArray(props.children) ? props.children : [props.children]
    children
      .map(child => vdomToDom(child))
      .forEach(child => {
        dom.appendChild(child)
      })
    return dom
  } else {
    return vdomToDom(type(props))
  }
}

export function render(vdom, mountTarget) {
  const dom = vdomToDom(vdom)
  mountTarget.innerHTML = ''
  mountTarget.append(dom)
}
