export default React => {
  class ReorderTextNodes extends React.Component {
    state = {
      showFirst: false,
    }

    updateClicks = clicks => {
      this.setState({
        clicks,
      })
    }

    render() {
      const { showFirst } = this.state
      return (
        <div>
          <div>
            <button
              onClick={() => {
                this.setState({
                  showFirst: !showFirst,
                })
              }}
            >
              toggle first
            </button>
          </div>
          <div className="texts">
            {showFirst && '0'}
            {'1'}
            {'2'}
          </div>
        </div>
      )
    }
  }
  return ReorderTextNodes
}
