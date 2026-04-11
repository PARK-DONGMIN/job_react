import './App.css'
import Menu from './Menu'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { getCopyright } from './components/Tool';
import Home from './components/Home'
import Signup from './components/employee/Signup';
import Employee_Find_all from './components/employee/Employee_Find_all';
import Employee_Read from './components/employee/Employee_Read';
import Employee_Update from './components/employee/Employee_Update';
import Employee_Delete from './components/employee/Employee_Delete';
import Employee_Update_password from './components/employee/Employee_Update_password';
import Employee_Login from './components/employee/Employee_Login';
import Employee_Logout from './components/employee/Employee_Logout';
import Info from './components/Info';
import Cate_List from './components/cate/Cate_List';
import Home_Img_Upload from './components/Home_Img_Upload';
import Home_Img_Download from './components/Home_Img_Download';

import Contents_List_all from './components/contents/Contents_List_all';
import Contents_List_all_paging from './components/contents/Contents_List_all_paging';
import Contents_List_all_paging_search from './components/contents/Contents_List_all_paging_search';
import Contents_List_all_paging_search_gallery from './components/contents/Contents_List_all_paging_search_gallery';

import Contents_Create from './components/contents/Contents_Create';
import Contents_Read from './components/contents/Contents_Read';
import Contents_Update_text from './components/contents/Contents_Update_text';
import Contents_Update_file1 from './components/contents/Contents_Update_file1';
import Contents_Delete from './components/contents/Contents_Delete';
import Contents_Youtube from './components/contents/Contents_Youtube';
import Contents_Map from './components/contents/Contents_Map';

function App() {

  return (
    <BrowserRouter>
      <div style={{width: '100%'}}>
        <Menu />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/employee/signup' element={<Signup />} />
          <Route path='/employee/find_all' element={<Employee_Find_all />} />
          <Route path='/employee/read/:employeeno' element={<Employee_Read />} />
          <Route path='/employee/update_password' element={<Employee_Update_password />} />
          <Route path='/employee/update/:employeeno' element={<Employee_Update />} />
          <Route path='/employee/delete/:employeeno' element={<Employee_Delete />} />
          <Route path='/employee/login' element={<Employee_Login />} />
          <Route path='/employee/logout' element={<Employee_Logout />} />
          <Route path='/cate/list' element={<Cate_List />} />
          <Route path='/info' element={<Info />} /> 
          <Route path='/home_img_upload' element={<Home_Img_Upload />} /> 
          <Route path='/home_img_download' element={<Home_Img_Download />} />
          {/* <Route path='/contents/list/:cateno' element={<Contents_List_all />} /> */}
          {/* <Route path='/contents/list/:cateno' element={<Contents_List_all_paging />} /> */}
          <Route path='/contents/list/:cateno' element={<Contents_List_all_paging_search />} />
          <Route path='/contents/list_gallery/:cateno' element={<Contents_List_all_paging_search_gallery />} />
          <Route path='/contents/create/:cateno' element={<Contents_Create />} />          
          <Route path='/contents/read/:contentsno' element={<Contents_Read />} />      
          <Route path='/contents/update_text/:contentsno' element={<Contents_Update_text />} /> 
          <Route path='/contents/update_file1/:contentsno' element={<Contents_Update_file1 />} />
          <Route path='/contents/delete/:contentsno' element={<Contents_Delete />} />
          <Route path='/contents/youtube/:contentsno' element={<Contents_Youtube />} />
          <Route path='/contents/map/:contentsno' element={<Contents_Map />} />

        </Routes>

        <div className='copyright'>{getCopyright()}</div>      
      </div>
    </BrowserRouter>


  )
}

export default App
