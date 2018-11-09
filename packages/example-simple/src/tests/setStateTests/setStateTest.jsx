import invariant from 'invariant'

export default React => {
  class SetStateTest extends React.Component {
    state = {
      clicks: 0,
    }

    updateClicks = clicks => {
      this.setState({
        clicks,
      })
      invariant(clicks !== this.state.clicks, 'setState should be async!')
    }

    handleAddClick = () => {
      this.updateClicks(this.state.clicks + 1)
    }

    render() {
      const { clicks } = this.state
      return (
        <div>
          clicks: {clicks}
          <button onClick={this.handleAddClick}>plus 1</button>
          <button onClick={() => this.updateClicks(clicks + 1)}>
            plus 1 (inline func)
          </button>
        </div>
      )
    }
  }
  return SetStateTest
}
