// @ts-check
import _ from 'lodash'
import { createNode } from './node'
import { TwoWayWeakMap, updateAttrs, getNodeIndex, removeNode } from './utils'

export const render = (reactElement, domNode) => {
  domNode.appendChild(createDOMFromNode(createNode(reactElement)))
}

export const applyPatch = ({ attributeChanged }) => {
  console.log('patch applied')
}

const createDOMFromNode = node => {
  const {
    nodeType,
    attributes,
    listeners,
    tagName,
    textContent,
    childNodes,
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
    childNodes.forEach(child => {
      dom.appendChild(createDOMFromNode(child))
    })
  }

  return dom
}

// componentDidMount 从最深的组件向上冒泡
// 目前的方式会在最深的组件都构建完成之后才 appendChild，这样在深组件 componentDidMount
// 里面获取父级的 dom 会获取不到
