export const CLASS_COMPONENT_TYPE = 'class-component'

export default class Component {
  constructor(props) {
    this.props = props
  }

  setWatcher(cb) {
    this.watcherCb = cb
  }

  setState(state, cb) {
    this.state = state
    console.info('setState', state)
    this.watcherCb()
    if (cb) {
      cb()
    }
  }
}

Component.type = CLASS_COMPONENT_TYPE
