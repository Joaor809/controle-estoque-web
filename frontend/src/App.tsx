import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Produtos from "./pages/Produtos/Produtos";
import Vender from "./pages/Vender/Vender";
import Vendas from "./pages/Vendas/Vendas";
import Login from "./pages/Login/Login";
import PrivateRoute from "./Routes/PrivateRoute";

function App(){
  return(
    <BrowserRouter>
          <Routes>
              <Route path="/" element={<PrivateRoute><Dashboard/></PrivateRoute>}></Route>
              <Route path="/produtos" element={<PrivateRoute><Produtos/></PrivateRoute>}></Route>
              <Route path="/vender" element={<PrivateRoute><Vender/></PrivateRoute>}></Route>
              <Route path="/vendas" element={<PrivateRoute><Vendas/></PrivateRoute>}></Route>
              <Route path="/login" element={<Login/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;