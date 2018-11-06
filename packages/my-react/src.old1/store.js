class NodeMap {
  constructor() {
    this._weakMap = new WeakMap()
    this._store = []
  }

  get(node) {
    return this._weakMap.get(node)
  }

  set(node, dom) {
    this._weakMap.set(node, dom)
    // @todo
    this._store.push({
      key: node,
      value: dom,
    })
  }
}

const createNodeMap = () => {
  return new NodeMap()
}

const nodeDOMMap = createNodeMap()
const nodeStateMap = createNodeMap()

export { nodeDOMMap, nodeStateMap }
