import Table from 'react-bootstrap/Table';
import { useState,useEffect } from "react";
export const EditOrder=()=> {
    if(localStorage.getItem("role")!=="customer"){
        window.location.href="/SignIn"
    }
    const [data, setData] = useState([]);
    const [meal, setMeal] = useState({
        name:"",
        price:""
    });
    const [mealList, setMealList] = useState([]);
    useEffect(() => {
        fetch(`http://localhost:8080/Al-Akeel-Back-1.0-SNAPSHOT/api/customer/meals/${localStorage.getItem("resturantId")}`,{
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
                    <td>{item.price}</td>
                    <td>
                        <button className="btn btn-primary" onClick={()=>{
                            setMealList([...mealList,item])
                            console.log(mealList)
                        }}>Add</button>
                    </td>
                </tr>
            )
        })
    }
    function makeTable2(){
        return mealList.map((item,index)=>{
            return(
                <tr key={index} >
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                   
                </tr>
            )
        })
    }
    function editOrder(){
        fetch(`http://localhost:8080/Al-Akeel-Back-1.0-SNAPSHOT/api/customer/edit-order/${localStorage.getItem("orderId")}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(mealList)
        }).then((response)=>{
            if(response.status===200){
                alert("Order Edited Successfully")
                window.location.href="/AllOrders"
            }
            else{
                alert ("Something went wrong")
                        }

        }).catch((err)=>{
            console.log(err)
        }
        )
    }
   

  return (
    <>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Meal Name</th>
          <th>Price</th>
          <th>Add To Order</th>
        </tr>
      </thead>
      <tbody>
        {
            makeTable()
        }
      </tbody>
    </Table>
    <br/>
    <h1>Your Meals List</h1>
    <Table striped bordered hover>

      <thead>
        <tr>
          <th>#</th>
          <th>Meal Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {
            makeTable2()
        }
      </tbody>
    </Table>
    <button className="btn btn-primary" onClick={()=>{editOrder()}
    }>Edit Order</button>
    </>
    
  );
}

