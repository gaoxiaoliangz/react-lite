import _ from 'lodash'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { connect } from 'react-redux'
import { guid } from './utils'

const updateCount = count => {
  return {
    type: 'update-count',
    payload: count
  }
}

const reducers = combineReducers({
  count: (state = 0, action) => {
    switch (action.type) {
      case 'update-count':
        return action.payload

      default:
        return state
    }
  }
})

const store = createStore(reducers)

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
        <div id={'test-' + guid()} className="test-container">
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
            <p>clicks: {this.state.clicked}</p>
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
            <p>clicks: {this.state.clicked}</p>
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

    const UpdateCountWithRedux = connect(
      (state, ownProps) => {
        return {
          count: state.count
        }
      },
      { updateCount }
    )((props) => {
      return (
        <div>
          <p>clicks: {props.count}</p>
          <Button onClick={() => {
            props.updateCount(props.count + 1)
          }}>Add 1</Button>
        </div>
      )
    })

    class Test4 extends Component {
      componentWillMount() {
        store.subscribe(() => {
          this.setState({})
        })
      }

      render() {
        const currentCount = store.getState().count
        return (
          <TestContainer desc="should work fine with raw redux">
            <div>
              <p>clicks: {currentCount}</p>
              <Button onClick={() => {
                store.dispatch(updateCount(currentCount + 1))
              }}>Add 1</Button>
            </div>
          </TestContainer>
        )
      }
    }

    const Test5 = () => {
      return (
        <TestContainer desc="should work fine with react redux">
          <UpdateCountWithRedux />
        </TestContainer>
      )
    }

    // return (
    //   <Provider store={store}>
    //     <div>
    //       <Test1 />
    //       <Test2 />
    //       <Test3 />
    //       {/* <Test4 />
    //       <Test5 /> */}
    //     </div>
    //   </Provider>
    // )
    const App = () => {
      return (
        <div>
          <Test1 />
          <Test2 />
          <Test3 />
          <TestContainer desc="render text nodes">
            <div>
              aa
              bb
              cc
              {'dd'}
            </div>
          </TestContainer>
          {/* <Test4 />
          <Test5 /> */}
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
