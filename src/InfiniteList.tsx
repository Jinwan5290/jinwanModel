import React from 'react'
import styles from './Scoller.module.css'

interface IProps {
  height?: number
  interval?: number
}

interface IState {
  list: any[]
  // 可视区域top
  top: number
  // 数据总高度
  contentHeight: number
  // 可见高度
  visibleHeight: number
  // 可见列表
  visibleData: any[]
  // 上下预加载个数
  buffer: number
  //间隔
  interval: number
}

const getData = (index = 0): any[] => {
  if (index >= 100) return []
  const list: any[] = []
  for (let val = index; val < index + 20; val++) {
    // const height = Math.random() - 0.5 > 0 ? 60 : 30
    const height = 50
    const obj: any = {
      val,
      height,
    }
    // val = 0
    if (!val) {
      obj.offsetTop = height
    }
    list.push(obj)
  }

  return list
}

export default class InfiniteList extends React.Component<IProps, IState> {
  wrapperRef: React.RefObject<HTMLDivElement>
  constructor(props: IProps) {
    super(props)
    const data = getData()
    const contentHeight = data.reduce((a, b) => a + b.height, 0)
    this.wrapperRef = React.createRef<HTMLDivElement>()
    this.state = {
      top: 0,
      visibleHeight: 0,
      visibleData: [],
      buffer: 10,
      interval: 5,
      list: data,
      contentHeight,
    }
  }

  componentDidMount() {
    //init height & visible data
    debugger
    const visibleHeight = this.wrapperRef.current?.clientHeight || 0
    this.setState({
      visibleHeight,
      ...this.doCalculate(0),
    })
  }

  doCalculate = (startIndex: number) => {
    const { list, buffer } = this.state
    const innerOffset = (startIndex = startIndex - buffer)
    startIndex = startIndex > 0 ? startIndex : 0
    let endIndex = this.findEndIndex(startIndex) + buffer * 2 + 1
    // ?+>?
    endIndex = innerOffset < 0 ? endIndex + innerOffset : endIndex
    endIndex = endIndex > list.length ? list.length : endIndex

    const visibleData = list.slice(startIndex, endIndex)
    const top = this.findTopByIndex(startIndex)
    return { visibleData, top }
  }

  // 取endindex，先看缓存再计算
  findEndIndex = (startIndex: number) => {
    let { visibleHeight } = this.state
    const { list } = this.state
    // 取缓存
    if (list[startIndex].endIndex) {
      return list[startIndex].endIndex
    }
    visibleHeight = visibleHeight || this.wrapperRef.current?.clientHeight || 0
    const endIndex = this.calculateEndIndex(visibleHeight, startIndex)
    // 加入缓存
    list[startIndex].endIndex = endIndex
    this.setState({
      list,
    })
    return endIndex
  }

  findTopByIndex = (index: number) => {
    return index ? this.state.list[index - 1].offsetTop : 0
  }

  calculateEndIndex = (visibleHeight: number, index: number) => {
    const { list } = this.state
    while (visibleHeight > 0) {
      const i = index + 1
      if (i !== list.length) {
        visibleHeight -= list[++index].height
      } else {
        break
      }
    }
    return index
  }

  calculateOffset = (index: number): number => {
    const { list } = this.state
    if (index >= list.length) {
      // yichang
      return this.calculateOffset(index - 1)
    }
    // 使用缓存
    if (list[index].offsetTop) {
      return list[index].offsetTop
    }
    let offsetTop = list[index].height + this.calculateOffset(index - 1)

    // 添加缓存
    list[index] = {
      ...list[index],
      offsetTop,
    }

    // 更新下缓存
    this.setState({ list })
    return offsetTop
  }

  findStartIndex = (top: number) => {
    const { list } = this.state
    let index = 0
    while (index < list.length) {
      if (!list[index].offsetTop) {
        // 这里有个更新我不确定
        this.calculateOffset(index)
      }
      if (top < list[index].offsetTop) {
        break
      }
      index++
    }
    return index
  }

  scrollHandler = (e: any) => {
    const { interval, visibleHeight, buffer, list } = this.state
    const startIndex = this.findStartIndex(e.target.scrollTop)
    const endIndex = this.calculateEndIndex(visibleHeight, startIndex)
    if (startIndex % interval === 0) {
      this.setState(this.doCalculate(startIndex))
      if (endIndex + buffer >= list.length - 1) {
        this.handleClick()
      }
    }
  }

  handleClick = () => {
    const { list } = this.state
    const res = getData(list.length - 1)
    if (res.length) {
      const newData = list.concat(res)
      const contentHeight = newData.reduce((a, b) => a + b.height, 0)
      this.setState({
        list: newData,
        contentHeight,
      })
    }
  }

  render() {
    const { handleClick } = this
    const { visibleData, contentHeight, top } = this.state
    const { height = 400 } = this.props
    return (
      <div>
        <div
          className={styles['infinite-list-wrapper']}
          onScroll={this.scrollHandler}
          ref={this.wrapperRef}
          style={{ height: height }}
        >
          <div
            className={styles['infinite-list-ghost']}
            style={{ height: contentHeight }}
          />
          <div
            className={styles['infinite-list']}
            style={{ transform: `translate3d(0, ${top}px, 0)` }}
          >
            {visibleData.map((item, i) => {
              const style = {
                height: `${item.height}px`,
                lineHeight: `${item.height}px`,
              }
              return (
                <div
                  className="item"
                  key={i}
                  style={style}
                >{`item-${item.val}`}</div>
              )
            })}
          </div>
        </div>
        asdasddsads
        <button onClick={handleClick}>click</button>
      </div>
    )
  }
}
