import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="">
      <Navbar />
      <div id="content" className="mt-20">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
