import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../Tool';
import {Link} from 'react-router-dom'
import {useGlobalStore} from '../../store/store.js'
import update_img from '../../assets/images/update2.png';
import delete_img from '../../assets/images/delete2.png';

// useState() -->  App() --> useEffect()는 App() 함수가 처리되어 렌더링되고 나서 호출됨.
const Employee_Find_all = () => {
  console.log('-> Employee_Find_all 렌더링');
  const [data, setData] = useState([]);

  const {login, setLogin} = useGlobalStore();
  console.log('-> login:', login);
  
  useEffect(
    () => {
      axiosInstance.get(`/employee/find_all`)
      .then(result => result.data)
      .then(data => {
        console.log('-> data:', data);
        setData(data);
        console.log('-> setData(data)');
      })
      .catch(err => console.error(err));
    }, []); // 최초 1회만 실행

  return (
    <div>
      <div className='title_line' >관리자 목록</div>
      <table className='table_center table table-hover'>
        <tbody>
          {
            data.length == 0 ? (
              <tr><td>등록된 관리자가 없습니다.</td></tr>
            ): (
              data && data.map((item, index) => 
                <tr key={index}>
                  <td className='table_underline' style={{textAlign: 'center'}}>{index+1}</td>  
                  <td className='table_underline' style={{textAlign: 'center'}}>
                    <Link to={`/employee/read/${item.employeeno}`}>
                      {item.id}
                    </Link>
                  </td>  
                  <td className='table_underline' style={{textAlign: 'center'}}>
                    <Link to={`/employee/read/${item.employeeno}`}>
                      {item.mname}
                    </Link>                    
                  </td>  
                  <td className='table_underline' style={{textAlign: 'center'}}>{item.rdate?.substring(0, 10)}</td>  
                  <td className='table_underline' style={{textAlign: 'center'}}>
                    <Link to={`/employee/update/${item.employeeno}`}><img src={update_img} className='icon' /></Link> 
                    <Link to={`/employee/delete/${item.employeeno}`}><img src={delete_img} className='icon' /></Link>
                  </td>
                </tr>
              )
            )
          }
        </tbody>
      </table>
    </div>
  )
}

export default Employee_Find_all
