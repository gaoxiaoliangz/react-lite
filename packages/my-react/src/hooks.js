let cursor = 0
const states = []

export const useState = (initialState) => {
  states.push(initialState)
  const state = states[cursor]
  const setter = newState => {
    states[cursor] = newState
    // trigger view update
  }
  cursor++
  return [state, setter]
}
