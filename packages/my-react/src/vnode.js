// @ts-check
import _ from 'lodash'
import { getAttrs } from './dom/utils'
import { eventMap, eventProps } from './dom/event'

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
    let flag
    let attributes
    let finalProps = props
    let finalListeners

    if (type) {
      this.type = type
      finalProps = {
        // 这边的逻辑和 React 的一样
        ..._.omit(props, ['key', 'ref', '__source', '__self']),
        ...(children.length !== 0 && {
          children: children.length === 1 ? children[0] : children,
        }),
      }

      if (typeof type === 'string') {
        flag = FLAGS.ELEMENT
        // 因为在每次 render 的时候都会创建新的 vNode，所以写成 getter 没什么意义
        // 只会使得性能变差
        const pickedEventProps = _.pick(finalProps, eventProps)
        if (!_.isEmpty(pickedEventProps)) {
          finalListeners = _.reduce(
            pickedEventProps,
            (listeners, handler, key) => {
              const match = eventMap[key]
              return {
                ...listeners,
                [match.key]: {
                  handler,
                  useCapture: match.useCapture,
                },
              }
            },
            {}
          )
          finalProps = _.omit(finalProps, _.keys(pickedEventProps))
        }
        attributes = getAttrs(finalProps)
      } else if (type.$IS_CLASS) {
        flag = FLAGS.CLASS
      } else {
        flag = FLAGS.FUNC
      }
      this.ref = props.ref
    } else {
      flag = FLAGS.TEXT
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

    this.flag = flag
    this.key = key || props.key
    this.props = finalProps
    this._debugId = debugId
    this.validated = false
    this.parent = null
    this.dom = null

    if (typeof type === 'function') {
      this.rendered = null
    }
    if (flag === FLAGS.CLASS) {
      this.instance = null
    }
    if (flag === FLAGS.TEXT) {
      this.textContent = textContent
    }
    if (flag === FLAGS.ELEMENT) {
      this.attributes = attributes
      this.listeners = finalListeners
    }
    debugId++
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
  // @ts-ignore
  return new VNode({ type, props, children })
}

export const createTextVNode = (text, key) => {
  // @ts-ignore
  return new VNode({
    textContent: text,
    key,
  })
}
