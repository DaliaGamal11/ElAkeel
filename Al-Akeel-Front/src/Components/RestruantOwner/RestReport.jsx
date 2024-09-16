import React from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import './OwnerHome.css'
import { useEffect } from 'react';
export const RestReport =()=> {
    if(localStorage.getItem("role")!=="restaurant-owner"){
        window.location.href="/SignIn"
    }
    const [data,setData]=React.useState([])
    //get the user info from local storage
    useEffect(() => {
        fetch(`http://localhost:8080/Al-Akeel-Back-1.0-SNAPSHOT/api/restaurant/report/${localStorage.getItem("resturantId")}`,{
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

  return (
    <section className="vh-100" style={{ backgroundColor: '#f4f5f7' }}>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="6" className="mb-4 mb-lg-0">
            <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
              <MDBRow className="g-0">
                <MDBCol md="4" className="gradient-custom text-center text-white"
                  style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                    <br>
                    </br>
                    <MDBCardText>Resturant Report</MDBCardText>

                    <br>
                    </br>
                    <MDBTypography tag="h6"> Resturant Name</MDBTypography>
                  <MDBTypography tag="h5">{data.Restaurant}</MDBTypography>
                  <MDBIcon far icon="edit mb-5" />
                </MDBCol>
                <MDBCol md="8">
                  <MDBCardBody className="p-4">
                    <MDBTypography tag="h6">Information</MDBTypography>
                    <hr className="mt-0 mb-4" />
                    <MDBRow className="pt-1">
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6"> Total Earnings</MDBTypography>
                        <MDBCardText className="text-muted">{data.Total_earnings}</MDBCardText>
                      </MDBCol>
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6"> Completed Orders</MDBTypography>
                        <MDBCardText className="text-muted">{data.Completed_orders}</MDBCardText>
                      </MDBCol>
                    </MDBRow>

                    <MDBTypography tag="h6">Information</MDBTypography>
                    <hr className="mt-0 mb-4" />
                    <MDBRow className="pt-1">
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">Canceled Orders</MDBTypography>
                        <MDBCardText className="text-muted">{data.Canceled_orders}</MDBCardText>
                      </MDBCol>
                    </MDBRow>

                    <div className="d-flex justify-content-start">
                      <a href="#!"><MDBIcon fab icon="facebook me-3" size="lg" /></a>
                      <a href="#!"><MDBIcon fab icon="twitter me-3" size="lg" /></a>
                      <a href="#!"><MDBIcon fab icon="instagram me-3" size="lg" /></a>
                    </div>
                  </MDBCardBody>
                </MDBCol>
              </MDBRow>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}