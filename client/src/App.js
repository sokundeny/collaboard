import "./index.css"
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import HomePage from "./pages/HomePage";
import BoardsPage from "./pages/BoardsPage";
import PersonalPage from "./pages/PersonalPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import BoardView from "./pages/BoardView";
import { SidebarProvider } from "./context/SidebarContext";
import ProtectedRoute from "./components/protectedRoute";

function App() {
    return (
        <SidebarProvider>
                <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={
                            <ProtectedRoute>
                                <HomePage/>
                            </ProtectedRoute>
                        } />   

                        <Route path="/boards" element={
                            <ProtectedRoute>
                                <BoardsPage />
                            </ProtectedRoute>
                        } />


                        <Route path="/board/:id" element={
                            <ProtectedRoute>
                                <BoardView />
                            </ProtectedRoute>
                        } />

                        <Route path="/user/profile" element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        } />

                        <Route path="/personal" element={<PersonalPage />} />
                        <Route path="/login" element={<LoginPage/>}/>
                    </Routes>
                    </AuthProvider>
                </BrowserRouter>
        </SidebarProvider>  
    );
}

export default App;
