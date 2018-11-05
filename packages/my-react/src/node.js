// @ts-check
import _ from 'lodash'
import { checkElement } from './element'
import { arrayGuard, getAttrs } from './utils'
import diff from './diff'
import { applyPatch } from './dom'

const eventMap = {
  onClick: 'click',
  onMouseDown: 'mousedown',
}

const processChildren = (children, createNode, prefix = '__root_') => {
  let output = []
  const childrenArr = arrayGuard(children)

  childrenArr.forEach((childElement, idx) => {
    if (Array.isArray(childElement)) {
      output = output.concat(
        processChildren(childElement, createNode, `${prefix}${idx}_>`),
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
      output.push(createNode(childElement, key))
    }
  })
  return output
}

export const createNode = (reactElement, key) => {
  const eleType = checkElement(reactElement)
  // @ts-ignore
  const { type, props, key: _key } = reactElement || {}
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

  switch (eleType) {
    case 'class': {
      nodeType = -1
      const instance = new type(props)
      instance._setNotifier((state, cb) => {
        // @ts-ignore
        setImmediate(() => {
          // render with new state
          const prevState = instance.state
          const prevProps = props
          instance.state = {
            ...prevState,
            ...state,
          }
          const newNode = createNode(instance.render())

          // diff rendered node with previous node
          const diffResult = diff(newNode, node)

          // patch dom with diffs
          applyPatch(diffResult)

          // componentDidUpdate
          if (instance.componentDidUpdate) {
            instance.componentDidUpdate(prevProps, prevState)
          }

          // everything is done, lets callback
          if (cb) cb()
        })
      })
      const node = createNode(instance.render())
      childNodes = [node]
      break
    }

    case 'func': {
      nodeType = -1
      childNodes = [createNode(type(props))]
      break
    }

    case 'dom': {
      nodeType = 1
      const processedChildren = processChildren(props.children, createNode)
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
      listeners = _.mapKeys(eventProps, (handler, key) => {
        return eventMap[key]
      })

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

  return {
    nodeType,
    tagName,
    textContent,
    attributes,
    childNodes,
    listeners,
    key: finalKey,
    _store,
  }
}
