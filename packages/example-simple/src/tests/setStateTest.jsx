import section from '../section'

export default React => {
  const Section = section(React)
  class SetStateTest extends React.Component {
    state = {
      clicks: 0,
    }

    updateClicks = clicks => {
      this.setState({
        clicks,
      })
      if (clicks === this.state.clicks) {
        console.error('setState should be async!', clicks, this.state.clicks)
      }
    }

    handleMinusClick = () => {
      this.updateClicks(this.state.clicks - 1)
    }

    render() {
      const { clicks } = this.state
      return (
        <Section title="setState test">
          <div>
            <button onClick={this.handleMinusClick}>-</button>
            {clicks}
            <button onClick={() => this.updateClicks(clicks + 1)}>
              + (inline)
            </button>
          </div>
        </Section>
      )
    }
  }
  return SetStateTest
}
