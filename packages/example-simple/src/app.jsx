import renderPrimitiveTest from './tests/renderPrimitiveTest'
import setStateTest from './tests/setStateTest'
import childrenTest from './tests/childrenTest'
import reconcileTest from './tests/reconcileTest'
import reduxTest from './tests/reduxTest'
import lifecycleTest from './tests/lifecycleTest'
import reconcileTest2 from './tests/reconcileTest2'
import reactReduxTest from './tests/reactReduxTest'

export default (React, { onUpdate }) => {
  const tests = [
    {
      test: renderPrimitiveTest,
    },
    {
      test: setStateTest,
    },
    {
      test: childrenTest,
    },
    {
      test: reconcileTest,
    },
    {
      test: reduxTest,
    },
    {
      test: lifecycleTest,
    },
    {
      test: reconcileTest2,
    },
    {
      test: renderPrimitiveTest,
    },
    {
      test: reactReduxTest,
      disabled: true,
    },
  ]

  class App extends React.Component {
    componentDidMount() {
      onUpdate()
    }

    componentDidUpdate() {
      onUpdate()
    }

    render() {
      return (
        <div>
          {tests.map((test, idx) => {
            if (test.disabled) {
              return null
            }
            const TestComp = test.test(React)
            return <TestComp key={idx} />
          })}
        </div>
      )
    }
  }
  return App
}
