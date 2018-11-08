export default React => {
  return class MutateState extends React.Component {
    state = {
      clicks: 0,
    }

    render() {
      const { clicks } = this.state
      return (
        <div>
          clicks: {clicks}
          <button
            onClick={() => {
              this.setState({
                clicks: clicks + 1,
              })
              this.state.clicks = clicks + 10 // eslint-disable-line
            }}
          >
            plus 1
          </button>
          <button
            onClick={() => {
              this.setState({})
            }}
          >
            force update
          </button>
        </div>
      )
    }
  }
}
