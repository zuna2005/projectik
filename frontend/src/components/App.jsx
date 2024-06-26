import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
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
import Search from './Search'

function App() {
  const user = useSelector(state => state.login.currentUser)
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation()
  useEffect(() => {
    if (user.status === 'Blocked') {
      toast.error(t('blockedMessage'))
      dispatch(setUser({status: ''}))
    } else if (user.status === 'Deleted') {
      toast.error(t('deletedMessage'))
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
        <Route path='/search' element={<Search />} />
        <Route path='/user-page/:user_id' element={<MyPage />} />
        <Route path='/user-page/:user_id/new-collection' element={user.status == 'Active' ? <NewCollection /> : <Navigate to='/' />} />
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
