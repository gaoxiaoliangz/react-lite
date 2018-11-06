export default class Component {
  constructor(props) {
    this.props = props
  }

  _setNotifier(notifier) {
    this._notifier = notifier
  }

  setState(state, cb) {
    this._notifier(state, cb)
  }
}

Component._isClass = true
