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
    }

    render() {
      const { clicks } = this.state
      return (
        <Section title="setState test">
          <div>
            <button onClick={() => this.updateClicks(clicks - 1)}>-</button>
            {clicks}
            <button onClick={() => this.updateClicks(clicks + 1)}>+</button>
          </div>
        </Section>
      )
    }
  }
  return SetStateTest
}
