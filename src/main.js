import _ from 'lodash'

class Main {
  static createElement(type, props, ...children) {
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
}

export default Main
