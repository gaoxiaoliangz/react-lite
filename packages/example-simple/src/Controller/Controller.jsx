import React from 'react'
import testGroups from '../allTests'
import './Controller.css'
import parseQuery from '../parseQuery'

const withAll = arr => {
  return [{ desc: 'all' }, ...arr].map((item, idx) => ({
    ...item,
    index: idx === 0 ? '' : idx - 1,
  }))
}

class Controller extends React.Component {
  state = {
    activeGroup: '',
    activeTest: '',
  }

  componentDidMount() {
    const queryObj = parseQuery(window.location.search.substr(1))
    this.setState({
      activeGroup: queryObj.group,
      activeTest: queryObj.test,
    })
  }

  goto = () => {
    window.location.href = `/?group=${this.state.activeGroup}&test=${
      this.state.activeTest
    }`
  }

  render() {
    const { activeGroup, activeTest } = this.state
    const tests = testGroups[activeGroup]
      ? testGroups[activeGroup].children
      : []
    return (
      <div className="controller">
        <label>group</label>
        <select
          value={activeGroup}
          onChange={e => {
            const val = e.target.value
            this.setState(
              {
                activeGroup: val,
                activeTest: '',
              },
              this.goto,
            )
          }}
        >
          {withAll(testGroups).map((group, idx) => {
            return (
              <option value={group.index} key={idx}>
                {group.desc}
              </option>
            )
          })}
        </select>
        {activeGroup !== '' && (
          <React.Fragment>
            <label>test</label>
            <select
              value={activeTest}
              onChange={e => {
                this.setState(
                  {
                    activeTest: e.target.value,
                  },
                  this.goto,
                )
              }}
            >
              {withAll(tests).map((test, idx) => {
                return (
                  <option value={test.index} key={idx}>
                    {test.desc}
                  </option>
                )
              })}
            </select>
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default Controller
