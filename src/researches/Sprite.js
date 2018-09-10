import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'

const WIDTH = 1260
const HEIGHT = 3150
class Sprite extends PureComponent {
  constructor(props) {
    super(props)
    // const img = new Image()
    // img.crossOrigin = 'Anonymous' // 跨域
    // img.src = 'https://fp-dev.webapp.163.com/a13/file/5b75393854b2d31f7e2f5e54ti6W77YP'
    this.state = {
      imgs: [],
      imgSrc: '',
    }
  }
  handleImgUpload = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = (e2) => {
      const image = new Image()
      image.onload = () => {
        this.setState({
          imgs: [...this.state.imgs, image],
        }, this.genSpriteCanvas)
      }
      image.src = e2.target.result // base64
    }
    reader.readAsDataURL(file)
  }

  genSpriteCanvas = (clean = true) => {
    if (clean) {
      // 清空canvas
      this.$canvasContext.clearRect(0, 0, WIDTH, HEIGHT)
    }
    const { imgs } = this.state
    imgs.forEach((img) => {
      this.$canvasContext.drawImage(img, 0, 0, WIDTH, HEIGHT, 0, 0, WIDTH, HEIGHT)
    })

    const src = this.$canvas.toDataURL('image/png')
    this.setState({ imgSrc: src })
  }
  setCanvasRef = (canvas) => {
    this.canvas = canvas
    this.$canvas = findDOMNode(this.canvas)
    this.$canvas.width = WIDTH
    this.$canvas.height = HEIGHT
    this.$canvasContext = this.$canvas.getContext('2d')
  }
  render() {
    const { imgSrc } = this.state
    return (
      <div className="sprite">
        <input type="file" onChange={this.handleImgUpload} />
        <div className="sprite__preview">
          <canvas className="sprite__canvas" ref={this.setCanvasRef} />
          <img src={imgSrc} alt="预览图" className="sprite__img" />
        </div>
      </div>
    )
  }
}

Sprite.propTypes = {
  prefixCls: PropTypes.string,
}

Sprite.defaultProps = {
  prefixCls: 'sprite',
}

export default Sprite
