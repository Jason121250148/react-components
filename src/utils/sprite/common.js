import { has, forEach } from 'lodash'

/**
 * 检测某对象（若为数组，则依次检测数组中对象）的属性值是否包含必需值的所有参数
 * @param {object} params 待检测参数
 * @param {Array} requiredParams 必需的属性
 */
const requiredParamsCheck = (params, requiredParams) => {
  let legal = true
  const checkFunc = (ps) => {
    forEach(requiredParams, (rP) => {
      if (!has(ps, rP)) legal = false
    })
  }
  if (Array.isArray(params)) {
    forEach(params, param => checkFunc(param))
  } else {
    checkFunc(params)
  }
  return legal
}

/**
 * blob数据转为png图片
 * @param {blob} blob 图片blob数据
 * @param {string} fileName 生成图片名称
 */
const blob2PngFile = (blob, fileName) => new File(blob, fileName, {
  type: 'image/png',
})

/**
 * dataUrl转为file
 * @param {dataUrl} dataurl canvas生成的dataURL数据
 * @param {string} filename 生成文件的名称
 */
const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

// const uploadFile = () => (Promise.resolve({ url: 'url' }))

const uploadDataURL = (src, fileName = '') => {
  const file = dataURLtoFile(src, '')
  // return uploadFile(file, fileName).then(({ url }) => ({ url, size: file.size }))
  console.log(file.size, '-----', fileName)
  return Promise.resolve({ url: src, size: file.size })
}

const idFromUrl = (url) => {
  // const splitRes = url.split('file/')
  // if (splitRes.length < 2) return new Error('url format is wrong, can not generate id')

  // return splitRes[1]
  const splitRes = url.split('file/')
  if (splitRes.length < 2) {
    return url.slice(-32)
  }
  return splitRes[1]
}

export { requiredParamsCheck, blob2PngFile, dataURLtoFile, uploadDataURL, idFromUrl  }