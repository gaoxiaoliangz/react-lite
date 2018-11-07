import _ from 'lodash'

export function getAttrs(props) {
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

export function updateAttrs(dom, attrsObject) {
  _.forEach(attrsObject, (v, k) => {
    dom.setAttribute(k, v)
  })
}
