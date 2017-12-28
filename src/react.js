import _ from 'lodash'

export function createElement(type, props, ...children) {
  const { key } = props || {}

  return {
    type,
    props: {
      ..._.omit(props, ['key']),
      children: children.length === 1 ? children[0] : children
    },
    key,
  }
}

export class Component {
  constructor(props) {
    this.props = props
  }

  setState(state, cb) {
    this.state = state
    console.log('setstate', state)
    if (cb) cb()
  }
}

Component.__type = 'class-component'

export default {
  createElement,
  Component
}
