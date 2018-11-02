import section from '../section'
import _ from 'lodash'

export default React => {
  const ChildrenTest = () => {
    const Section = section(React)
    const content = (
      <Section title="children test">
        {React.createElement(
          'div',
          {},
          _.times(3, n => {
            return <div key={n}>{n} with times</div>
          }),
          [
            <div key={0}>0 manually</div>,
            <div key={1}>1 manually</div>,
            <div key={2}>2 manually</div>,
            [
              <div key={0}>0 manually deep</div>,
              <div key={1}>1 manually deep</div>,
              <div key={2}>2 manually deep</div>,
            ],
          ],
          <div>0 manually in arg</div>,
          <div>1 manually in arg</div>,
          <div>2 manually in arg</div>,
          ..._.times(3, n => {
            return <div>{n} with times in arg</div>
          }),
          [1, 2, 3],
          'str',
          'str2',
          ['str3', 'str4', ['str5', 'str6', ['str7']]],
        )}
      </Section>
    )
    return content
  }
  return ChildrenTest
}
