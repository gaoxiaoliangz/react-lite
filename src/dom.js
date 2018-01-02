import _ from 'lodash'
import {
  isClassComponent,
  isVnodeObject,
  arrayGuard,
  IterableWeakMap,
  getAttrs,
  notEmptyNode,
  isTextVnode,
  updateAttrs
} from './utils'

/**
 * an example of cached render object
 * { evaled: { type, props, key }, instance, $ref }
 */
const cachedEvals = new IterableWeakMap()

export function render(vnode2, $mountTarget2) {
  if ($mountTarget2) {
    // clear root
    $mountTarget2.innerHTML = ''
  }

  const _render = (vnode, $mountTarget) => {
    if (isTextVnode(vnode)) {
      const textNode = document.createTextNode(vnode.toString())
      return textNode
    }

    const { type, props } = vnode
    if (typeof type === 'string') {
      const $fragment = document.createElement(type)
      const children = _.flattenDeep(arrayGuard(props.children))
      // TODO: support more events
      // if (oldProps.onClick) {
      //   element.removeEventListener('click', oldProps.onClick)
      // }
      if (props.onClick) {
        $fragment.addEventListener('click', props.onClick)
      }
      updateAttrs($fragment, getAttrs(props))
      children
        .filter(notEmptyNode)
        .forEach(child => {
          const $child = _render(child, $fragment)
          if ($child.nodeType === 3) {
            // mount text node
            $fragment.appendChild($child)
          }
        })
      // mount element
      $mountTarget.appendChild($fragment)
      return $fragment
    }
    if (typeof type === 'function') {
      const evaled = cachedEvals.get(vnode) || evalVnode(vnode)
      const $dom = _render(evaled.evaled, $mountTarget)
      evaled.$ref = $dom
      return $dom
    }
    console.warn('render: Invalid type found', type)
    return
  }

  _render(vnode2, $mountTarget2)

  // if (children.length === oldChildren.length) {
  //   // assume children have the same order and array of elements all have a valid key
  //   if (props.children) {
  //     children.forEach((child, index) => {
  //       const oldChild = oldChildren[index]
  //       // update text node
  //       if (!isVdomObject(child)) {
  //         console.log(children, oldChildren)
  //         if (child !== oldChild) {
  //           element.childNodes[index].textContent = child
  //         }
  //         return
  //       }
  //       // update non-text node
  //       const { type } = child
  //       if (type !== oldChild.type) {
  //         // TODO
  //         // element.childNodes[index] = evalVdomDeep(child)
  //         return
  //       }
  //       render(element.childNodes[index], child, oldChild)
  //     })
  //   }
  //   return
  // }
  // console.log('TODO: update children of diff len')
}

function handleSetState(vnode) {
  return () => {
    /**
     * THE MAGIC HAPPENS HERE TM
     */
    const cached = cachedEvals.get(vnode)
    const newEvaled = {
      ...cached,
      evaled: cached.instance.render()
    }
    // TODO
    render(newEvaled, cached.$ref)
  }
}

/**
 * @param {Object} vnode
 * @param {String | Function} vnode.type
 * @param {String | Number} vnode.key
 * @param {Object} vnode.props
 * @param {{} | [] | String} vnode.props.children
 */
function evalVnode(vnode) {
  const { type, props } = vnode
  if (typeof type !== 'function') {
    return vnode
  }
  if (isClassComponent(type)) {
    const cached = cachedEvals.get(vnode)
    const instance = cached
      ? cached.instance
      : new type(props)
    if (cached) {
      // update existing instance props
      instance.props = props
    } else {
      // we only have to register wather once
      instance.setWatcher(handleSetState(vnode))
    }
    const evaled = instance.render()
    const newCache = {
      ...cached,
      evaled,
      instance,
    }
    cachedEvals.set(vnode, newCache)
    return newCache
  }
  const evaled = vnode.type(vnode.props)
  const newCache = { evaled }
  cachedEvals.set(vnode, newCache)
  return newCache
}
