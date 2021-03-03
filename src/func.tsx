import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react'
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

const PhotoSwipe: React.FC<PhotoSwipeProps> = ({
  id = '',
  isOpen,
  className,
  items,
  options,
}) => {
  const pswpElement = useRef<any>(null)
  const photoSwipe = useRef<any>(null)

  const wrapperClass = useMemo(() => {
    if (className) {
      return cls(['pswp', className]).trim()
    }
    return 'pswp'
  }, [className])

  const handleClose = () => {}

  const openPhotoSwipe = useCallback(() => {
    photoSwipe.current = new Photoswipe(
      pswpElement.current,
      PhotoswipeUIDefault,
      items,
      options
    )
    photoSwipe.current.listen('destroy', handleClose)
    photoSwipe.current.init()
  }, [items, options])

  const closePhotoSwipe = useCallback(() => {
    if (!photoSwipe.current) return
    photoSwipe.current.close()
  }, [])

  const updateItems = useCallback(() => {
    photoSwipe.current.items.length = 0
    items.forEach((item) => {
      photoSwipe.current.items.push(item)
    })
    photoSwipe.current.invalidateCurrItems()
    photoSwipe.current.updateSize(true)
  }, [items])

  useEffect(() => {
    if (isOpen) {
      openPhotoSwipe()
    } else {
      closePhotoSwipe()
    }
  }, [closePhotoSwipe, isOpen, openPhotoSwipe])

  useEffect(() => {
    if (!isOpen) return
    updateItems()
  }, [isOpen, items, updateItems])

  return (
    <div
      id={id}
      className={wrapperClass}
      tabIndex={-1}
      role="dialog"
      aria-hidden="true"
      ref={pswpElement}
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

export default PhotoSwipe
