import { useState } from "react";
import { Navigate } from "react-router-dom";
import "./SignUp.css";

export const SignUp = () => {
  var [username, setUsername] = useState("");
  var [pass, setPass] = useState("");
  var [role, setRole] = useState("customer");
  var [firstName, setfirstName] = useState("");
  var [deliveryFees, setdeliveryFees] = useState(0);
 
  async function handleSubmit() {

    if (role === "restaurant-owner") {
      const user = {
        username: username,
        password: pass,
        name: firstName
      };
      // Show successful login alert
     const response= await fetch(
        "http://localhost:8080/Al-Akeel-Back-1.0-SNAPSHOT/api/restaurant/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );
      const result=response;
      if(result.status===200)
      {
        alert("Registered Successfully")
        window.location.href="/SignIn"
      }
      else{
        alert("User Name is already used")
      }
    } else if (role === "customer") {
      const user = {
        username: username,
        password: pass,
        name: firstName
      };
      // Show successful login alert
      const response= await fetch(
        "http://localhost:8080/Al-Akeel-Back-1.0-SNAPSHOT/api/customer/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );

      const result=response;
      if(result.status===200)
      {
        alert("Registered Successfully")
        window.location.href="/SignIn"
      }
      else{

        alert("User Name is already used")
      }
    }
    else if (role === "runner") {
      const user = {
        username: username,
        password: pass,
        name: firstName,
        deliveryFees:deliveryFees
      };
      // Show successful login alert
      const response= await fetch(
        "http://localhost:8080/Al-Akeel-Back-1.0-SNAPSHOT/api/runner/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );
      const result=response;
      if(result.status===200)
      {
        alert("Registered Successfully")
        window.location.href="/SignIn"
      }
      else{
        alert("User Name is already used")
      }
    }
  }
  return (
    <div className="Auth-form-container">
      <div className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign Up</h3>
          <div className="form-group mt-3">

            <label>User Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control mt-1"
              placeholder="Enter your User Name "
            />
          </div>

          <div className="form-group mt-3">

            <label>Full Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setfirstName(e.target.value)}
              className="form-control mt-1"
              placeholder="Enter your first Name "
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
            />
          </div>
          {
            role==='runner'&&
            <div className="form-group mt-3">
            <label>Delivery fees</label>
            <input
              value={deliveryFees}
              onChange={(e) => setdeliveryFees(e.target.value)}
              type="number"
              className="form-control mt-1"
              placeholder="Enter password"
            />
          </div>
          }
          <div className="form-group mt-3">
            <label>Role</label>
            <select
              className="form-select mt-3"
              aria-label="Default select example"
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="customer">customer</option>
              <option value="restaurant-owner">Restaurant Owner</option>
              <option value="runner">Runner</option>
            </select>
          </div>
          <div className="d-grid gap-2 mt-3">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};