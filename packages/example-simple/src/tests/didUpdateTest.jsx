export default React => {
  class Comp extends React.Component {
    componentDidUpdate(prevProps, prevState) {
      console.log('Comp', prevProps, prevState)
    }

    render() {
      return <div>Comp show: {this.props.flag.toString()}</div>
    }
  }

  return class DidUpdateTest extends React.Component {
    state = {
      flag: true,
    }

    componentDidUpdate(prevProps, prevState) {
      console.log('DidUpdateTest', prevProps, prevState)
    }

    render() {
      const { flag } = this.state
      return (
        <div>
          <button
            onClick={() => {
              this.setState({
                flag: !flag,
              })
            }}
          >
            toggle flag
          </button>
          <Comp flag={flag} />
        </div>
      )
    }
  }
}
