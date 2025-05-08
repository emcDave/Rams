import { Outlet, Link } from 'react-router-dom';
import logo from '../assets/rams-logo-refined.png';
export const Layout = () => {
    return (
      <div>
        <header>
          <div className="container">
         {/* home link with the logo */}
         <Link to="/" className="logo" aria-label="Home">
            <img
              src={logo}          // or "/rams-logo.png" if it’s in /public
              alt="RAMS logo"
              width={120}         // tweak size as you like
              height={80}
            />
          </Link>
            
          </div>
        </header>
        
        <main>
          <Outlet />
        </main>
        
        <footer>
          <div className="container">
            © {new Date().getFullYear()} MediTrack - Your Medication Tracker
          </div>
        </footer>
      </div>
    );
  };