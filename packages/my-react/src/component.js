export default class Component {
  constructor(props, context) {
    this.props = props
    this.$context = context
  }

  setState(state, cb) {
    setTimeout(() => {
      this.state = {
        ...this.state,
        ...state,
      }
      const rendered = this.render()
      const newVNode = createVNodeFromElement(rendered)
      patch(newVNode, this.$context.vNode)
    })
  }
}

Component.$IS_CLASS = true
