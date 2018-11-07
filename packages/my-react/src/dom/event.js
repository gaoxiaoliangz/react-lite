export const addListeners = (dom, listeners = {}) => {
  _.forEach(listeners, (handler, key) => {
    dom.addEventListener(key, handler)
  })
}

export const removeListeners = (dom, listeners = {}) => {
  _.forEach(listeners, (handler, key) => {
    dom.removeEventListener(key, handler)
  })
}
