import React, { render } from '../../src'
import test from './test'
// import test0 from './test-simple'

const App = test(React, React.Component)

render(<App />, document.getElementById('root'))
