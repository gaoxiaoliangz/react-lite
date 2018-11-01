import renderPrimitiveTest from './tests/renderPrimitiveTest'
import setStateTest from './tests/setStateTest'
import reactReduxTest from './tests/reactReduxTest'
import reduxTest from './tests/reduxTest'
import reconcileTest from './tests/reconcileTest'
import childrenTest from './tests/childrenTest'

export default (React, { onUpdate }) => {
  const RenderPrimitiveTest = renderPrimitiveTest(React)
  const SetStateTest = setStateTest(React)
  const ReduxTest = reduxTest(React)
  const ReactReduxTest = reactReduxTest(React)
  const ReconcileTest = reconcileTest(React)
  const ChildrenTest = childrenTest(React)

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
          test
          <span>span</span>
          <RenderPrimitiveTest />
          {/*<SetStateTest />
          <ReduxTest />
          <ReactReduxTest />
          <ReconcileTest /> */}
          <ChildrenTest />
        </div>
      )
    }
  }
  return App
}
