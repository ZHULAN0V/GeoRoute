import { Provider } from 'react-redux'
import { store } from './store.tsx'

function MainProvider({children}: {children: React.ReactNode}) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}

export default MainProvider
