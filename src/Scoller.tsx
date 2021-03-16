import React from 'react'
import styles from './Scoller.module.css'

class Scoller extends React.Component<any, any> {
  scrollerRef = React.createRef<HTMLDivElement>()
  state = {
    data: [],
    startIndex: 0,
    endIndex: 0,
  }

  componentDidMount = () => {
    const temp: number[] = []
    for (let i = 0; i < 99; i++) {
      temp.push(i)
    }
    this.setState({
      data: temp,
    })
  }

  handleScroll = () => {
    // console.log(
    //   'is scroller scrollerRef',
    //   this.scrollerRef.current?.scrollTop,
    //   this.scrollerRef.current?.offsetHeight
    // )
    const top = this.scrollerRef.current?.scrollTop || 0
    const viewHeight = this.scrollerRef.current?.offsetHeight || 0
    const startIndex = Math.floor(top / 250)
    const endIndex = startIndex + Math.ceil(viewHeight / 250)

    this.setState({
      startIndex,
      endIndex,
    })
  }

  render() {
    const { handleScroll, state, scrollerRef, props } = this
    const { height = 800 } = props
    const { data, startIndex } = state
    const top = startIndex * 250
    return (
      <div
        className={styles['infinite-list-wrapper']}
        onScroll={handleScroll}
        ref={scrollerRef}
        style={{ height: height }}
      >
        <div className={styles['infinite-list-ghost']}></div>
        <div
          className={styles['infinite-list']}
          style={{ transform: `translate3d(0, ${top}px, 0)` }}
        >
          {data.map((item, index) => (
            <div className={styles.item} key={index}>
              {item}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Scoller
