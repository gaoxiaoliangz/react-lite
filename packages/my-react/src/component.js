import patch from './patch'

export default class Component {
  constructor(props) {
    this.props = props
    this.state = null
  }

  setState(state, cb) {
    setTimeout(() => {
      const prevState = this.state
      const prevProps = this.props
      this.state = {
        ...prevState,
        ...state,
      }
      const rendered = this.render()
      patch(rendered, this._vNode.rendered)
      this._vNode.rendered = rendered
      if (cb) cb()
      if (this.componentDidUpdate) {
        this.componentDidUpdate(prevProps, prevState)
      }
    })
  }
}

Component.$IS_CLASS = true
