import _ from 'lodash'

export function getAttrs(props) {
  return _.flow(
    _.curryRight(_.omitBy)((v, k) => ['children'].includes(k)),
    _.curryRight(_.mapKeys)((v, k) => {
      if (k === 'className') {
        return 'class'
      }
      return k
    })
  )(props)
}

export function updateAttrs(dom, attrsObject) {
  _.forEach(attrsObject, (v, k) => {
    dom.setAttribute(k, v)
  })
}

export function getNodeIndex(node) {
  const parent = node.parentNode
  for (let index = 0; parent.childNodes.length > index; index++) {
    if (node === parent.childNodes[index]) {
      return index
    }
  }
  return -1
}
