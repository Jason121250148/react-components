import React, { Component } from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'

import { DragBox } from './components'
import { RotateNScale, Sprite } from './researches'

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <ul>
            <li><Link to="/rotate">旋转组件(依赖插件版本不匹配，会有报错，后续再解决)</Link></li>
            <li><Link to="/sprite">雪碧图与预览图相互转换组件</Link></li>
          </ul>
          <Route exact path="/rotate" component={RotateNScale} />
          <Route exact path="/sprite" component={Sprite} />
        </div>
      </BrowserRouter>
    )
  }
}
