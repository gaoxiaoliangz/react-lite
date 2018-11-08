import patch from './patch'

export default class Component {
  constructor(props, context) {
    this.props = props
    this.$context = context
  }

  setState(state, cb) {
    setTimeout(() => {
      const oldState = this.state
      this.state = {
        ...oldState,
        ...state,
      }
      const rendered = this.render()
      patch(rendered, this.$context.vNode.rendered)
      this.$context.vNode.rendered = rendered
      if (cb) cb()
      if (this.componentDidUpdate) {
        this.componentDidUpdate(this.props, oldState)
      }
    })
  }
}

Component.$IS_CLASS = true
