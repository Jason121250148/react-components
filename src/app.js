import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import { DragBox } from './components'

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route path="/" component={DragBox} />
      </BrowserRouter>
    )
  }
}
