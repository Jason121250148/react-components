import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { genPreviewSrc, genSpriteSets } from './sprite'

const options = {
  viewWidth: 1260 / 2,
  viewHeight: 3150 / 2,
  width: 1260,
  height: 3150,
  vScale: 100,
  hScale: 100,
  scaleAnchorX: 1260 / 2,
  scaleAnchorY: 400,
  // previewScale: 100,
}
const imgUnits = [
  {
    url: 'https://fp-dev.webapp.163.com/a13/file/5b961ae654b2d36bbe34a47bCHqZjso8',
    width: 274,
    height: 311,
    left: 530,
    top: 100,
    canScale: true,
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
  {
    url: 'https://fp-dev.webapp.163.com/a13/file/5b961ae354b2d36fda4b5e84AjQFkpxP',
    width: 665,
    height: 1725,
    left: 370,
    top: 1280,
    canScale: true,
    index: 1,
  },
  {
    url: 'https://fp-dev.webapp.163.com/a13/file/5b961ae354b2d36fda4b5e84AjQFkpxP',
    width: 665,
    height: 1725,
    left: 470,
    top: 1280,
    canScale: true,
    index: 0,
  },
  {
    url: 'https://fp-dev.webapp.163.com/a13/file/5b961ae354b2d36fda4b5e84AjQFkpxP',
    width: 665,
    height: 1725,
    left: 570,
    top: 1280,
    canScale: true,
    index: 0,
  },
  {
    url: 'https://fp-dev.webapp.163.com/a13/file/5b961ae354b2d36fda4b5e84AjQFkpxP',
    width: 665,
    height: 1725,
    left: 670,
    top: 1280,
    canScale: true,
    index: 0,
  },
  {
    url: 'https://fp-dev.webapp.163.com/a13/file/5b961ae354b2d36fda4b5e84AjQFkpxP',
    width: 665,
    height: 1725,
    left: 770,
    top: 1280,
    canScale: true,
    index: 0,
  },
  {
    url: 'https://fp-dev.webapp.163.com/a13/file/5b961ae354b2d36fda4b5e84AjQFkpxP',
    width: 665,
    height: 1725,
    left: 870,
    top: 1280,
    canScale: true,
    index: 0,
  },
  {
    url: 'https://fp-dev.webapp.163.com/a13/file/5b961ae354b2d36fda4b5e84AjQFkpxP',
    width: 665,
    height: 1725,
    left: 970,
    top: 1280,
    canScale: true,
    index: 0,
  },
  {
    url: 'https://fp-dev.webapp.163.com/a13/file/5b961ae354b2d36fda4b5e84AjQFkpxP',
    width: 665,
    height: 1725,
    left: 1070,
    top: 1280,
    canScale: true,
    index: 0,
  },
  {
    url: 'https://fp-dev.webapp.163.com/a13/file/5b961ae354b2d36fda4b5e84AjQFkpxP',
    width: 665,
    height: 1725,
    left: 1170,
    top: 1280,
    canScale: true,
    index: 0,
  },
  {
    url: 'https://fp-dev.webapp.163.com/a13/file/5b961ae354b2d36fda4b5e84AjQFkpxP',
    width: 665,
    height: 1725,
    left: 1270,
    top: 1280,
    canScale: true,
    index: 0,
  },
  {
    url: 'https://fp-dev.webapp.163.com/a13/file/5b961ae354b2d36fda4b5e84AjQFkpxP',
    width: 665,
    height: 1725,
    left: 1370,
    top: 1280,
    canScale: true,
    index: 0,
  },
]
const presetUnits = {
  1: [
    {
      url: 'https://fp-dev.webapp.163.com/a13/file/5b961ae954b2d36fda4b5e879FDABb1p',
      width: 391,
      height: 498,
      left: 0,
      top: 600,
      canScale: false,
      index: 0,
    },
  ],
  2: [
    {
      url: 'https://fp-dev.webapp.163.com/a13/file/5b961ae854b2d368e915f8c3MI7DCE1m',
      width: 348,
      height: 490,
      left: 800,
      top: 600,
      canScale: false,
      index: 0,
    },
  ],
}
class SpriteTest extends PureComponent {
  state = {
    genPreSrcTime: '无',
    genSpriteSetsTime: '无',
  }
  beginGenPreviewSrc = () => {
    const beginTime = new Date().getTime()
    genPreviewSrc(options, imgUnits).then((src) => {
      console.log(src)
      this.setState({
        genPreSrcTime: `${((new Date().getTime() - beginTime) / 1000).toFixed(2)}s`,
      })
    })
  }
  beginGenSpriteSets = () => {
    const beginTime = new Date().getTime()
    genSpriteSets(options, imgUnits, presetUnits).then((res) => {
      console.log(res)
      this.setState({
        genSpriteSetsTime: `${((new Date().getTime() - beginTime) / 1000).toFixed(2)}s`,
      })
    })
  }
  render() {
    return (
      <div className="sprite-time-test">
        <div>
          genPreviewSrc所需时间:
          {this.state.genPreSrcTime || '无'}
          <button type="button" onClick={this.beginGenPreviewSrc}>开始测速</button>
        </div>
        <div>
          genSpriteSets所需时间:
          {this.state.genSpriteSetsTime || '无'}
          <button type="button" onClick={this.beginGenSpriteSets}>开始测速</button>
        </div>
      </div>
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
