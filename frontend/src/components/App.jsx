import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from "../features/loginSlice"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
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
import Admin from './Admin'
import EditItem from './EditItem'
import EditCollection from './EditCollection'

function App() {
  const user = useSelector(state => state.login.currentUser)
  const dispatch = useDispatch()
  useEffect(() => {
    if (user.status === 'Blocked') {
      toast.error('Your account has been blocked.')
      dispatch(setUser({status: ''}))
    } else if (user.status === 'Deleted') {
      toast.error('Your account has been deleted. You can re-register if you want.')
      dispatch(setUser({status: ''}))
    }
  }, [user])
  return (
    <BrowserRouter>
      <NavBar />
      <Tabs />
      <ToastContainer />
      <Routes>
        <Route path='/' element={<LatestItems />} />
        <Route path='/largest-collections' element={<LargestCollections />} />
        <Route path='/tag-cloud' element={<TagCloud />} />
        <Route path='/my-page' element={user.status == 'Active' ? <MyPage /> : <Navigate to='/' />} />
        <Route path='/my-page/new-collection' element={user.status == 'Active' ? <NewCollection /> : <Navigate to='/' />} />
        <Route path='/collection-page/:coll_id' element={<CollectionPage />} />
        <Route path='/collection-page/:coll_id/edit-collection' element={user.status == 'Active' ? <EditCollection /> : <Navigate to='/' />} />
        <Route path='/collection-page/:coll_id/new-item' element={user.status == 'Active' ? <NewItem /> : <Navigate to='/' />} />
        <Route path='/item-page/:item_id' element={<ItemPage />} />
        <Route path='/item-page/:item_id/edit-item' element={user.status == 'Active' ? <EditItem /> : <Navigate to='/' />} />
        <Route path='/admin' element={user.admin ? <Admin /> : <Navigate to='/' />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
