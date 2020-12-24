import React from 'react'
import ReactDOM from 'react-dom'
import 'tachyons'
import 'tachyons-extra'
import { Page } from './components/Page'

const App = () => {
  return <Page />
}

function renderApp() {
  ReactDOM.render(<App />, document.getElementById('app'))
}
renderApp()

