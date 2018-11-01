import { Provider, connect } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import section from '../section'

const updateCount = count => {
  return {
    type: 'update-count',
    payload: count,
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
  },
})

const store = createStore(reducers)

export default React => {
  const Section = section(React)

  const ReactReduxTest = ({ count, updateCount }) => {
    return (
      <Section title="react-redux test">
        <div>
          <button onClick={() => updateCount(count - 1)}>-</button>
          {count}
          <button onClick={() => updateCount(count + 1)}>+</button>
        </div>
      </Section>
    )
  }

  const ReactReduxTest2 = connect(
    (state, ownProps) => {
      return {
        count: state.count,
      }
    },
    { updateCount }
  )(ReactReduxTest)

  class ReactReduxTestWrapper extends React.Component {
    render() {
      return (
        <Provider store={store}>
          <ReactReduxTest2 />
        </Provider>
      )
    }
  }

  return ReactReduxTestWrapper
}
