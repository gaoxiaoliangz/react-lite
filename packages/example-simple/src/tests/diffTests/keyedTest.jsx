import section from '../../section'

export default React => {
  const Section = section(React)
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
        <Section title="keyed test">
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
        </Section>
      )
    }
  }
  return KeyedTest
}
