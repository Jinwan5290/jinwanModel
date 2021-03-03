import React from 'react'
import Photoswipe from 'photoswipe'
import PhotoswipeUIDefault from 'photoswipe/dist/photoswipe-ui-default'
import './photoswpe.css'
import cls from 'classnames'

interface PhotoSwipeProps {
  isOpen: boolean
  items: SwipeItem[]
  options?: any
  className?: string
  id?: string
  onClose?(): void
}

type SwipeItem = {
  src: string
  w?: number
  h?: number
}

class PhotoSwipe extends React.Component<PhotoSwipeProps, any> {
  private pswpElement: any
  private photoSwipe: any

  static defaultProps = {
    options: {},
    itmes: [],
    className: '',
    onClose: () => {},
    id: null,
    isOpen: false,
  }

  state = {
    isOpen: this.props.isOpen,
  }

  componentDidMount() {
    const { isOpen } = this.state
    if (isOpen) {
      this.openPhotoSwipe()
    }
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps = (nextProps: PhotoSwipeProps) => {
    const { isOpen } = this.state
    if (nextProps.isOpen) {
      if (!isOpen) {
        this.openPhotoSwipe()
      } else {
        this.updateItems(nextProps.items)
      }
    } else if (isOpen) {
      this.closePhotoSwipe()
    }
  }

  updateItems = (items: SwipeItem[] = []) => {
    this.photoSwipe.items.length = 0
    items.forEach((item) => {
      this.photoSwipe.items.push(item)
    })
    this.photoSwipe.invalidateCurrItems()
    this.photoSwipe.updateSize(true)
  }

  openPhotoSwipe = () => {
    const { items, options } = this.props
    const pswpElement = this.pswpElement
    this.photoSwipe = new Photoswipe(
      pswpElement,
      PhotoswipeUIDefault,
      items,
      options
    )

    const _this = this
    this.photoSwipe.listen('destroy', function () {
      _this.handleClose()
    })

    this.setState(
      {
        isOpen: true,
      },
      () => {
        this.photoSwipe.init()
      }
    )
  }

  closePhotoSwipe = () => {
    if (!this.photoSwipe) {
      return
    }
    this.photoSwipe.close()
  }

  handleClose = () => {
    const { onClose } = this.props
    this.setState(
      {
        isOpen: false,
      },
      () => {
        if (onClose) {
          onClose()
        }
      }
    )
  }

  render() {
    const { className, id } = this.props

    const wrapperClass = cls(['pswp', className]).trim()
    return (
      <div
        id={id}
        className={wrapperClass}
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
        ref={(node) => {
          this.pswpElement = node
        }}
      >
        <div className="pswp__bg" />
        <div className="pswp__scroll-wrap">
          <div className="pswp__container">
            <div className="pswp__item" />
            <div className="pswp__item" />
            <div className="pswp__item" />
          </div>
          <div className="pswp__ui pswp__ui--hidden">
            <div className="pswp__top-bar">
              <div className="pswp__counter" />
              <button
                className="pswp__button pswp__button--close"
                title="Close (Esc)"
              />
              <button
                className="pswp__button pswp__button--share"
                title="Share"
              />
              <button
                className="pswp__button pswp__button--fs"
                title="Toggle fullscreen"
              />
              <button
                className="pswp__button pswp__button--zoom"
                title="Zoom in/out"
              />
              <div className="pswp__preloader">
                <div className="pswp__preloader__icn">
                  <div className="pswp__preloader__cut">
                    <div className="pswp__preloader__donut" />
                  </div>
                </div>
              </div>
            </div>
            <div className="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
              <div className="pswp__share-tooltip" />
            </div>
            <button
              className="pswp__button pswp__button--arrow--left"
              title="Previous (arrow left)"
            />
            <button
              className="pswp__button pswp__button--arrow--right"
              title="Next (arrow right)"
            />
            <div className="pswp__caption">
              <div className="pswp__caption__center" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PhotoSwipe
