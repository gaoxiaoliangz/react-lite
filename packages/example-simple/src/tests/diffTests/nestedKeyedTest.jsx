export default React => {
  class NestedKeyedTest extends React.Component {
    state = {
      showFirst: false,
    }

    componentDidMount() {
      this.item.setAttribute('class', 'green')
    }

    updateClicks = clicks => {
      this.setState({
        clicks,
      })
    }

    render() {
      const { showFirst } = this.state
      const stuff = (
        <div>
          {showFirst ? (
            <div>
              <div>
                <div>0</div>
              </div>
            </div>
          ) : null}
          <div>
            <div>
              <div
                ref={ref => {
                  this.item = ref
                }}
              >
                1
              </div>
            </div>
          </div>
          <div>
            <div>
              <div>2</div>
            </div>
          </div>
        </div>
      )
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
          {stuff}
        </div>
      )
    }
  }
  return NestedKeyedTest
}
