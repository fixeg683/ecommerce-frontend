import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <div className="logo">
                <Link href="/">E-Soko</Link>
            </div>
            <div className="nav-links">
                {/* Changed from 'Shop' to 'Product List' */}
                <Link href="/products">Product List</Link>
                
                {user ? (
                    <>
                        <Link href="/cart">Cart</Link>
                        <button onClick={logout} className="logout-btn">Logout</button>
                    </>
                ) : (
                    <>
                        <Link href="/login">Login</Link>
                        <Link href="/signup">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;