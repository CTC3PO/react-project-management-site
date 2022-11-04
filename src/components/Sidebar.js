import { NavLink } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

//import styles and images
import Avatar from "../components/Avatar";
import dashboardIcon from "../assets/dashboard_icon.svg";
import addIcon from "../assets/add_icon.svg";
import "./Sidebar.css";

export default function Sidebar() {
  //states (user) got from useAuthContext
  const { user } = useAuthContext();

  //return
  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="user">
          <Avatar src={user.photoURL} />
          <p>Hey {user.displayName}</p>
        </div>
      </div>
      <nav className="links">
        <ul>
          <li>
            <NavLink exact to="/">
              <img src={dashboardIcon} alt="dashboard icon" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/create">
              <img src={addIcon} alt="add-icon" />
              <span>New Project</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
