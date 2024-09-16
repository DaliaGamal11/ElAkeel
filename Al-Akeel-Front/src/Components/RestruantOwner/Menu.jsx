import Table from 'react-bootstrap/Table';
import { useState,useEffect } from "react";
export const Menu=()=> {
    if(localStorage.getItem("role")!=="restaurant-owner"){
        window.location.href="/SignIn"
    }
    const [data, setData] = useState([]);
    const [meal, setMeal] = useState({
        name:"",
        price:""
    });
    
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
                        <button className='btn btn-danger' onClick={()=>{
                            fetch(`http://localhost:8080/Al-Akeel-Back-1.0-SNAPSHOT/api/restaurant/remove-meal/${item.id}`,{
                                method:"DELETE",
                                headers:{
                                    "Content-Type":"application/json"
                                }
                            }).then((response)=>{
                                response.json().then((result)=>{
                                    console.log(result)
                                    alert("Deleted Successfully")
                                    window.location.href="/EditMenu"
                                })
                            }).catch((err)=>{
                                console.log(err)
                            }
                            )
                        }}>Delete</button>
                    </td>
                </tr>
            )
        })
    }
    const addMeal=()=>{
        if(meal.name!==""||meal.price!==""){
        fetch(`http://localhost:8080/Al-Akeel-Back-1.0-SNAPSHOT/api/restaurant/add-meal`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(meal)
        }).then((response)=>{
           if(response.status===200){
            alert("Added Successfully")
            window.location.href="/EditMenu"
           }
            else{
                alert("Something went wrong")
            }
        }).catch((err)=>{
            console.log(err)
        }
        )
    }
    else{
        alert("Please fill all the fields")
    }
    }

  return (
    <>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Meal Name</th>
          <th>Price</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {
            makeTable()
        }
      </tbody>
    </Table>
    <br/>
    <br/>

    <div className="Auth-form-container">
        <div className="Auth-form"  >
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Add New Meal</h3>
            <div className="form-group mt-3">
              <label>Meal Name</label>
              <input
                type="text"
                value={meal.name}
              onChange={(e) => setMeal({...meal,name:e.target.value})}
                className="form-control mt-1"
                placeholder="Enter Meal Name"
              />
            </div>
            <div className="form-group mt-3">
              <label>Meal price</label>
              <input
                type="text"
                value={meal.price}
              onChange={(e) => setMeal({...meal,price:e.target.value})}
                className="form-control mt-1"
                placeholder="Enter meal price ex: 10.5$"
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary" onClick={addMeal}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
    
  );
}

