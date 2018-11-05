import section from '../../section'

export default React => {
  const Section = section(React)
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
        <Section title="reorder text nodes 2">
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
        </Section>
      )
    }
  }
  return ReorderTextNodes2
}
