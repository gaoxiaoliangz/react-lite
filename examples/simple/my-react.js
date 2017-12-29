import React, { render } from '../../src'
import test from './test'

const App = test(React, React.Component)

render(<App/>, document.getElementById('root'))
