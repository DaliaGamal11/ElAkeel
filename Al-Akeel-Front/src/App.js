import logo from './logo.svg';
import './App.css';
import  { BrowserRouter, Route, Routes } from 'react-router-dom';
import {NavBar} from './Components/NavBar/NavBar';
import { SignIn } from './Components/SignIn/SignIn';
import { SignUp } from './Components/SingUp/SignUp';
import { OwnerHome } from './Components/RestruantOwner/OwnerHome';
import { AddResturant } from './Components/RestruantOwner/AddRestuant';
import {AllResturants} from './Components/RestruantOwner/AllResturants';
import { Menu } from './Components/RestruantOwner/Menu';
import {Runner} from './Components/Runner/Runner';
import { AllTrips } from './Components/Runner/AllTrips';
import { AllRest } from './Components/Customer/AllRest';
import { Customer } from './Components/Customer/Customer';
import { RestMenu } from './Components/Customer/RestMenu';
import { AllOrders } from './Components/Customer/ALLOrders';
import { EditOrder } from './Components/Customer/EditOrder';
import {RestReport} from './Components/RestruantOwner/RestReport';
function App() {
  return (
    <div className="App">
      <NavBar />
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/ownerHome" element={<OwnerHome />} />
          <Route path="/addResturant" element={<AddResturant />} />
          <Route path="/allResturants" element={<AllResturants />} />
          <Route path="/EditMenu" element={<Menu />} />
          <Route path="/runnerHome" element={<Runner />} />
          <Route path="/trips" element={<AllTrips />} />
          <Route path="/allRest" element={<AllRest />} />
          <Route path="/customerHome" element={<Customer />} />
          <Route path="/restMenu" element={<RestMenu />} />
          <Route path="/allOrders" element={<AllOrders />} />
          <Route path="/editOrder" element={<EditOrder />} />
          <Route path="/CreateReport" element={<RestReport />} />


        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
