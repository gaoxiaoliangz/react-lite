export default React => {
  class Click extends React.Component {
    state = {}

    render() {
      return (
        <div className="click">
          Click (Class Component):{' '}
          <button
            onClick={() => {
              // this.setState({})
              if (this.props.onCb) {
                this.props.onCb()
              }
            }}
          >
            plus 1
          </button>
          {this.props.children}
        </div>
      )
    }
  }

  class Comp extends React.Component {
    state = {}

    render() {
      return (
        <div className="Comp">
          Comp (Class Component), prop label:{' '}
          {this.props.label && <span>{this.props.label}</span>}
          {this.props.children}
        </div>
      )
    }
  }

  return class PropTest extends React.Component {
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
