import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import { DragBox } from './components'
import { RotateNScale, NALayout } from './researches'

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route path="/" component={NALayout} />
      </BrowserRouter>
    )
  }
}
