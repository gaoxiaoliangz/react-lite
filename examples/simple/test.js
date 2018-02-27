import _ from 'lodash'
import { Provider, connect } from 'react-redux'
import { createStore, combineReducers } from 'redux'
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
    /** start of common components */
    const Button = (props) => {
      return (
        <div className="btn" onClick={props.onClick}>
          <button>{props.children}</button>
        </div>
      )
    }

    const TestContainer = ({ desc, children, disabled }) => {
      return disabled ? '' : (
        <div id={'test-' + guid()} className="test-container">
          <h3>{desc}</h3>
          {children}
        </div>
      )
    }

    const Wrap = props => {
      return (
        <div className="wrap">
          <p>{props.level}</p>
          <div>{props.children}</div>
        </div>
      )
    }

    const Sep = props => {
      return (
        <div className="sep"></div>
      )
    }
    /** end of common components */

    class ClickCounterNoBtns extends Component {
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

    const ClickCounterWithWrap = () => {
      return (
        <div className="counter-wrap">
          <ClickCounter />
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

      change(v) {
        return () => {
          this.setState({
            clicked: v
          })
        }
      }

      addOne() {
        this.change(this.state.clicked + 1)()
      }

      render() {
        const isEven = this.state.clicked % 2 === 0
        const clicked = this.state.clicked
        return (
          <div className={'click-counter ' + 'clicked-' + this.state.clicked} data-clicked={this.state.clicked}>
            {
              isEven
                ? <p>clicks: {this.state.clicked}</p>
                : <div>[2]clicks: {this.state.clicked}</div>
            }
            <p>clicks: {isEven ? null : '[odd]'} {this.state.clicked} </p>
            <p>[node len unchanged]clicks: {this.state.clicked} </p>
            <Button onClick={() => {
              this.addOne()
            }}>+</Button>
            <Button onClick={this.change(clicked + 1)}>+</Button>
            <Button onClick={this.change(clicked - 1)}>-</Button>
          </div>
        )
      }
    }

    class UpdateCountWithRawRedux extends Component {
      componentWillMount() {
        store.subscribe(() => {
          this.setState({})
        })
      }

      render() {
        const currentCount = store.getState().count
        return (
          <div>
            <p>clicks: {currentCount}</p>
            <Button onClick={() => {
              store.dispatch(updateCount(currentCount + 1))
            }}>Add 1</Button>
          </div>
        )
      }
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

    // class KeyTest extends React.Component {
    //   render() {
    //     return (
    //       <div>
    //         <div>a</div>
    //         <div>b</div>
    //         <div>c</div>
    //       </div>
    //     )
    //   }
    // }

    const renderTests = () => {
      return (
        <div className="tests-inner">
          <TestContainer desc="render primitives (empty func or object is not valid)">
            {0}
            {1}
            {undefined}
            {null}
            {true}
            {false}
            {[]}
            {[1, 2]}
          </TestContainer>
          <TestContainer desc="render an array of elements manually without key">
            <div>
              <div>0</div>
              <div>1</div>
              <div>2</div>
            </div>
          </TestContainer>
          <TestContainer desc="render an array of elements and string without key">
            <div>
              {
                [
                  <div key={0}>0</div>,
                  <div key={1}>1</div>,
                  <div key={2}>2</div>,
                  1,
                  2
                ]
              }
            </div>
          </TestContainer>
          {/* <TestContainer desc="render an array of elements with dup key">
            <div>
              {
                [
                  <div key={0}>0</div>,
                  <div key={0}>1</div>,
                  <div key={2}>2</div>
                ]
              }
            </div>
          </TestContainer> */}
          <TestContainer desc="render nested divs">
            <div>
              <div>
                <div>at last</div>
              </div>
            </div>
          </TestContainer>
          <TestContainer desc="render nested components">
            <Wrap level={1}>
              <Wrap level={2}>
                <Wrap level={3}></Wrap>
              </Wrap>
            </Wrap>
          </TestContainer>
          <TestContainer desc="render text nodes">
            <div>
              text 1
              {'text 2'}
            </div>
          </TestContainer>
          <TestContainer disabled={false} desc="render number">
            <div>
              <ul>
                {_.times(5).map(n => <li key={n}>{n}</li>)}
              </ul>
              {
                [
                  0, 1, 2, <div key="a">3</div>
                ]
              }
            </div>
          </TestContainer>
          <Sep />
          <TestContainer desc="should render class component correctly and respond to clicks">
            <ClickCounterNoBtns />
          </TestContainer>
          <TestContainer desc="should update num correctly with setState">
            <ClickCounter />
          </TestContainer>
          <TestContainer desc="ClickCounterWithWrap should update num correctly with setState">
            <ClickCounterWithWrap />
          </TestContainer>
          <TestContainer desc="should work fine with raw redux">
            <UpdateCountWithRawRedux />
          </TestContainer>
          <TestContainer disabled={true} desc="should work fine with react redux">
            <UpdateCountWithRedux />
          </TestContainer>
          <TestContainer desc="should not warn about keys">
            <div>a</div>
            <div>b</div>
            <div>c</div>
          </TestContainer>
        </div>
      )
    }

    const App = ({ withProvider = false } = {}) => {
      const tests = renderTests()
      return withProvider
        ? (
          <Provider store={store}>
            {tests}
          </Provider>
        )
        : (
          <div className="tests">
            {tests}
          </div >
        )
    }

    const App2 = () => {
      return (
        <div className="app">
          <div className="item-1">
            so
            <div>
              it's ok
            </div>
          </div>
          <Button>abc</Button>
        </div>
      )
    }

    const App3 = () => {
      return (
        <div className="app">
          <div className="item-1">1</div>
          <div className="item-2">
            <div>deep</div>
          </div>
        </div>
      )
    }

    class App4 extends Component {
      constructor(props) {
        super(props)
        this.state = {
          flag: true
        }
        this.handleClick = this.handleClick.bind(this)
      }

      handleClick() {
        this.setState({
          flag: !this.state.flag
        })
      }

      render() {
        return (
          <div>
            <div>
              <div>yes?</div>
              {
                this.state.flag
                  ? (
                    <div onClick={this.handleClick}>with div</div>
                  )
                  : (
                    <span onClick={this.handleClick}>with span</span>
                  )
              }
              <div>end of line</div>
            </div>
          </div>
        )
      }
    }

    return App
  }

  const beforeRun = () => {
    const App = container()
    return App
  }

  return beforeRun()
}
