import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { genPreviewSrc } from './sprite'

class SpriteTest extends PureComponent {
  state = {
    previewSrc: '',
  }
  render() {
    const options = {
      viewWidth: 1260 / 2,
      viewHeight: 3150 / 2,
      width: 1260,
      height: 3150,
      vScale: 105,
      hScale: 100,
      scaleAnchorX: 1260 / 2,
      scaleAnchorY: 400,
      previewScale: 100,
    }
    const imgSets = [
      {
        url: 'https://fp-dev.webapp.163.com/a13/file/5b961ae654b2d36bbe34a47bCHqZjso8',
        width: 274,
        height: 311,
        left: 530,
        top: 100,
        canScale: false,
        index: 0,
      },
      {
        url: 'https://fp-dev.webapp.163.com/a13/file/5b961ae454b2d36fda4b5e85s1cEU2XK',
        width: 582,
        height: 871,
        left: 350,
        top: 400,
        canScale: true,
        index: 0,
      },
      {
        url: 'https://fp-dev.webapp.163.com/a13/file/5b961ae354b2d36fda4b5e84AjQFkpxP',
        width: 665,
        height: 1725,
        left: 270,
        top: 1280,
        canScale: true,
        index: 0,
      },
    ]
    genPreviewSrc(options, imgSets).then((src) => {
      this.setState({ previewSrc: src })
    })
    return (
      <img className="sprite-test" src={this.state.previewSrc} alt="preview" />
    )
  }
}

SpriteTest.propTypes = {
  prefixCls: PropTypes.string,
}

SpriteTest.defaultProps = {
  prefixCls: 'sprite-test',
}

export default SpriteTest
