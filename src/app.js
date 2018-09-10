import React, { Component } from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'

import { RotateNScale, Sprite } from './researches'
import { SpriteTest } from './utils'

export default class App extends Component {
  render() {
    const MAIN = <SpriteTest />
    if (MAIN) return MAIN

    return (
      <BrowserRouter>
        <div>
          <ul>
            <li><Link to="/rotate">组件：旋转组件(依赖插件版本不匹配，会有报错，后续再解决)</Link></li>
            <li><Link to="/sprite">研究：雪碧图与预览图相互转换组件</Link></li>
            <li><Link to="/spriteTest">测试工具：测试雪碧图生成</Link></li>
          </ul>
          <Route exact path="/rotate" component={RotateNScale} />
          <Route exact path="/sprite" component={Sprite} />
          <Route exact path="/spriteTest" component={SpriteTest} />
        </div>
      </BrowserRouter>
    )
  }
}
