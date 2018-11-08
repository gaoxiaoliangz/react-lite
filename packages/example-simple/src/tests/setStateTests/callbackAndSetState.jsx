export default React => {
  let first = true

  class Click extends React.Component {
    state = {}

    render() {
      return (
        <div className="click">
          Click (Class Component):{' '}
          <button
            onClick={() => {
              this.setState({})
              if (this.props.onCb) {
                this.props.onCb()
              }
            }}
          >
            should remain green after clicking the button
          </button>
          {this.props.children}
        </div>
      )
    }
  }

  class Comp extends React.Component {
    state = {}

    componentDidMount() {
      if (first) {
        this.comp.setAttribute('class', 'green')
        first = false
      }
    }

    render() {
      return (
        <div
          ref={ref => {
            this.comp = ref
          }}
          className="Comp red"
        >
          Comp (Class Component), prop label:{' '}
          {this.props.label && <span>{this.props.label}</span>}
          {this.props.children}
        </div>
      )
    }
  }

  return class CallbackAndSetState extends React.Component {
    state = {
      testCbClicks: 0,
    }

    render() {
      const { testCbClicks } = this.state
      return (
        <div>
          <Click
            onCb={() => {
              this.setState({
                testCbClicks: testCbClicks + 1,
              })
            }}
          >
            <Comp label={testCbClicks} />
          </Click>
        </div>
      )
    }
  }
}
