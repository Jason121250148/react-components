import React, { PureComponent } from 'react'
import { findDOMNode } from 'react-dom'

class RotateNScale extends PureComponent {

  setDiv = (div) => {
    this.div = div
  }

  setCanvas = (canvas) => {
    this.canvas = canvas
    var cxt = this.canvas.getContext("2d");
    cxt.beginPath();
    cxt.moveTo(0, 125);
    cxt.lineTo(200, 0);
    cxt.stroke();
  }

  handleClick = (e) => {
    const $item = document.createElement('div')
    $item.classList.add('re-rotate-scale__item')
    this.div.append($item)
  }

  render() {
    return (
      <div className="re-rotate-scale__container">
        <div ref={this.setDiv} className="re-rotate-scale" onClick={this.handleClick}>
          <div className="re-rotate-scale__rotate">
             <div className="re-rotate-scale__rotate-item"></div> 
          </div>
        </div>
      </div>
    )
  }
}

export default RotateNScale