const patchClassComponent = (vNode, prevNode, parentDOM) => {
  // if () 
   
}

const patch = (vNode, prevNode, parentDOM) => {
  const vNode = createVNodeFromElement(element)
  const { flag, type } = vNode

  switch (flag) {
    case 'class':
      if (prevNode.flag === 'class' && type === prevNode.type) {
        patchClassComponent(vNode, prevNode, parentDOM)
      } else {
        unmountClassComponent(prevNode)
        mountClassComponent(vNode)
      }
      break

    case 'func':
      mountFunctionComponent(vNode, parentDOM)
      break
    case 'element':

    case 'text':

    default:
      break
  }
}

const patchChildren = (currentChildren, prevChildren, parentDOM) => {

}

export default patch
