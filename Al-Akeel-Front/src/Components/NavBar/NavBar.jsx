import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

export const  NavBar=()=> {
  //get the role from local storage
  var role = localStorage.getItem("role");
  //if the role is admin
  if (role === "restaurant-owner") {
    return (
      <Navbar bg="light" expand="lg" >
        <Container>
          <Navbar.Brand href="/ownerHome">Restaurant Owner View</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="me-auto">
              <Nav.Link href="/ownerHome">Home</Nav.Link>
              <Nav.Link href="/addResturant">Add Restaurant Menu</Nav.Link>
              <Nav.Link href="/allResturants">All Restaurants</Nav.Link>
              <Nav.Link style={{color:"red"}} href="/SignIn" onClick={()=>{localStorage.clear()}}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
  else if(role==="runner"){
    return(
      <Navbar bg="light" expand="lg" >
      <Container>
        <Navbar.Brand href="/runnerHome">Runner View</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="me-auto">
            <Nav.Link href="/runnerHome">Home</Nav.Link>
            <Nav.Link href="/trips">Trip Requests</Nav.Link>
            <Nav.Link style={{color:"red"}} href="/SignIn" onClick={()=>{localStorage.clear()}}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    )
  }
  else if (role === "customer") {
    return (
      <Navbar bg="light" expand="lg" >
        <Container>
          <Navbar.Brand href="/customerHome">Customer View</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="me-auto">
              <Nav.Link href="/customerHome">Home</Nav.Link>
              <Nav.Link href="/allRest">Restaurants</Nav.Link>
              <Nav.Link href="/AllOrders">Orders</Nav.Link>
              <Nav.Link style={{color:"red"}} href="/SignIn" onClick={()=>{localStorage.clear()}}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
  else if(role===null){
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/signin">SignIn</Nav.Link> 
            <Nav.Link href="/signup">SignUp</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
  }
}

