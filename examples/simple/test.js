import _ from 'lodash'

export default (React, Component, isFb = false) => {
  const container = () => {

    const Button = (props) => {
      return (
        <div className="btn" onClick={props.onClick}>
          <button>{props.children}</button>
        </div>
      )
    }

    const TestContainer = ({ desc, children }) => {
      return (
        <div className="test-container">
          <h3>{desc}</h3>
          {children}
        </div>
      )
    }

    class ClickCounter extends Component {
      constructor(props) {
        super(props)
        this.state = {
          clicked: 0
        }
      }

      add(step) {
        return () => {
          this.setState({
            clicked: this.state.clicked + step
          })
        }
      }

      render() {
        return (
          <div onClick={this.add(1)}>
            <p>clicked: {this.state.clicked}</p>
            <p>Click div to update num</p>
          </div>
        )
      }
    }

    const Test1 = () => {
      return (
        <TestContainer desc="Should render number correctly">
          <ul>
            {_.times(5).map(n => <li key={n}>{n}</li>)}
          </ul>
        </TestContainer>
      )
    }

    class Test2 extends Component {
      constructor(props) {
        super(props)
        this.state = {
          clicked: 0
        }
      }

      add(step) {
        return () => {
          this.setState({
            clicked: this.state.clicked + step
          })
        }
      }

      render() {
        return (
          <TestContainer desc="Should render class component correctly and respond to clicks">
            <p>clicked: {this.state.clicked}</p>
            <div onClick={this.add(1)}>Add One</div>
            <Button onClick={this.add(9)}>Add Nine</Button>
          </TestContainer>
        )
      }
    }

    const Test3 = () => {
      return (
        <TestContainer desc="Should update num correctly">
          <ClickCounter />
        </TestContainer>
      )
    }

    const App = () => {
      return (
        <div>
          <Test1 />
          <Test2 />
          <Test3 />
        </div>
      )
    }
    return App
  }

  const beforeRun = () => {
    const App = container()
    console.log('---', isFb ? 'fb here' : 'my own', '---')
    console.log('App children', App().props.children)
    console.log('App inside', App())
    return App
  }

  return beforeRun()
}
