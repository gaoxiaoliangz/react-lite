import _ from 'lodash'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { connect } from 'react-redux'
import { guid } from './utils'

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

    const App2 = () => {
      return (
        <div className="app">
          <div className="item-1">
            so
            <div id="text">
              {['its ok',
              'sure']}
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
            <div onClick={this.handleClick}>
              <div>yes?</div>
              {
                this.state.flag
                  ? (
                    <div >yes</div>
                  )
                  : (
                    <span >no</span>
                  )
              }
              <div id="label" className={this.state.flag ? 'yes' : 'no'}>
                update textContent 
                {
                  this.state.flag ? 'with div' : 'with span'
                }
              </div>
              <div>end of line</div>
            </div>
          </div>
        )
      }
    }

    const Test = () => {
      return (
        <div>
          {0}
          {1}
          {undefined}
          {null}
          {true}
          {false}
          {[]}
          end
        </div>
      )
    }

    const Test2 = () => {
      const flag = true
      return (
        <div>
          {
            flag
              ? (
                <div>0</div>
              )
              : (
                <div>1</div>
              )
          }
          <div>2</div>
        </div>
      )
    }

    const Test3 = () => {
      return (
        <div>
          {0}
          {
            _.times(5).map(n => {
              return (
                <div key={n}>{n}</div>
              )
            })
          }
          {
            [
              <div key={1}>0</div>,
              <div key={2}>1</div>,
            ]
          }
          <div>1</div>
          <div>2</div>
        </div>
      )
    }

    const Test4 = () => {
      return (
        <div>
          {1}
          {
            _.times(5).map((n, i) => {
              return (
                <div key={i}>{n}</div>
              )
            })
          }
        </div>
      )
    }

    const Test5 = () => {
      return (
        <div>
          {1}
          {[
            0, 1, 2, [2, 3]
          ]}
        </div>
      )
    }

    const App5 = () => {
      return (
        <div>
          {/* <Test /> */}
          {/* <Test2 /> */}
          <Test3 />
        </div>
      )
    }

    return App5
  }

  const beforeRun = () => {
    const App = container()
    return App
  }

  return beforeRun()
}
