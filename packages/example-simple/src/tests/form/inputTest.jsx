export default React => {
  return class InputTest extends React.Component {
    state = {
      input: '',
    }

    render() {
      const { input } = this.state
      return (
        <div>
          <button
            onClick={() => {
              this.setState({
                input: 'input',
              })
            }}
          >
            set input to: input
          </button>
          <button
            onClick={() => {
              console.log('input:', input)
            }}
          >
            get input
          </button>
          <div>
            <input
              id="test-input-01"
              value={input}
              onInput={e => {
                this.setState({
                  input: e.target.value,
                })
              }}
              onChange={e => {
                this.setState({
                  input: e.target.value,
                })
              }}
            />
          </div>
          <div>
            controlled input
            <input
              id="test-input-02"
              value={input}
              onInput={e => {}}
              onChange={e => {}}
            />
          </div>
        </div>
      )
    }
  }
}
