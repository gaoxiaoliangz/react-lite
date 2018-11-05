// @ts-check
import _ from 'lodash'
import { createNode } from './node'
import { TwoWayWeakMap, updateAttrs, getNodeIndex, removeNode } from './utils'
import { checkElement } from './element'

export const render = (reactElement, domNode) => {
  domNode.appendChild(createDOMFromNode(createNode(reactElement)))
}

export const applyPatch = patches => {
  console.log(patches)
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

  return dom
}

// componentDidMount 从最深的组件向上冒泡
// 目前的方式会在最深的组件都构建完成之后才 appendChild，这样在深组件 componentDidMount
// 里面获取父级的 dom 会获取不到
