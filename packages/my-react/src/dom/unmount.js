const unmount = (vNode) => {
  vNode.dom.parentNode.removeChild(vNode.dom)
  // @todo lifecycle
}

export default unmount
