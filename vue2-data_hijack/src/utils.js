export function isFuntions(mData) {
  // 判断是不是一个方法
  return typeof mData == 'function'
}

export function isObject(mData) {
  return (
    typeof mData == 'object' &&
    mData != null
  )
}
