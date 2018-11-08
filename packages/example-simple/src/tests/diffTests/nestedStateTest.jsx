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
        <div className="SetStateTest">
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
      <div className="click">
        event test click:{' '}
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
        <div className="click2">
          event test click2 (class):{' '}
          <button
            onClick={() => {
              // this.setState({})
              if (this.props.onCb) {
                this.props.onCb()
              }
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
        <div className="click3">
          event test click3 (class):
          {this.props.label && <span>from prop: {this.props.label}</span>}{' '}
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
      testCbClicks: 0,
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

    // componentDidMount() {
    //   if (this.$context) console.log(this.$context.vNode)
    // }

    render() {
      const { clicks, testCbClicks } = this.state
      return (
        <Section title="nested state test">
          <div>
            <button onClick={this.handleMinusClick}>-</button>
            <button onClick={() => this.updateClicks(clicks + 1)}>
              + (inline)
            </button>
            <button
              onClick={() => {
                this.setState({
                  clicks: clicks + 1,
                  testCbClicks: testCbClicks + 1,
                })
              }}
            >
              update clicks
            </button>
            <button
              onClick={() => {
                this.setState({
                  testCbClicks: testCbClicks + 1,
                })
              }}
            >
              update testCbClicks
            </button>
            <div>clicks: {clicks}</div>
            <div>testCbClicks: {testCbClicks}</div>
            {/* <DispCount count={clicks} /> */}
            {/* <SetStateTest count={clicks} /> */}
            {/* <Click /> */}
            {/* <Click2>
              <Click3 />
            </Click2>
            <Click2>
              <Click2 />
            </Click2> */}
            {/* <Click2
              onCb={() => {
                this.setState({
                  testCbClicks: testCbClicks + 1,
                })
              }}
            >
              <Click3 label={testCbClicks} />
            </Click2> */}
          </div>
        </Section>
      )
    }
  }
  return NestedStateTest
}
