import section from './section'
import testGroups from './allTests'

export default (React, { onUpdate, activeGroup, activeTest }) => {
  const Section = section(React)

  class App extends React.Component {
    componentDidMount() {
      onUpdate()
    }

    componentDidUpdate() {
      onUpdate()
    }

    render() {
      return (
        <div className="app">
          {testGroups
            .filter(
              (group, groupIdx) =>
                activeGroup === '' ? true : groupIdx === +activeGroup,
            )
            .map((group, gIdx) => {
              return (
                <div className="group" key={gIdx}>
                  <h2>{group.desc}</h2>
                  {group.children
                    .filter(
                      (child, childIdx) =>
                      activeTest === '' ? true : childIdx === +activeTest,
                    )
                    .map((child, idx) => {
                      const TestComp = child.test(React)
                      return (
                        <div key={idx} className="test">
                          <Section title={child.desc}>
                            <TestComp />
                          </Section>
                        </div>
                      )
                    })}
                </div>
              )
            })}
        </div>
      )
    }
  }
  return App
}
