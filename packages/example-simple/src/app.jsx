import renderPrimitiveTest from './tests/renderPrimitiveTest'
import setStateTest from './tests/setStateTest'
import reactReduxTest from './tests/reactReduxTest'
import reduxTest from './tests/reduxTest'
import reconcileTest from './tests/reconcileTest'
import childrenTest from './tests/childrenTest'
import lifecycleTest from './tests/lifecycleTest'
import reconcileTest2 from './tests/reconcileTest2'

export default (React, { onUpdate }) => {
  const RenderPrimitiveTest = renderPrimitiveTest(React)
  const SetStateTest = setStateTest(React)
  const ReduxTest = reduxTest(React)
  const ReactReduxTest = reactReduxTest(React)
  const ReconcileTest = reconcileTest(React)
  const ChildrenTest = childrenTest(React)
  const LifecycleTest = lifecycleTest(React)
  const ReconcileTest2 = reconcileTest2(React)

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
          <RenderPrimitiveTest />
          <SetStateTest />
          <ReduxTest />
          {/* <ReactReduxTest /> */}
          <ReconcileTest />
          <ChildrenTest />
          <LifecycleTest />
          <ReconcileTest2 />
        </div>
      )
    }
  }
  return App
}
