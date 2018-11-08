import _ from 'lodash'
import { getAttrs } from './dom/utils'

const eventMap = {
  onClick: 'click',
  onMouseDown: 'mousedown',
}

export const FLAGS = {
  TEXT: 'text',
  CLASS: 'class',
  FUNC: 'func',
  ELEMENT: 'element',
}

const isTextElement = element => {
  return !(element instanceof VNode)
}

let debugId = 0

class VNode {
  constructor({ type, props = {}, children = [], key, textContent }) {
    if (type) {
      this.type = type
      this.props = {
        // 这边的逻辑和 React 的一样
        ..._.omit(props, ['key', 'ref', '__source', '__self']),
        ...(children.length !== 0 && {
          children: children.length === 1 ? children[0] : children,
        }),
      }
      this.ref = props.ref
    }
    this.children = processChildren(children, undefined, this)

    // validate keys
    const keys = this.children.map(child => child.key)
    const uniqueKeys = _.union(keys)
    const print = arr => console.log(arr.sort().join(', '))
    if (keys.length !== uniqueKeys.length) {
      console.error('key should be unique!')
      print(uniqueKeys)
      print(keys)
    }

    this.key = key
    this.validated = false
    this.textContent = textContent
    this.parent = null
    this.flag = null
    this.dom = null
    this.attributes = null
    this.instance = null
    this._debugId = debugId
    debugId++
    if (typeof type === 'function') {
      this.rendered = null
    }
  }
}

// generate unique keys & flatten children
const processChildren = (children, keyPrefix = '__root_', parent) => {
  return children.reduce((output, childElement, idx) => {
    if (Array.isArray(childElement)) {
      return output.concat(
        processChildren(childElement, `${keyPrefix}${idx}_>`, parent)
      )
    }

    const generatedKey = '__gen_' + keyPrefix + idx

    if (isTextElement(childElement)) {
      const textVNode = createTextVNode(childElement, generatedKey)
      textVNode.parent = parent
      return [...output, textVNode]
    }

    childElement.parent = parent
    if (childElement.key === undefined) {
      childElement.key = generatedKey
    } else {
      childElement.key = keyPrefix + childElement.key
    }
    return [...output, childElement]
  }, [])
}

export const createVNode = (type, props, children) => {
  const node = new VNode({ type, props, children })
  if (typeof type === 'string') {
    node.flag = FLAGS.ELEMENT
    node.attributes = getAttrs(node.props)
    // 因为在每次 render 的时候都会创建新的 vNode，所以写成 getter 没什么意义
    // 只会使得性能变差
    const eventProps = _.pick(node.props, _.keys(eventMap))
    if (!_.isEmpty(eventProps)) {
      node.listeners = _.mapKeys(eventProps, (handler, key) => {
        return eventMap[key]
      })
    }
  } else if (type.$IS_CLASS) {
    node.flag = FLAGS.CLASS
  } else {
    node.flag = FLAGS.FUNC
  }
  return node
}

export const createTextVNode = (text, key) => {
  const node = new VNode({
    textContent: text,
    key,
  })
  node.flag = FLAGS.TEXT
  return node
}
