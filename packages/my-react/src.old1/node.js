// @ts-check
import _ from 'lodash'
import { checkElement } from './element'
import { arrayGuard, getAttrs } from './utils'
import diff from './diff'
import { applyPatches, removeNodeListeners, addNodeListeners } from './dom'
import { nodeDOMMap } from './store'

const eventMap = {
  onClick: 'click',
  onMouseDown: 'mousedown',
}

const processChildren = (
  children,
  createNode,
  prefix = '__root_',
  parentNode
) => {
  let output = []
  const childrenArr = arrayGuard(children)

  childrenArr.forEach((childElement, idx) => {
    if (Array.isArray(childElement)) {
      output = output.concat(
        processChildren(
          childElement,
          createNode,
          `${prefix}${idx}_>`,
          parentNode
        )
      )
    } else {
      let key
      if (
        checkElement(childElement) !== 'text' &&
        childElement.key !== undefined
      ) {
        key = prefix + childElement.key
      } else {
        key = '__gen_' + prefix + idx
      }
      output.push(createNode(childElement, key, parentNode))
    }
  })
  return output
}

const handleStateChange = ({ prevNode, state, callback }) => {
  // before render
  // remove all listeners
  removeNodeListeners(prevNode)

  // @ts-ignore
  setImmediate(() => {
    // render with new state
    const prevState = instance.state
    const prevProps = props
    instance.state = {
      ...prevState,
      ...state,
    }
    const newInnerNode = createNode(instance.render(), null, node)

    // diff rendered node with previous node
    const diffResult = diff(newInnerNode, innerNode)
    innerNode = newInnerNode

    // patch dom with diffs
    applyPatches(diffResult)
    // @todo
    // add new nodes & clean up old nodes

    // update listeners
    addNodeListeners(newInnerNode)

    // componentDidUpdate
    if (instance.componentDidUpdate) {
      instance.componentDidUpdate(prevProps, prevState)
    }

    // everything is done, lets callback
    callback()
  })
}

export const createNode = (reactElement, { key, parentNode }) => {
  const eleType = checkElement(reactElement)
  // @ts-ignore
  const { type, props, key: _key, ref } = reactElement || {}
  const _store = {
    element: reactElement,
  }
  let nodeType
  let tagName
  let attributes
  let listeners
  let textContent
  let childNodes = []
  let finalKey = key || _key
  let classInstance
  const node = {
    parentNode,
  }

  switch (eleType) {
    case 'class': {
      nodeType = -1
      // @todo handle instance
      classInstance = new type(props)
      classInstance._setNotifier((state, cb) => {
        handleStateChange({
          prevNode: innerNode,
          state,
          callback: cb,
        })
      })
      let innerNode = createNode(instance.render(), {
        key: null,
        parentNode: node,
      })
      childNodes = [innerNode]
      break
    }

    case 'func': {
      nodeType = -1
      childNodes = [createNode(type(props), { key: null, parentNode: node })]
      break
    }

    case 'dom': {
      nodeType = 1
      const processedChildren = processChildren(
        props.children,
        createNode,
        undefined,
        node
      )
      childNodes = processedChildren

      // validate keys
      const keys = processedChildren.map(child => child.key)
      const uniqueKeys = _.union(keys)
      const print = arr => console.log(arr.sort().join(', '))
      // print(uniqueKeys)
      if (keys.length !== uniqueKeys.length) {
        console.log('key should be unique!')
        print(uniqueKeys)
        print(keys)
      }

      tagName = type
      attributes = getAttrs(props)
      const eventProps = _.pick(props, _.keys(eventMap))
      if (!_.isEmpty(eventProps)) {
        listeners = _.mapKeys(eventProps, (handler, key) => {
          return eventMap[key]
        })
      }

      break
    }

    case 'text': {
      nodeType = 3
      const type = typeof reactElement
      textContent = type === 'number' || type === 'string' ? reactElement : ''
      break
    }

    default:
      throw new Error(`Unknown eleType ${eleType}!`)
  }

  return Object.assign(node, {
    ref,
    nodeType,
    tagName,
    textContent,
    attributes,
    childNodes,
    listeners,
    key: finalKey,
    // @todo
    // _store,
    classInstance,
    element: reactElement,
    mounted: false,
    dom: null,
  })
}
