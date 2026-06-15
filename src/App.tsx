import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Layout from "./layout/Layout";

import HomePage from "./pages/HomePage";

import RiskPage from "./pages/RiskPage";
import EditRiskPage from "./pages/EditRiskPage";
import RiskHistoryPage from "./pages/RiskHistoryPage";


import "./styles/Header.css";

import "./styles/Sidebar.css";
import ViewPage from "./pages/ViewPage";

function App() {

    return (

        <BrowserRouter>

            <Layout>

                <Routes>

                    <Route
                        path="/"
                        element={<HomePage />}
                    />

                    <Route
                        path="/risk"
                        element={<RiskPage />}
                    />

                    <Route
                        path="/edit/:issueKey"
                        element={<EditRiskPage />}
                    />

                    <Route
                            path="/view/:issueKey"
                            element={<ViewPage />}
                   />
                    <Route
                                               path="/history"
                                               element={<RiskHistoryPage />}
                                      />



                </Routes>

            </Layout>

        </BrowserRouter>
    );
}

export default App;