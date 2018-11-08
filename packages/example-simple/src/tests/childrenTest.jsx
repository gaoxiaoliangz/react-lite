import _ from 'lodash'

export default React => {
  const ChildrenTest = () => {
    const Block = ({ title, children }) => {
      return (
        <div>
          <h4>{title}</h4>
          {children}
        </div>
      )
    }

    const theThirdBlock = (
      <Block title="block with nested child">
        {[1, 2, 3, [4, 5, [6, 7]]]}
        <span>the child</span>
        <span>and the other</span>
      </Block>
    )

    const content = (
      <div>
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
          ['str3', 'str4', ['str5', 'str6', ['str7']]]
        )}
        <div>
          <Block title="block with no child" />
          <Block title="block with one child">
            <span>the child</span>
          </Block>
          <Block title="block with two child">
            <span>the child</span>
            <span>and the other</span>
          </Block>
          {theThirdBlock}
        </div>
      </div>
    )
    return content
  }
  return ChildrenTest
}
