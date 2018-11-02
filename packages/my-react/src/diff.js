import _ from 'lodash'

// @ts-check
/**
 * #diff
 * @param {*} node
 * @param {*} prevNode
 */
//  * @returns {{attributeChanged, removed, added, textChanged, reordered}}
const diff = (node, prevNode, results = []) => {
  if (
    node.nodeType !== prevNode.nodeType ||
    (node.tagName && node.tagName !== prevNode.tagName)
  ) {
    return results.concat({
      removed: [prevNode],
      added: [node],
    })
  }

  switch (node.nodeType) {
    case -1: {
      return diff(node.childNodes[0], prevNode.childNodes[0], results)
    }

    case 1: {
      const patches = []
      if (!_.isEqual(node.attributes, prevNode.attributes)) {
        patches.push({
          attributeChanged: {
            node,
          },
        })
      }
      // @todo: diff childNodes
      return results.concat(patches)
    }

    case 3: {
      if (node.textContent !== prevNode.textContent) {
        return results.concat({
          textChanged: {
            node,
          },
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

export default diff
