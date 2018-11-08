export default React => {
  return class MultipleSetStateCalls extends React.Component {
    state = {
      clicks: 0,
      clicks2: 0,
    }

    render() {
      const { clicks, clicks2 } = this.state
      return (
        <div>
          clicks: {clicks}, clicks2: {clicks2}
          <button
            onClick={() => {
              this.setState({
                clicks: clicks + 1,
              })
            }}
          >
            update clicks
          </button>
          <button
            onClick={() => {
              this.setState({
                clicks: clicks + 1,
              })
              this.setState({
                clicks2: clicks2 + 1,
              })
            }}
          >
            update both
          </button>
        </div>
      )
    }
  }
}
