import { forEach, cloneDeep, merge, has } from 'lodash'

import { requiredParamsCheck } from './common'

function spritePack(options, blocks = []) {
  const legalOptions = requiredParamsCheck(options, [])
  const legalBlocks = requiredParamsCheck(blocks, ['width', 'height'])
  if (!legalOptions) return new Error('options param is not completed, please check')
  if (!legalBlocks) return new Error('blocks param is not completed, please check')
  if ((has(options, 'maxWidth') && !has(options, 'maxHeight'))
      || (!has(options, 'maxWidth') && has(options, 'maxHeight'))) {
    return new Error('options should have both maxWidth and maxHeight or none of them')
  }
  const finalOptions = merge({}, options)
  const { maxWidth, maxHeight } = finalOptions

  let totalRoot
  function findNode(root, width, height) {
    if (root.used) {
      return findNode(root.right, width, height) || findNode(root.down, width, height)
    }
    if ((width <= root.width) && (height <= root.height)) {
      return root
    }
    return null
  }

  function splitNode(node, width, height) {
    /* eslint-disable no-param-reassign */
    node.used = true
    node.down  = { x: node.x, y: node.y + height, width: node.width, height: node.height - height }
    node.right = { x: node.x + width, y: node.y, width: node.width - width, height }
    return node
  }

  function growRight(width, height) {
    if (totalRoot.width + width > maxWidth) {
      return null
    }

    totalRoot = {
      used: true,
      x: 0,
      y: 0,
      width: totalRoot.width + width,
      height: totalRoot.height,
      down: totalRoot,
      right: { x: totalRoot.width, y: 0, width, height: totalRoot.height },
    }
    const node = findNode(totalRoot, width, height)
    if (node) {
      return splitNode(node, width, height)
    }

    return null
  }

  function growDown(width, height) {
    if (totalRoot.height + height > maxHeight) {
      return null
    }

    totalRoot = {
      used: true,
      x: 0,
      y: 0,
      width: totalRoot.width,
      height: totalRoot.height + height,
      down: { x: 0, y: totalRoot.height, width: totalRoot.width, height },
      right: totalRoot,
    }
    const node = findNode(totalRoot, width, height)
    if (node) {
      return splitNode(node, width, height)
    }

    return null
  }

  function growNode(width, height) {
    const canGrowDown  = (width  <= totalRoot.width)
    const canGrowRight = (height <= totalRoot.height)

    const shouldGrowRight = canGrowRight && (totalRoot.height >= (totalRoot.width  + width))
    const shouldGrowDown  = canGrowDown  && (totalRoot.width  >= (totalRoot.height + height))

    if (shouldGrowRight) {
      return growRight(width, height)
    }
    if (shouldGrowDown) {
      return growDown(width, height)
    }
    if (canGrowRight) {
      return growRight(width, height)
    }
    if (canGrowDown) {
      return growDown(width, height)
    }
    return null // need to ensure sensible root starting size to avoid this happening
  }

  const newBlocks = [...blocks]
  newBlocks.sort((a, b) => b.width * b.height - a.width * a.height)
  const width  = newBlocks.length > 0 ? newBlocks[0].width : 0
  const height = newBlocks.length > 0 ? newBlocks[0].height : 0
  // const hasMax = has(finalOptions, 'maxWidth') && has(finalOptions, 'maxHeight')
  // if (hasMax) {
  //   totalRoot = { x: 0, y: 0, width: maxWidth, height: maxHeight }
  // } else {
  totalRoot = { x: 0, y: 0, width, height }
  // }
  const spriteBlocks = [] // 已经写入雪碧图的block
  const unSpriteBlocks = [] // 由于超出大小未写入雪碧图的block
  forEach(newBlocks, (block) => {
    const newBlock = cloneDeep(block)
    const node = findNode(totalRoot, block.width, block.height)
    if (node) {
      const fit = splitNode(node, block.width, block.height)
      newBlock.x = fit.x
      newBlock.y = fit.y
      spriteBlocks.push(newBlock)
    } else {
      const fit = growNode(block.width, block.height)
      if (fit === null) {
        unSpriteBlocks.push(newBlock)
      } else {
        newBlock.x = fit.x
        newBlock.y = fit.y
        spriteBlocks.push(newBlock)
      }
    }
  })

  return { spriteBlocks, unSpriteBlocks }
}


export default spritePack