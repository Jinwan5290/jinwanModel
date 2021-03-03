import React from 'react'
import PhotoSwipe from './PhotoSwipe'
// import PhotoSwipe from './func'

class App extends React.Component<any, any> {
  state = {
    isOpen: false,
  }

  setIsOpen = () => {
    this.setState({
      isOpen: true,
    })
  }

  handleClose = () => {
    console.log('handleClose')
  }

  render() {
    const items = [
      {
        src: 'https://farm2.staticflickr.com/1043/5186867718_06b2e9e551_b.jpg',
      },
      {
        src: 'https://farm7.staticflickr.com/6175/6176698785_7dee72237e_b.jpg',
      },
    ]

    const options = {
      // http://photoswipe.com/documentation/options.html
    }

    return (
      <div>
        hello jinwan
        <button onClick={this.setIsOpen}>click</button>
        <PhotoSwipe
          isOpen={this.state.isOpen}
          items={items}
          options={options}
          onClose={this.handleClose}
        />
      </div>
    )
  }
}

export default App
