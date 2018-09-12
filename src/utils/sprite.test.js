import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { map, isEqual, isEmpty } from 'lodash'

import { genPreviewSrc, genSpriteSets } from './sprite'

class SpriteTest extends PureComponent {
  state = {
    previewSrc: '',
    spriteSets: {},
  }
  render() {
    const options = {
      viewWidth: 1260 / 2,
      viewHeight: 3150 / 2,
      width: 1260,
      height: 3150,
      vScale: 100,
      hScale: 100,
      scaleAnchorX: 1260 / 2,
      scaleAnchorY: 400,
      previewScale: 100,
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
    genPreviewSrc(options, imgUnits).then((src) => {
      if (!isEqual(this.state.previewSrc, src)) {
        this.setState({
          previewSrc: src,
        })
      }
    })
    genSpriteSets(options, imgUnits, presetUnits).then((res) => {
      if (isEmpty(this.state.spriteSets)) {
        // 这里每次调用genSpriteSets方法会生成一个uuidv4所以判断isEqual时永远是不同的，导致无限刷新，因此用isEmpty
        this.setState({
          spriteSets: res,
        })
      }
    })
    return (
      <div className="sprite-test">
        <div className="sprite-test__title">genPreviewSrc结果</div>
        <img className="sprite-test__merge-img" src={this.state.previewSrc} alt="preview" />
        <hr />
        <div className="sprite-test__title">genSpriteSets结果</div>
        <img className="sprite-test__sprite-img" src={this.state.spriteSets.basicPreviewUrl} alt="preview" />
        <div className="sprite-test__sprite-title">差分结果列表</div>
        <div className="sprite-test__sprite-list">
          {
            map(this.state.spriteSets.presetPreviews, (item, key) => (
              <img key={key} className="sprite-test__sprite-img" src={item} alt="preview" />
            ))
          }
        </div>
        <div className="sprite-test__sprite-title">雪碧图结果列表</div>
        <div className="sprite-test__sprite-list">
          {
            map(this.state.spriteSets.atlas, (item, key) => !item.spriteImgId && (
              <img key={key} className="sprite-test__sprite-img" src={item.url} alt="preview" />
            ))
          }
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
