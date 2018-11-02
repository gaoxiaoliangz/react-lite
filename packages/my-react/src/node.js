import { checkElement } from './element'
import { arrayGuard, getAttrs } from './utils'

const eventMap = {
  onClick: 'click',
  onMouseDown: 'mousedown',
}

export const createNode = reactElement => {
  const eleType = checkElement(reactElement)
  const { type, props, key } = reactElement || {}
  const _store = {
    element: reactElement,
  }
  let nodeType
  let tagName
  let attributes
  let listeners
  let textContent
  let childNodes = []

  switch (eleType) {
    case 'class': {
      nodeType = -1
      const instance = new type(props)
      childNodes = [createNode(instance.render())]
      break
    }

    case 'func': {
      nodeType = -1
      childNodes = [createNode(type(props))]
      break
    }

    case 'dom': {
      nodeType = 1
      childNodes = _.flattenDeep(arrayGuard(props.children)).map(
        childElement => {
          return createNode(childElement)
        }
      )
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
      const empty = [true, false, null]
      textContent = empty.includes(reactElement) ? '' : reactElement
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
    _store,
  }
}
