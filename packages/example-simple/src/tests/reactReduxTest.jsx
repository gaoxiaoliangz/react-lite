import { Provider, connect } from 'react-redux'
import { createStore, combineReducers } from 'redux'

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

export default React => {
  const store = createStore(reducers)

  const ReactReduxTest = ({ count, updateCount }) => {
    return (
      <div>
        <div>
          <button onClick={() => updateCount(count - 1)}>-</button>
          {count}
          <button onClick={() => updateCount(count + 1)}>+</button>
        </div>
      </div>
    )
  }

  const ReactReduxTest2 = connect(
    (state, ownProps) => {
      return {
        count: state.count,
      }
    },
    { updateCount },
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
