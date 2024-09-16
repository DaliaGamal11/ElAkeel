import { useState } from "react";
import "./SignIn.css";
import { Navigate } from "react-router-dom";
export const SignIn = () => {
  var [username, setUsername] = useState("");
  var [pass, setPass] = useState("");
  var [role, setRole] = useState("customer");
  //assign cookies to the current session
 

async function handleSubmit () {
    const user={
        username:username,
        password:pass
    }
  
    if (role==="restaurant-owner") {
        // Show successful login alert
        await fetch("http://localhost:8080/Al-Akeel-Back-1.0-SNAPSHOT/api/restaurant/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(user)
        }).then((response)=>{
            if(response.status===200){
               response.json().then((result)=>{
                    console.log(result)
                
                    localStorage.setItem("userName",result.username)
                    localStorage.setItem("password",result.password)
                    localStorage.setItem("id",result.id)
                    localStorage.setItem("name",result.name)
                    localStorage.setItem("role",role)
                    alert("Login successful")
                    window.location.href="/ownerHome"
              })
            }
            else{
                alert("Invalid username or password")
            }
        }).catch((err)=>{
            console.log(err)
        }

        )
    }
    else if(role==="runner"){
       // Show successful login alert
       await fetch("http://localhost:8080/Al-Akeel-Back-1.0-SNAPSHOT/api/runner/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(user)
    }).then((response)=>{
        if(response.status===200){
            response.json().then((result)=>{
            
                localStorage.setItem("userName",result.username)
                localStorage.setItem("password",result.password)
                localStorage.setItem("id",result.id)
                localStorage.setItem("status",result.status)
                localStorage.setItem("deliveryFees",result.deliveryFees)
                localStorage.setItem("name",result.name)
                localStorage.setItem("numberOfTrips",result.numberOfTrips)
                localStorage.setItem("role",role)
                alert("Login successful")
                window.location.href="/runnerHome"
            }
        )}
        else{
            alert("Invalid username or password")
        }
    }).catch((err)=>{
        console.log(err)
    }

    )

    }
    else if(role==="customer"){
   await fetch(`http://localhost:8080/Al-Akeel-Back-1.0-SNAPSHOT/api/customer/login`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",            
        },
        body:JSON.stringify(user)


    }).then((response)=>{
      
      if (response.status==200){
        
        response.json().then((result)=>{
          alert("Login successful")
          localStorage.setItem("userName",result.username)
                localStorage.setItem("password",result.password)
                localStorage.setItem("id",result.id)
                localStorage.setItem("status",result.status)
                localStorage.setItem("name",result.name)
                localStorage.setItem("role",role)
         //move to the home page with the same cookies in this page
          window.location.href="/CustomerHome"

        })
      }
      else{
        alert("Invalid username or password")
      }
    }).catch((err)=>{
      console.log(err)
    })
  }

}
  return (
    <div className="Auth-form-container">
      <div className="Auth-form"  >
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="form-group mt-3">
            <label>UserName</label>
            <input
              type="text"
              value={username}
            onChange={(e) => setUsername(e.target.value)}
              className="form-control mt-1"
              placeholder="Enter Your Username"
              required
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              value={pass}
                onChange={(e) => setPass(e.target.value)}
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              required
            />
          </div>
          <div className="form-group mt-3">
            <label>Role</label>
          <select className="form-select mt-3" aria-label="Default select example" onChange={(e) => setRole(e.target.value)}>
                <option value="customer">customer</option>
                <option value="restaurant-owner">Restruant Owner</option>
                <option value="runner">Runner</option>
            </select>
            </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
              Submit
            </button>
          </div>
           
        
          <p className="forgot-password text-right mt-2">
            Already Have -
             <a href="/SignUp"> Account?</a>
          </p>
        </div>
      </div>
    </div>
  );
};

