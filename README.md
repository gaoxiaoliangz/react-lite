# How react works

## Why creating this repo

I want to understand how react works, the best way to do it is to implement it my own way.

The package is at very early stages of development, so only a handful of react features are supported.

## What's been included

React

- createElement

Function component

- todo: support hooks

Class component

- setState
- componentDidMount
- componentDidUpdate
- componentWillUnmount

ReactDOM

- render

## How to run

```
lerna bootstrap
yarn build --watch
yarn start
```

The demo runs two versions of react in two columns with identical components, which I've created for testing purposes, left side is my version, right side is react.
