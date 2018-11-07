import renderPrimitiveTest from './tests/renderPrimitiveTest'
import setStateTest from './tests/setStateTest'
import childrenTest from './tests/childrenTest'
import reconcileTest from './tests/reconcileTest'
import reduxTest from './tests/reduxTest'
import lifecycleTest from './tests/lifecycleTest'
import reconcileTest2 from './tests/diffTests/unkeyedTest'
import reactReduxTest from './tests/reactReduxTest'
import keyedTest from './tests/diffTests/keyedTest'
import manuallyKeyedTest from './tests/diffTests/manuallyKeyedTest'
import reorderTextNodes from './tests/diffTests/reorderTextNodes'
import unkeyedTest from './tests/diffTests/unkeyedTest'
import reorderTextNodes2 from './tests/diffTests/reorderTextNodes2'
import nestedKeyedTest from './tests/diffTests/nestedKeyedTest'
import nestedStateTest from './tests/diffTests/nestedStateTest'

export default (React, { onUpdate }) => {
  const tests = [
    {
      test: nestedStateTest,
    },
    {
      test: keyedTest,
    },
    {
      test: nestedKeyedTest,
    },
    {
      test: manuallyKeyedTest,
    },
    {
      test: unkeyedTest,
    },
    {
      test: reorderTextNodes,
    },
    {
      test: reorderTextNodes2,
    },
    {
      test: renderPrimitiveTest,
      disabled: true,
    },
    {
      test: setStateTest,
      disabled: true,
    },
    {
      test: childrenTest,
    },
    {
      test: reconcileTest,
      disabled: true,
    },
    {
      test: reduxTest,
      disabled: true,
    },
    {
      test: lifecycleTest,
      disabled: true,
    },
    {
      test: reconcileTest2,
      disabled: true,
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
