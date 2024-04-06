import './styles.css';
import { useNavigate } from 'react-router-dom';
import Profiler from '../../assets/user-icon.svg';
import Logout from '../../assets/logout.svg';
import Logo from '../../assets/fav_icon_b.jpeg';
import { clear, getItem } from '../../utils/storage';

function Header({ handleEditProfiler }) {
    const navigate = useNavigate();

    const userName = getItem('userName');

    function handleLogout() {
        clear();
        navigate('/');
    }
    return (
        <header>
            <img src={Logo} alt="logo" />
            <div className="container-sign-out">
                <div className="profiler-area" onClick={handleEditProfiler}>
                    <img src={Profiler} alt="profile" />
                    <strong>{userName}</strong>
                </div>
                <img
                    src={Logout}
                    alt="logout"
                    className="sign-out"
                    onClick={handleLogout}
                />
            </div>
        </header>
    )
}

export default Header;