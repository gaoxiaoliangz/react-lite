export default React => {
  return class UpdateAttrs extends React.Component {
    state = {
      flag: false,
    }

    render() {
      const { flag } = this.state
      return (
        <div>
          flag: {flag.toString()}
          <button
            onClick={() => {
              this.setState({
                flag: !flag,
              })
            }}
          >
            toggle flag
          </button>
          <div data-test="test" className={flag ? 'green' : 'red'}>text</div>
        </div>
      )
    }
  }
}
