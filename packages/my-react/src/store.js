class NodeMap {
  constructor() {
    this._weakMap = new WeakMap()
  }

  get(node) {
    return this._weakMap.get(node)
  }

  set(node, dom) {
    this._weakMap.set(node, dom)
  }
}

const createNodeMap = () => {
  return new NodeMap()
}

const nodeDOMMap = createNodeMap()
const nodeStateMap = createNodeMap()

export { nodeDOMMap, nodeStateMap }
