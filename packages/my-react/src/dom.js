// @ts-check
import _ from 'lodash'
import { createNode } from './node'
import { TwoWayWeakMap, updateAttrs, getNodeIndex, removeNode } from './utils'
import { checkElement } from './element'
// node -> DOM
import { nodeDOMMap } from './store'

export const render = (reactElement, domNode) => {
  domNode.appendChild(createDOMFromNode(createNode(reactElement)))
}

export const applyPatches = patches => {
  console.log(patches)
  patches.forEach(applyPatch)
}

const applyPatch = patch => {
  const { type, payload } = patch
  switch (type) {
    case 'added': {
      const { node, parentNode, previousSiblingNode } = payload
      const dom = createDOMFromNode(node)
      const parentDOM = nodeDOMMap.get(parentNode)
      const siblingDOM = previousSiblingNode
        ? nodeDOMMap.get(previousSiblingNode).nextSibling
        : parentDOM.childNodes[0]
      parentDOM.insertBefore(dom, siblingDOM)
      break
    }
    case 'textChanged': {
      console.log('todo')
      break
    }
    case 'attributeChanged': {
      console.log('todo')
      break
    }
    case 'removed': {
      const dom = nodeDOMMap.get(payload)
      dom.parentNode.removeChild(dom)
      // @todo call lifecycle
      break
    }
    case 'reordered': {
      console.log('todo')
      break
    }
    default:
      console.error(`Unknown type: ${type}`)
      break
  }
}

const createDOMFromNode = node => {
  const {
    nodeType,
    attributes,
    listeners,
    tagName,
    textContent,
    childNodes,
    ref,
  } = node
  let dom
  switch (nodeType) {
    case -1: {
      // @todo: reactFragment
      dom = createDOMFromNode(childNodes[0])
      break
    }

    case 1: {
      dom = document.createElement(tagName)
      if (ref) {
        ref(dom)
      }
      updateAttrs(dom, attributes)
      _.forEach(listeners, (handler, key) => {
        dom.addEventListener(key, handler)
      })
      break
    }

    case 3: {
      dom = document.createTextNode(textContent)
      break
    }

    default:
      throw new Error(`Unknown nodeType ${nodeType}!`)
  }
  if (nodeType !== -1) {
    childNodes.forEach(childNode => {
      dom.appendChild(createDOMFromNode(childNode))
      const { element, instance } = childNode._store
      if (checkElement(element) === 'class') {
        if (instance.componentDidMount) {
          instance.componentDidMount()
        }
      }
    })
  }
  nodeDOMMap.set(node, dom)

  return dom
}

// componentDidMount 从最深的组件向上冒泡
// 目前的方式会在最深的组件都构建完成之后才 appendChild，这样在深组件 componentDidMount
// 里面获取父级的 dom 会获取不到
