import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Produtos from "./pages/Produtos/Produtos";
import Vender from "./pages/Vender/Vender";
import Vendas from "./pages/Vendas/Vendas";
import Login from "./pages/Login/Login";

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard/>}></Route>
        <Route path="/produtos" element={<Produtos/>}></Route>
        <Route path="/vender" element={<Vender/>}></Route>
        <Route path="/vendas" element={<Vendas/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;