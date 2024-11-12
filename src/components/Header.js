import logo from "../../logo.jpeg"
import { Link } from "react-router-dom";
const Header=()=>{
    return(
        <div className="header">
        <img src={logo} height="100px" width="100px" />
         <div className="nav-items">
           <ul>
           <li><Link to="/newuser">New User</Link></li>
           <li> <Link to="/updateuser">Update User</Link></li>
           <li><Link to="/deleteuser">Delete user</Link></li>
           <li><Link to="/showuser">Show USer</Link></li>
           <li>Spare Parts data</li>
           <li><Link to="/">Home</Link></li>
            <li>About</li>
            <li>Contact Us</li>
           </ul>
         </div>

        </div>
    )
}

export default Header;