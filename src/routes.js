import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Main from './pages/Main';
import { getItem } from './utils/storage';

function ProtectedRoutes({ redirectTo }) {
    const token = getItem('token');

    return token ? <Outlet /> : <Navigate to={redirectTo} />;
}

function MainRoutes() {
    return (
        <Routes>
            <Route path='/' element={<Login />} />

            <Route element={<ProtectedRoutes redirectTo='/' />}>
                <Route path='main' element={<Main />} />
            </Route>
        </Routes>
    )
}

export default MainRoutes;