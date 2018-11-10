// @ts-check
import _ from 'lodash'
import { getAttrs } from './dom/utils'
import { REACT_EVENT_MAP, REACT_EVENT_KEYS } from './dom/event'

export const FLAGS = {
  TEXT: 'text',
  CLASS: 'class',
  FUNC: 'func',
  ELEMENT: 'element',
}

const TEXT_VNODE_TYPE = Symbol('text_vnode_type')

const isTextElement = element => {
  return !(element instanceof VNode)
}

let debugId = 0

class VNode {
  /**
   * @param {{ type?, props?, textContent?, key?, flag }} config
   */
  constructor({ type, props, key, textContent, flag }) {
    this.type = type
    this.flag = flag
    this._debugId = debugId
    this.props = props
    this.textContent = textContent
    this.key = key
    this.children = []
    this.ref = null
    this.validated = false
    this.parent = null
    this.dom = null
    this.listeners = null
    this.attributes = null
    this.rendered = null
    this.instance = null
  }
}

// generate unique keys & flatten children
const processChildren = (children, keyPrefix = '__root_', parent) => {
  return (Array.isArray(children) ? children : [children]).reduce(
    (output, childElement, idx) => {
      if (Array.isArray(childElement)) {
        return output.concat(
          processChildren(childElement, `${keyPrefix}${idx}_>`, parent),
        )
      }

      const generatedKey = '__gen_' + keyPrefix + idx

      if (isTextElement(childElement)) {
        const textVNode = createVNode(TEXT_VNODE_TYPE, {
          textContent: childElement,
          key: generatedKey,
        })
        textVNode.parent = parent
        return [...output, textVNode]
      }

      childElement.parent = parent
      if (childElement.key === null) {
        childElement.key = generatedKey
      } else {
        childElement.key = keyPrefix + childElement.key
      }
      return [...output, childElement]
    },
    [],
  )
}

export const createVNode = (type, allProps = {}) => {
  let vNode
  const props = _.omit(allProps, ['key', 'ref', '__source', '__self'])
  if (typeof type === 'string') {
    vNode = createElementVNode(type, props)
  } else if (type.$IS_CLASS) {
    vNode = createClassVNode(type, props)
  } else if (typeof type === 'function') {
    vNode = createFunctionVNode(type, props)
    if (allProps.ref) {
      console.error(
        'Function components cannot be given refs. Attempts to access this ref will fail.',
      )
    }
  } else if (type === TEXT_VNODE_TYPE) {
    vNode = createTextVNode(props.textContent)
  } else {
    throw new Error(`Unknown type: ${type}`)
  }
  vNode.key = allProps.key === undefined ? null : allProps.key
  vNode.ref = allProps.ref || null

  if (vNode.key !== null) {
    Object.defineProperty(props, 'key', {
      configurable: false,
      enumerable: false,
      get() {
        console.error(
          '`key` is not a prop. Trying to access it will result in `undefined` being returned',
        )
      },
    })
  }

  if (vNode.ref !== null) {
    Object.defineProperty(props, 'ref', {
      configurable: false,
      enumerable: false,
      get() {
        console.error(
          '`ref` is not a prop. Trying to access it will result in `undefined` being returned',
        )
      },
    })
  }

  vNode.children =
    props.children === undefined
      ? []
      : processChildren(props.children, undefined, vNode)

  // validate keys
  const keys = vNode.children.map(child => child.key)
  const uniqueKeys = _.union(keys)
  const print = arr => console.error(arr.sort().join(', '))
  if (keys.length !== uniqueKeys.length) {
    console.error('key should be unique!')
    print(uniqueKeys)
    print(keys)
  }

  debugId++
  return vNode
}

const createTextVNode = text => {
  const vNode = new VNode({
    textContent: text,
    flag: FLAGS.TEXT,
  })
  return vNode
}

const createFunctionVNode = (type, props) => {
  const vNode = new VNode({
    type,
    props,
    flag: FLAGS.FUNC,
  })
  return vNode
}

const createClassVNode = (type, props) => {
  const vNode = new VNode({
    type,
    props,
    flag: FLAGS.CLASS,
  })
  return vNode
}

const createElementVNode = (type, props) => {
  let finalProps = props
  let listeners = null
  let attributes = null
  const eventProps = _.pick(finalProps, REACT_EVENT_KEYS)
  if (!_.isEmpty(eventProps)) {
    listeners = _.reduce(
      eventProps,
      (listeners, handler, key) => {
        const match = REACT_EVENT_MAP[key]
        return {
          ...listeners,
          [match.key]: {
            handler,
            useCapture: match.useCapture,
          },
        }
      },
      {},
    )
    finalProps = _.omit(finalProps, _.keys(eventProps))
  }
  attributes = getAttrs(finalProps)
  const vNode = new VNode({
    type,
    props: finalProps,
    flag: FLAGS.ELEMENT,
  })
  vNode.listeners = listeners
  vNode.attributes = attributes
  return vNode
}
