import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import LatestItems from './LatestItems'
import LargestCollections from './LargestCollections'
import TagCloud from './TagCloud'
import MyPage from './MyPage'
import NavBar from './NavBar'
import Tabs from './Tabs'

function App() {
  const user = useSelector(state => state.login.currentUser)
  return (
    <BrowserRouter>
      <NavBar />
      <Tabs />
      <Routes>
        <Route path='/' element={<LatestItems />}></Route>
        <Route path='/largest-collections' element={<LargestCollections />}></Route>
        <Route path='/tag-cloud' element={<TagCloud />}></Route>
        <Route path='/my-page' element={user.status != '' ? <MyPage /> : <Navigate to='/' />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
