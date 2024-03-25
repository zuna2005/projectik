import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import LatestItems from './LatestItems'
import LargestCollections from './LargestCollections'
import TagCloud from './TagCloud'
import MyPage from './MyPage'
import NavBar from './NavBar'
import Tabs from './Tabs'
import NewCollection from './NewCollection'
import CollectionPage from './CollectionPage'
import NewItem from './NewItem'
import ItemPage from './ItemPage'

function App() {
  const user = useSelector(state => state.login.currentUser)
  return (
    <BrowserRouter>
      <NavBar />
      <Tabs />
      <Routes>
        <Route path='/' element={<LatestItems />} />
        <Route path='/largest-collections' element={<LargestCollections />} />
        <Route path='/tag-cloud' element={<TagCloud />} />
        <Route path='/my-page' element={user.status != '' ? <MyPage /> : <Navigate to='/' />} />
        <Route path='/my-page/new-collection' element={<NewCollection />} />
        <Route path='/collection-page/:coll_id' element={<CollectionPage />} />
        <Route path='/collection-page/:coll_id/new-item' element={<NewItem />} />
        <Route path='/item-page/:item_id' element={<ItemPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
