import Table from 'react-bootstrap/Table';
import { useState,useEffect } from "react";
export const AllTrips=()=> {
    if(localStorage.getItem("role")!=="runner"){
        window.location.href="/SignIn"
    }
    const [data, setData] = useState([]);
    
    useEffect(() => {
        fetch(`http://localhost:8080/Al-Akeel-Back-1.0-SNAPSHOT/api/runner/getRunnerOrder/${localStorage.getItem("id")}`,{
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
                    <td>{item.date}</td>
                    <td>{item.customerId}</td>
                    <td>{item.restaurant.name}</td>
                    <td>{item.orderStatus}</td>
                    <td>{item.totalPrice}</td>
                    <td>
                    {
                            item.orderStatus!=="DELIVERED"&&
                        <button className="btn btn-primary" onClick={()=>{
                            fetch(`http://localhost:8080/Al-Akeel-Back-1.0-SNAPSHOT/api/runner/complete/${item.id}`,{
                                method:"POST",
                                headers:{
                                    "Content-Type":"application/json"
                                }
                            }).then((response)=>{
                                if(response.status===200){
                                    
                                    alert("Completed Successfully")
                                    window.location.href="/trips"
                                }
                                else{
                                    alert("Something went wrong")
                                }

                            }).catch((err)=>{
                                console.log(err)
                            }
                            )
                        }}>Completed</button>
                    }
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
          <th>Order Date</th>
          <th>Customer Id</th>
          <th>Restaurant Name</th>
          <th>Order Status</th>
            <th>Total Price</th>
            <th>Completed</th>
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

