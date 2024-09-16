import React, { useState } from "react";
export const AddResturant=()=>{
    var [restaurant, setResturant] = useState({
        name:"",
        ownerId:localStorage.getItem("id")
    });
    const handleSubmit =async  () => {
        const res = await fetch(
            "http://localhost:8080/Al-Akeel-Back-1.0-SNAPSHOT/api/restaurant/create",
            {
              method: "POST",
              body: JSON.stringify(restaurant),
              headers: {
                "Content-Type": "application/json"
              }
            }
          );
          const data = res;
          if (data.status === 200) {
            window.location.href = "/AllResturants";
          } else {
            alert(data+",try another Restaurant Name");
          }
    };

    return (
        <div className="Auth-form-container">
        <div className="Auth-form"  >
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Add New Resturnat</h3>
            <div className="form-group mt-3">
              <label>Restaurant Name</label>
              <input
                type="text"
                value={restaurant.name}
              onChange={(e) => setResturant({...restaurant,name:e.target.value})}
                className="form-control mt-1"
                placeholder="Enter Restaurant Name"
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}