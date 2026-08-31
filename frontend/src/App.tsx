import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Produtos from "./pages/Produtos/Produtos";
import Vendas from "./pages/Vendas/Vendas";

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard/>}></Route>
        <Route path="/produtos" element={<Produtos/>}></Route>
        <Route path="/vender" element={<Vendas/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;