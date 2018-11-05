// @ts-check
import _ from 'lodash'
import { checkElement } from './element'

/**
 * #diff
 * @param {*} node
 * @param {*} prevNode
 * @returns {{type: 'added' | 'textChanged' | 'attributeChanged' | 'removed' | 'reordered', payload: any}[]}
 */
//  * @returns {{attributeChanged, removed, added, textChanged, reordered}}
const diff = (node, prevNode, results = []) => {
  if (
    node.nodeType !== prevNode.nodeType ||
    (node.tagName && node.tagName !== prevNode.tagName)
  ) {
    return results.concat([
      {
        type: 'removed',
        payload: prevNode,
      },
      {
        type: 'added',
        payload: node,
      },
    ])
  }

  switch (node.nodeType) {
    case -1: {
      // @todo
      return diff(node.childNodes[0], prevNode.childNodes[0], results)
    }

    case 1: {
      let patches = []
      if (!_.isEqual(node.attributes, prevNode.attributes)) {
        patches.push({
          type: 'attributeChanged',
          payload: node,
        })
      }
      patches = patches.concat(
        diffChildren(node.childNodes, prevNode.childNodes),
      )
      return results.concat(patches)
    }

    case 3: {
      if (node.textContent !== prevNode.textContent) {
        return results.concat({
          type: 'textChanged',
          payload: node,
        })
      }
      return results
    }

    default:
      console.error('oops...')
      break
  }

  return results
}

const diffChildren = (currentChildren, lastChildren) => {
  const lastNodeInUse = []
  let results = []
  currentChildren.forEach((currentNode, idx) => {
    const { key } = currentNode
    if (lastChildren[idx] && key === lastChildren[idx].key) {
      results = results.concat(diff(currentNode, lastChildren[idx]))
      lastNodeInUse.push(idx)
    } else {
      const match = lastChildren.find(child => child.key === key)
      if (match) {
        lastNodeInUse.push(lastChildren.indexOf(match))
        results = results.concat(diff(currentNode, match))
      } else {
        results.push({
          type: 'added',
          payload: currentNode,
        })
      }
    }
  })
  const removed = lastChildren
    .filter((child, idx) => !lastNodeInUse.includes(idx))
    .map(child => ({
      type: 'removed',
      payload: child,
    }))
  if (removed.length) {
    results = results.concat(removed)
  }
  return results
}

export default diff
