/**
 * 可拖拽、自由更改大小、可旋转、可嵌套的外框
 */
import React, { PureComponent, PropTypes } from 'react'
import Rnd from 'react-rnd'
import { findDOMNode } from 'react-dom'
import noop from 'lodash/noop'
import classnames from 'classnames'

class MagicBox extends PureComponent {
  static propTypes = {
    prefixCls: PropTypes.string, // classname前缀
    className: PropTypes.string, // 样式名
    style: PropTypes.object, // 样式
    default: PropTypes.object, // 初始值
    bounds: PropTypes.string, // 边界(接受parent，或者selector，parent表示该元素的offsetparent)

    disableRotating: PropTypes.bool, // 是否禁止旋转，禁止后不出现旋转图标
    disableDragging: PropTypes.bool, // 是否禁止拖拽
    zoom: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]), // 是否缩放模式，缩放模式下以中心为原点等比缩放
    lockAspectRatio: PropTypes.bool, // 是否锁定长宽比
    showTip: PropTypes.bool, // 是否实时显示更改的信息

    onDrag: PropTypes.func, // 拖拽的回调
    onResize: PropTypes.func, // 更改大小的回调
  }

  static defaultProps = {
    prefixCls: 'na-magic-box',
    bounds: null, // 默认没有边界，可以随意拖拽

    disableRotating: false,
    disableDragging: false,
    zoom: false,
    lockAspectRatio: false,
    showTip: false,

    onDrag: noop,
    onResize: noop,
  }

  state = {
    disableDragging: Boolean(this.props.disableDragging || this.props.zoom),

    x: this.props.default.x,
    y: this.props.default.y,
    width: this.props.default.width,
    height: this.props.default.height,

    rotateX: 0, // 旋转icon初始位置(相对于边界)
    rotateY: 0,
    rotateDeg: 0, // 当前相对于竖直的旋转偏移度数
    originX: 150,
    originY: 150,
  }

  componentDidMount = () => {
    this.addRotateAnchor() // 增加旋转的锚点
    this.addOriginAnchor() // 增加中心锚点
    this.zoom(this.props.zoom)
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.zoom !== nextProps.zoom) {
      this.zoom(this.props.zoom)
    }
  }

  setRnd = (rnd) => {
    this.rnd = rnd
  }

  getBoundsPos = () => {
    const bounds = this.props.bounds
    let $bounds = null
    if (bounds === 'parent') {
      $bounds = findDOMNode(this.rnd).offsetParent
    } else {
      $bounds = document.querySelector(bounds)
    }
    const { left, top } = $bounds.getBoundingClientRect()
    return { x: left, y: top }
  }

  // 暴露给外部主动修改box的大小和位置
  updateSize = (size) => {
    this.rnd.updateSize(size)
  }
  updatePosition = (pos) => {
    this.rnd.updatePosition(pos)
  }

  showTip = () => {

  }

  hideTip = () => {

  }

  // 拖拽和更改大小的回调函数
  handleDrag = (_, pos) => {
    const { showTip, onDrag } = this.props
    if (showTip) {
      this.showTip()
    }
    this.setState({
      originX: pos.x + this.state.width / 2,
      originY: pos.y + this.state.height / 2,
    })
    if (onDrag) {
      onDrag({
        x: pos.x,
        y: pos.y,
      })
    }
  }
  handleResize = (_, __, ele, ___, pos) => {
    const { zoom, showTip, onResize } = this.props
    if (showTip) {
      this.showTip()
    }
    const width = ele.clientWidth
    const height = ele.clientHeight
    let posX = pos.x
    let posY = pos.y
    const offsetWidth = width - this.state.width
    const offsetHeight = height - this.state.height
    const { x, y } = this.state
    if (zoom) {
      posX = x - offsetWidth / 2
      posY = y - offsetHeight / 2
      this.updatePosition({ x: posX, y: posY })
    }
    if (onResize) {
      onResize({ width, height, x: posX, y: posY })
    }
    this.setState({
      originX: posX + width / 2,
      originY: posY + height / 2,
    })
  }

  // 拖拽和更改大小结束的回调，用以改变state，保存当前静止状态
  handleDragStop = (_, pos) => {
    this.setState({
      x: pos.x,
      y: pos.y,
    })
  }
  handleResizeStop = (_, __, ele, ___, pos) => {
    this.setState({
      width: ele.clientWidth,
      height: ele.clientHeight,
      x: pos.x,
      y: pos.y,
    })
  }

  zoom = (zoom) => {
    if (typeof zoom === 'number' && zoom !== 0) {
      const offsetX = (this.state.width * (zoom - 1)) / 2
      const offsetY = (this.state.height * (zoom - 1)) / 2
      this.updatePosition({
        x: this.state.x - offsetX,
        y: this.state.y - offsetY,
      })
      this.updateSize({
        width: this.state.width * zoom,
        height: this.state.height * zoom,
      })
    }
  }

  addRotateAttribute = () => {
    const $rnd = findDOMNode(this.rnd)
    const transform = $rnd.firstChild.style.transform
    const newTransform = `${transform.split('rotate')[0]} rotate(${this.state.rotateDeg}deg)`
    $rnd.firstChild.style.transform = newTransform
  }

  handleRotateMouseMove = (e) => {
    const boundsPos = this.getBoundsPos()
    const mouseX = e.clientX - boundsPos.x
    const mouseY = e.clientY - boundsPos.y
    const { rotateX, rotateY, originX, originY } = this.state
    this.setState({
      rotateX: mouseX,
      rotateY: mouseY,
    }, () => {
      const v1 = [rotateX - originX, rotateY - originY]
      const v2 = [mouseX - originX, mouseY - originY]
      const direction = (v1[1] * v2[0] - v1[0] * v2[1]) > 0 ? 1 : -1 // 判断旋转方向，顺时针加，逆时针减
      let cos = (v1[0] * v2[0] + v1[1] * v2[1]) /
        (Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]) *
          Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1])) // 计算旋转角
      cos = isNaN(cos) ? 1 : cos // 如果v1和v2都是【0，0】，被认为没有旋转
      cos = cos > 1 ? 1 : cos
      cos = cos < -1 ? -1 : cos // cos的计算可能出现1.0000...02这样的数值，其实为1
      const deg = Math.acos(cos) / Math.PI * 180
      this.setState({ rotateDeg: this.state.rotateDeg - deg * direction }, () => {
        this.addRotateAttribute()
      })
    })
  }

  handleRotateMouseUp = (e) => {
    const boundsPos = this.getBoundsPos()
    this.setState({
      disableDragging: false,
      rotateX: e.clientX - boundsPos.x,
      rotateY: e.clientY - boundsPos.y,
    }, () => {
      document.removeEventListener('mousemove', this.handleRotateMouseMove)
      document.removeEventListener('mouseup', this.handleRotateMouseUp)
    })
  }

  addRotateAnchor = () => {
    const $rnd = findDOMNode(this.rnd)
    this.$rotateIcon = document.createElement('span')
    const classString = classnames(`${this.props.prefixCls}__rotate-icon`, {
      [`${this.props.prefixCls}__rotate-icon_hidden`]: this.props.disableRotating,
    })
    this.$rotateIcon.className = classString
    this.$rotateIcon.innerText = '@'
    this.$rotateIcon.addEventListener('mousedown', (e) => {
      const boundsPos = this.getBoundsPos()
      this.setState({
        disableDragging: true, // 开始旋转则禁止拖动
        rotateX: e.clientX - boundsPos.x,
        rotateY: e.clientY - boundsPos.y,
      }, () => {
        document.addEventListener('mousemove', this.handleRotateMouseMove)
        document.addEventListener('mouseup', this.handleRotateMouseUp)
      })
    })
    $rnd.firstChild.appendChild(this.$rotateIcon)
  }

  addOriginAnchor = () => {
    const $rnd = findDOMNode(this.rnd)
    this.$originIcon = document.createElement('span')
    this.$originIcon.className = `${this.props.prefixCls}__origin-icon`
    $rnd.firstChild.appendChild(this.$originIcon)
  }

  render() {
    const { prefixCls, className, style, disableRotating, disableDragging,
      zoom, lockAspectRatio, ...other } = this.props
    const classString = classnames(prefixCls, className)
    const defaultStyle = { border: '1px dashed #FA6D8F' }
    if (this.$rotateIcon) {
      if (disableRotating) {
        this.$rotateIcon.classList.add(`${prefixCls}__rotate-icon_hidden`)
      } else {
        this.$rotateIcon.classList.remove(`${prefixCls}__rotate-icon_hidden`)
      }
    }
    return (
      <Rnd
        {...other}
        ref={this.setRnd}
        className={classString}
        style={{ ...defaultStyle, ...style }}
        lockAspectRatio={Boolean(lockAspectRatio || zoom)}
        disableDragging={this.state.disableDragging}
        onDrag={this.handleDrag}
        onResize={this.handleResize}
        onDragStop={this.handleDragStop}
        onResizeStop={this.handleResizeStop}
      >
        {this.props.children}
      </Rnd>
    )
  }
}

export default MagicBox
