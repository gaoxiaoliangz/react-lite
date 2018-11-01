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

  class ReduxTest extends React.Component {
    componentWillMount() {
      store.subscribe(() => {
        this.setState({})
      })
    }

    render() {
      const currentCount = store.getState().count
      return (
        <Section title="redux test">
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
        </Section>
      )
    }
  }
  return ReduxTest
}
