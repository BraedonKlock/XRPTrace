import './App.css';
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import TransactionTree from "./pages/TransactionTreePage";

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/transaction-history" element={<TransactionTree/>} />
      </Routes>
      <Footer />
    </>
  )
}

export default App