import React, { PureComponent } from 'react'
import { findDOMNode } from 'react-dom'

import { MagicBox } from '../components'

class RotateNScale extends PureComponent {

  handleDrag = (pos) => {
    console.log('x:', pos.x, ' ', 'y:', pos.y)
  }

  handleResize = (res) => {
    console.log('x:', res.x, ' ', 'y:', res.y, ' ', 'width:', res.width, ' ', 'height:', res.height)
  }

  render() {
    return (
      <div className="re-rotate-scale">
        <div className="re-rotate-scale__screens">
          <div className="re-rotate-scale__container">
            <div className="re-rotate-scale__view">
              <MagicBox
                default={{
                  x: -150,
                  y: 100,
                  width: 100,
                  height: 100,
                }}
                z={10}
                bounds=".re-rotate-scale__container"
                onResize={this.handleResize}
                onDrag={this.handleDrag}
              />
            </div>
          </div>
        </div>
        
      </div>
    )
  }
}

export default RotateNScale