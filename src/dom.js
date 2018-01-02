import _ from 'lodash'
import { isClassComponent, isVdomObject, arrayGuard, IterableWeakMap, getAttrs, notEmptyNode } from './utils'

const evaledNodes = new IterableWeakMap()

// TODO: replace createDomDeep
function updateElementDeep(element, evaled, oldEvaled) {
  const { props } = evaled
  const { props: oldProps } = oldEvaled
  const children = arrayGuard(props.children)
  const oldChildren = arrayGuard(oldProps.children)
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

  if (children.length === oldChildren.length) {
    // assume children have the same order
    if (props.children) {
      children.forEach((child, index) => {
        const oldChild = oldChildren[index]
        // update text node
        if (!isVdomObject(child)) {
          console.log(children, oldChildren)
          if (child !== oldChild) {
            element.childNodes[index].textContent = child
          }
          return
        }
        // update non text node
        const { type } = child
        if (type !== oldChild.type) {
          // TODO
          // element.childNodes[index] = evalVdomDeep(child)
          return
        }
        updateElementDeep(element.childNodes[index], child, oldChild)
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
  const { type, props } = vdom
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
    const children2 = _.flattenDeep(children)
      .forEach(evalVdomDeep)
    return
  } else if (typeof type === 'function') {
    const evaled = evalVdom(vdom)
    evalVdomDeep(evaled)
    return
  }
  console.warn('evalVdomDeep: Invalid type found', type)
}

function createDomDeep(vdom) {
  if (!isVdomObject(vdom)) {
    // should have been filtered from evalVdomDeep, keep it here just in case
    if (!notEmptyNode(vdom)) {
      return
    }
    return document.createTextNode(vdom.toString())
  }

  const { type, props } = vdom
  if (typeof type === 'string') {
    const dom = document.createElement(type)
    const attrs = getAttrs(props)
    const children = _.flattenDeep(arrayGuard(props.children))
    if (props.onClick) {
      dom.addEventListener('click', props.onClick)
    }
    _.forEach(attrs, (v, k) => {
      dom.setAttribute(k, v)
    })
    children
      .filter(notEmptyNode)
      .forEach(child => {
        const childDom = createDomDeep(child)
        if (childDom) {
          dom.appendChild(childDom)
        }
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
  console.log(evaledNodes)
  mountTarget.innerHTML = ''
  mountTarget.append(dom)
}
