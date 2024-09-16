import Table from 'react-bootstrap/Table';
import { useState,useEffect } from "react";
export const AllRest=()=> {
    if(localStorage.getItem("role")!=="customer"){
        window.location.href="/SignIn"
    }
    const [data, setData] = useState([]);
    
    useEffect(() => {
        fetch("http://localhost:8080/Al-Akeel-Back-1.0-SNAPSHOT/api/customer/restaurants",{
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            }
        }).then((response)=>{
            response.json().then((result)=>{
                setData(result)
            })
        }).catch((err)=>{
            console.log(err)
        }
        )
    }, [])
    console.log(data)
    function makeTable(){
        return data.map((item,index)=>{
            return(
                <tr key={index} >
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.ownerId}</td>
                    <td>
                        <button className="btn btn-primary" onClick={()=>{
                            localStorage.setItem("resturantId",item.id)
                            window.location.href="/restMenu"
                        }}>Show Menu</button>
                    </td>
                 
                </tr>
            )
        })
    }
  return (
    
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Restaurant Name</th>
          <th>Owner Id</th>
          <th>Show Menu</th>
        </tr>
      </thead>
      <tbody>
        {
            makeTable()
        }
      </tbody>
    </Table>
  );
}

