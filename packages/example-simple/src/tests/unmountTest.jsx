export default React => {
  class Comp extends React.Component {
    componentDidMount() {
      console.log('mount')
    }

    componentWillUnmount() {
      console.log('unmount')
    }

    render() {
      return <div>Comp</div>
    }
  }

  return class UnmountTest extends React.Component {
    state = {
      flag: true,
    }

    render() {
      const { flag } = this.state
      return (
        <div>
          show: {flag.toString()}
          <button
            onClick={() => {
              this.setState({
                flag: !flag,
              })
            }}
          >
            toggle flag
          </button>
          {flag && <Comp />}
        </div>
      )
    }
  }
}
