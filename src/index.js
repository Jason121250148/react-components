import React from 'react'
import ReactDom from 'react-dom'
// import { BrowserRouter } from 'react-router-dom'
// import { AppContainer } from 'react-hot-loader'
import App from './app'

const root = document.getElementById('root')

// function render(Component) {
// 	ReactDom.render(
// 		<AppContainer>
// 			<Component />
// 		</AppContainer>,
// 		root
// 	)
// }

ReactDom.render(
  <App />,
  root
)

// render(App)

// if (module.hot) {
//   module.hot.accept('./app', () => { render(App) })
// }