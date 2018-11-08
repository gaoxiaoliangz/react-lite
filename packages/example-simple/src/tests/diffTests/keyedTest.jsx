export default React => {
  class KeyedTest extends React.Component {
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
          {showFirst ? <section>0</section> : null}
          <section
            ref={ref => {
              this.item = ref
            }}
          >
            1
          </section>
          <section>2</section>
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
  return KeyedTest
}
