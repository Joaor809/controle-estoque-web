import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Products from "./pages/Products/Products";
import Sell from "./pages/Sell/Sell";
import Sales from "./pages/Sales/Sales";
import Login from "./pages/Login/Login";
import PrivateRoute from "./Routes/PrivateRoute";
import Register from "./pages/Register/Register";
import Menu from "./components/Menu/Menu";

function App(){
  return(
    <BrowserRouter>
          <Routes>
              <Route path="/" element={<PrivateRoute><Dashboard/></PrivateRoute>}></Route>
              <Route path="/products" element={<PrivateRoute><Products/></PrivateRoute>}></Route>
              <Route path="/sell" element={<PrivateRoute><Sell/></PrivateRoute>}></Route>
              <Route path="/sales" element={<PrivateRoute><Sales/></PrivateRoute>}></Route>
              <Route path="/register" element={<Register/>}></Route>
              <Route path="/login" element={<Login/>}></Route>
              <Route path="/tests" element={<Menu/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;