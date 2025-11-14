import './App.css';
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import TransactionGraph from "./pages/TransactionGraphPage";

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/transaction-history" element={<TransactionGraph/>} />
      </Routes>
    </>
  )
}

export default App