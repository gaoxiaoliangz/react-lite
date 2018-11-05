import section from '../../section'

export default React => {
  const Section = section(React)
  class UnkeyedTest extends React.Component {
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
      return (
        <Section title="unkeyed test">
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
          {showFirst ? (
            <div>
              <div>0</div>
              <div>1</div>
              <div>2</div>
            </div>
          ) : (
            <div>
              <div ref={ref => (this.item = ref)}>1</div>
              <div>2</div>
            </div>
          )}
        </Section>
      )
    }
  }
  return UnkeyedTest
}
