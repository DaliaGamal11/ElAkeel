import Table from 'react-bootstrap/Table';
import { useState,useEffect } from "react";
export const AllOrders=()=> {
    if(localStorage.getItem("role")!=="customer"){
        window.location.href="/SignIn"
    }
    const [data, setData] = useState([]);
    
    useEffect(() => {
        fetch(`http://localhost:8080/Al-Akeel-Back-1.0-SNAPSHOT/api/customer/order/${localStorage.getItem("id")}`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            }
        }).then((response)=>{
            if(response.status!==204){
            response.json().then((result)=>{
                setData(result)
            })
        }
        else{
            alert("No Orders Found")
        }
        }).catch((err)=>{
            console.log(err)
        }
        )
    }, [])
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
                            localStorage.setItem("orderId",item.id)
                            localStorage.setItem("resturantId",item.restaurant.id)
                            window.location.href="/EditOrder"
                        }}>Edit Order</button>
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
            <th>Edit</th>
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

