// import section from './section'
import renderPrimitive from './tests/renderPrimitive'

export default React => {
  // const Section = section(React)
  const RenderPrimitive = renderPrimitive(React)
  class App extends React.Component {
    componentDidMount() {
      console.log(this.app.innerHTML)
    }

    render() {
      return (
        <div ref={ref => (this.app = ref)}>
          {/* <Section title="render all kinds of stuff">test</Section> */}
          <RenderPrimitive />
        </div>
      )
    }
  }
  return App
}
