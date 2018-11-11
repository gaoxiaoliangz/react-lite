import renderPrimitiveTest from './tests/renderPrimitiveTest'
import setStateTest from './tests/setStateTests/setStateTest'
import childrenTest from './tests/childrenTest'
import reconcileTest from './tests/reconcileTest'
import reduxTest from './tests/reduxTest'
import lifecycleTest from './tests/lifecycleTest'
import keyedTest from './tests/diffTests/keyedTest'
import manuallyKeyedTest from './tests/diffTests/manuallyKeyedTest'
import reorderTextNodes from './tests/diffTests/reorderTextNodes'
import unkeyedTest from './tests/diffTests/unkeyedTest'
import reorderTextNodes2 from './tests/diffTests/reorderTextNodes2'
import nestedKeyedTest from './tests/diffTests/nestedKeyedTest'
import propTest from './tests/setStateTests/propTest'
import setStateWithChildren from './tests/setStateTests/setStateWithChildren'
import multipleSetStateCalls from './tests/setStateTests/multipleSetStateCalls'
import callbackAndSetState from './tests/setStateTests/callbackAndSetState'
import mutateState from './tests/setStateTests/mutateState'
import reorderTest from './tests/diffTests/reorderTest'
import updateAttrs from './tests/diffTests/updateAttrs'
import unmountTest from './tests/unmountTest'
import didUpdateTest from './tests/didUpdateTest'
import inputTest from './tests/form/inputTest'
import keyTest from './tests/keyTest'
import refTest from './tests/refTests/refTest'
import useStateTest from './tests/hooksTests/useStateTest'
import useStateTest2 from './tests/hooksTests/useStateTest2'
import useStateTest3 from './tests/hooksTests/useStateTest3'
// import reactReduxTest from './tests/reactReduxTest'

const testGroups = [
  {
    desc: 'form tests',
    children: [
      {
        test: inputTest,
        desc: 'input test',
      },
    ],
  },
  {
    desc: 'render tests',
    children: [
      {
        test: renderPrimitiveTest,
        desc: 'render primitive',
      },
      {
        test: childrenTest,
        desc: 'children test',
      },
      {
        test: keyTest,
        desc: 'key test',
      },
    ],
  },
  {
    desc: 'hook tests',
    children: [
      {
        test: useStateTest,
        desc: 'useState test',
      },
      {
        test: useStateTest2,
        desc: 'useState test2',
      },
      {
        test: useStateTest3,
        desc: 'useState test3',
      },
    ],
  },
  {
    desc: 'ref tests',
    children: [
      {
        test: refTest,
        desc: 'ref test',
      },
    ],
  },
  {
    desc: 'setState tests',
    children: [
      {
        test: setStateTest,
        desc: 'setStateTest basic',
      },
      {
        test: propTest,
        desc: 'prop test',
      },
      {
        test: setStateWithChildren,
        desc: 'setStateWithChildren',
      },
      {
        test: multipleSetStateCalls,
        desc: 'multipleSetStateCalls',
      },
      {
        test: callbackAndSetState,
        desc: 'callbackAndSetState',
      },
      {
        test: mutateState,
        desc: 'mutateState',
      },
    ],
  },
  {
    desc: 'diff tests',
    children: [
      {
        test: manuallyKeyedTest,
        desc: 'manuallyKeyedTest',
      },
      {
        test: keyedTest,
        desc: 'keyedTest',
      },
      {
        test: updateAttrs,
        desc: 'update attrs',
      },
      {
        test: reorderTest,
        desc: 'reorder test',
      },
      {
        test: nestedKeyedTest,
        desc: 'nestedKeyedTest',
      },
      {
        test: unkeyedTest,
        desc: 'unkeyedTest',
      },
      {
        test: reorderTextNodes,
        desc: 'reorderTextNodes',
      },
      {
        test: reorderTextNodes2,
        desc: 'reorderTextNodes2',
      },
    ],
  },
  {
    desc: 'lifecycle tests',
    children: [
      {
        test: lifecycleTest,
        desc: 'lifecycleTest',
      },
      {
        test: unmountTest,
        desc: 'unmount test',
      },
      {
        test: didUpdateTest,
        desc: 'didUpdateTest',
      },
    ],
  },
  {
    desc: 'misc',
    children: [
      {
        test: reconcileTest,
        desc: 'reconcileTest',
      },
    ],
  },
  {
    desc: '3rd party integration tests',
    children: [
      {
        test: reduxTest,
        desc: 'reduxTest',
      },
      // Provider 需要 node_modules 里面的 react 依赖，这里采用的
      // 依赖注入的方式变得不可行
      // {
      //   test: reactReduxTest,
      //   desc: 'reactReduxTest',
      // },
    ],
  },
]

export default testGroups
