import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout";
import HomePage from "./pages/Homepage";
import RiskPage from "./pages/RiskPage";
import EditRiskPage from "./pages/EditRiskPage";
import RiskHistoryPage from "./pages/RiskHistoryPage";
import ViewPage from "./pages/ViewPage";
import SingleRiskViewPage from "./pages/SingleRiskViewPage";
import ProductPage from "./pages/ProductPage";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/risk" element={<RiskPage />} />
          <Route path="/edit/:issueKey" element={<EditRiskPage />} />
          <Route path="/view/:issueKey" element={<ViewPage />} />
          <Route path="/history" element={<RiskHistoryPage />} />
          <Route path="/single/:issueKey" element={<SingleRiskViewPage />} />
          <Route path="/product" element={<ProductPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;