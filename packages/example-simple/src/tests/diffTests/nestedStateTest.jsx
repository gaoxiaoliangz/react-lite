import section from '../../section'

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
      const { count } = this.props
      const { clicks } = this.state
      return (
        <div>
          <button onClick={this.handleMinusClick}>-</button>
          {clicks + count}
          <button
            id="test-nested-state-2"
            onClick={() => {
              this.updateClicks(clicks + 1)
            }}
          >
            + (inline)
          </button>
          <button
            onClick={() => {
              console.log('clicked')
            }}
          >
            dummy
          </button>
        </div>
      )
    }
  }

  const Click = () => {
    return (
      <div>
        event test:{' '}
        <button
          onClick={() => {
            console.log('clicked')
          }}
        >
          click
        </button>
      </div>
    )
  }

  class Click2 extends React.Component {
    state = {}

    render() {
      return (
        <div>
          event test (class):{' '}
          <button
            onClick={() => {
              console.log('clicked')
              this.setState({})
            }}
          >
            click
          </button>
          {this.props.children}
        </div>
      )
    }
  }

  class Click3 extends React.Component {
    state = {}

    render() {
      return (
        <div>
          event test (class):{' '}
          <button
            onClick={() => {
              console.log('clicked')
              this.setState({})
            }}
          >
            click
          </button>
          {this.props.children}
        </div>
      )
    }
  }

  const DispCount = ({ count }) => (
    <div>count in DispCount component: {count}</div>
  )

  class NestedStateTest extends React.Component {
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
        <Section title="nested state test">
          <div>
            <button onClick={this.handleMinusClick}>-</button>
            <button onClick={() => this.updateClicks(clicks + 1)}>
              + (inline)
            </button>
            <div>{clicks}</div>
            <DispCount count={clicks} />
            <SetStateTest count={clicks} />
            <Click />
            <Click2>
              <Click3 />
            </Click2>
          </div>
        </Section>
      )
    }
  }
  return NestedStateTest
}
