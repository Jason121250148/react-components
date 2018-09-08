import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { mergeImgs } from './sprite'

class SpriteTest extends PureComponent {
  render() {
    mergeImgs()
    return (
      <div>
        This is SpriteTest.
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
