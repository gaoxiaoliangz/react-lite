import _ from 'lodash'
import { isVnodeObject } from './utils';

export function createElement(type, props, ...children) {
  const { key } = props || {}

  // a simple validation (key validation to be specific)
  children.forEach(child => {
    if (Array.isArray(child)) {
      const keys = child.filter(isVnodeObject).map(v => v.key)
      if (keys.length !== _.union(keys).length) {
        // TODO: show exactly which key
        console.warn('Encountered two children with the same key')
      }
      if (keys.length !== keys.filter(key => typeof key !== 'undefined').length) {
        // TODO: print component trace
        console.warn('Each child in an array or iterator should have a unique "key" prop.')
      }
    }
  })

  return {
    type,
    props: {
      ..._.omit(props, ['key']),
      ...children.length !== 0 && {
        children: children.length === 1 ? children[0] : children
      }
    },
    key,
  }
}

export class Component {
  constructor(props) {
    this.props = props
  }

  setWatcher(cb) {
    this.watcherCb = cb
  }

  setState(state, cb) {
    this.state = state
    console.info('setState', state)
    this.watcherCb()
    if (cb) cb()
  }
}

Component.__type = 'class-component'

export default {
  createElement,
  Component
}
