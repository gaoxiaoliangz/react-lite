export default React => {
  class Click extends React.Component {
    state = {}

    render() {
      return (
        <div className="click">
          Click (Class Component):{' '}
          <button
            onClick={() => {
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
          <div>Comp (Class Component)</div>
          {this.props.children}
        </div>
      )
    }
  }

  const Comp2 = () => {
    return <div>Comp2 (Function Component)</div>
  }

  return class SetStateWithChildren extends React.Component {
    state = {
      clicks: 0,
    }

    render() {
      const { clicks } = this.state
      return (
        <div>
          <Click
            onCb={() => {
              this.setState({
                clicks: clicks + 1,
              })
            }}
          >
            <div>clicks: {clicks}</div>
            <Comp>
              <Comp />
            </Comp>
            <Comp2 />
          </Click>
        </div>
      )
    }
  }
}
