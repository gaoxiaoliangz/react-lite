export default React => {
  class ReorderTextNodes2 extends React.Component {
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
          {showFirst ? ['0', '1', '2'] : ['1', '2']}
        </div>
      )
    }
  }
  return ReorderTextNodes2
}
