// @ts-check
import patch from './patch'

let stateId = 0

export const funcStates = new WeakMap()

export const reactState = {
  currentVNode: null,
  isCreatingState: null,
}

export const useState = initialState => {
  const currentVNode = reactState.currentVNode
  let currentState = initialState
  let cursor
  let store = funcStates.get(currentVNode)
  if (!store) {
    cursor = 0
    store = {
      cursor,
      states: [initialState],
      stateId,
    }
    stateId++
    funcStates.set(currentVNode, store)
  } else if (reactState.isCreatingState === true) {
    store.cursor++
    cursor = store.cursor
    store.states.push(initialState)
  } else {
    store.cursor++
    cursor = store.cursor
    currentState = store.states[cursor]
  }

  const setter = newState => {
    store.states[cursor] = newState
    reactState.currentVNode = currentVNode
    reactState.isCreatingState = false

    // reset cursor for the next render
    store.cursor = -1
    const rendered = currentVNode.type(currentVNode.props)
    patch(rendered, currentVNode.rendered)
    currentVNode.rendered = rendered
  }
  return [currentState, setter]
}
