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

const store = createStore(reducers)

export default React => {
  class ReduxTest extends React.Component {
    componentDidMount() {
      store.subscribe(() => {
        this.setState({})
      })
    }

    render() {
      const currentCount = store.getState().count
      return (
        <div>
          <div>
            <button
              onClick={() => {
                store.dispatch(updateCount(currentCount + 1))
              }}
            >
              -
            </button>
            {currentCount}
            <button
              onClick={() => {
                store.dispatch(updateCount(currentCount + 1))
              }}
            >
              +
            </button>
          </div>
        </div>
      )
    }
  }
  return ReduxTest
}
