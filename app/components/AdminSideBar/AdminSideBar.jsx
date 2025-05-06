"use client";

// import './style.css'

// export default function AdminSideBar() {
//   return (
//     <div>
//       <header class="header" id="header">
//         <div class="header_toggle">
//           {" "}
//           <i class="bx bx-menu" id="header-toggle"></i>{" "}
//         </div>
//         <div class="header_img">
//           {" "}
//           <img src="https://i.imgur.com/hczKIze.jpg" alt="" />{" "}
//         </div>
//       </header>
//       <div class="l-navbar" id="nav-bar">
//         <nav class="nav">
//           <div>
//             {" "}
//             <a href="#" class="nav_logo">
//               {" "}
//               <i class="bx bx-layer nav_logo-icon"></i>{" "}
//               <span class="nav_logo-name">BBBootstrap</span>{" "}
//             </a>
//             <div class="nav_list">
//               {" "}
//               <a href="#" class="nav_link active">
//                 {" "}
//                 <i class="bx bx-grid-alt nav_icon"></i>{" "}
//                 <span class="nav_name">Dashboard</span>{" "}
//               </a>{" "}
//               <a href="#" class="nav_link">
//                 {" "}
//                 <i class="bx bx-user nav_icon"></i>{" "}
//                 <span class="nav_name">Users</span>{" "}
//               </a>{" "}
//               <a href="#" class="nav_link">
//                 {" "}
//                 <i class="bx bx-message-square-detail nav_icon"></i>{" "}
//                 <span class="nav_name">Messages</span>{" "}
//               </a>{" "}
//               <a href="#" class="nav_link">
//                 {" "}
//                 <i class="bx bx-bookmark nav_icon"></i>{" "}
//                 <span class="nav_name">Bookmark</span>{" "}
//               </a>{" "}
//               <a href="#" class="nav_link">
//                 {" "}
//                 <i class="bx bx-folder nav_icon"></i>{" "}
//                 <span class="nav_name">Files</span>{" "}
//               </a>{" "}
//               <a href="#" class="nav_link">
//                 {" "}
//                 <i class="bx bx-bar-chart-alt-2 nav_icon"></i>{" "}
//                 <span class="nav_name">Stats</span>{" "}
//               </a>{" "}
//             </div>
//           </div>{" "}
//           <a href="#" class="nav_link">
//             {" "}
//             <i class="bx bx-log-out nav_icon"></i>{" "}
//             <span class="nav_name">SignOut</span>{" "}
//           </a>
//         </nav>
//       </div>

//       <div class="height-100 bg-light">
//         <h4>Main Components</h4>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import "./style.css";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { LiaUserSolid } from "react-icons/lia";
import { LuMessageSquareText } from "react-icons/lu";
import { CiBookmark } from "react-icons/ci";
import { LuFiles } from "react-icons/lu";
import { IoStatsChartOutline } from "react-icons/io5";
import { PiSignOutFill } from "react-icons/pi";

export default function AdminSideBar() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [activeLink, setActiveLink] = useState("dashboard");

  useEffect(() => {
    // Add any initialization logic here if needed
  }, []);

  return (
    <div>
      <header
        className={`header ${isNavExpanded ? "body-pd" : ""}`}
        id="header"
      >
        <div className="header_toggle">
          <button
            className={`bx bx-menu ${isNavExpanded ? "bx-x" : ""}`}
            id="header-toggle"
            onClick={() => setIsNavExpanded(!isNavExpanded)}
          >
            ClickMe
          </button>
        </div>
        <div className="header_img">
          <img src="https://i.imgur.com/hczKIze.jpg" alt="" />
        </div>
      </header>

      <div className={`l-navbar ${isNavExpanded ? "show" : ""}`} id="nav-bar">
        <nav className="nav">
          <div>
            <a href="#" className="nav_logo">
              <i className="bx bx-layer nav_logo-icon" />
              <span className="nav_logo-name">Relot</span>
            </a>

            <div className="nav_list">
              <a
                href="#"
                className={`nav_link ${
                  activeLink === "dashboard" ? "active" : ""
                }`}
                onClick={() => setActiveLink("dashboard")}
              >
                <MdOutlineSpaceDashboard />
                <span className="nav_name">Dashboard</span>
              </a>

              <a
                href="#"
                className={`nav_link ${activeLink === "users" ? "active" : ""}`}
                onClick={() => setActiveLink("users")}
              >
                <LiaUserSolid />
                <span className="nav_name">Users</span>
              </a>

              <a
                href="#"
                className={`nav_link ${
                  activeLink === "messages" ? "active" : ""
                }`}
                onClick={() => setActiveLink("messages")}
              >
                <LuMessageSquareText />
                <span className="nav_name">Messages</span>
              </a>

              <a
                href="#"
                className={`nav_link ${
                  activeLink === "bookmark" ? "active" : ""
                }`}
                onClick={() => setActiveLink("bookmark")}
              >
                <CiBookmark />
                <span className="nav_name">Bookmark</span>
              </a>

              <a
                href="#"
                className={`nav_link ${activeLink === "files" ? "active" : ""}`}
                onClick={() => setActiveLink("files")}
              >
                <LuFiles />
                <span className="nav_name">Files</span>
              </a>

              <a
                href="#"
                className={`nav_link ${activeLink === "stats" ? "active" : ""}`}
                onClick={() => setActiveLink("stats")}
              >
                <IoStatsChartOutline />
                <span className="nav_name">Stats</span>
              </a>
            </div>
          </div>

          <a
            href="#"
            className="nav_link"
            onClick={() => setActiveLink("signout")}
          >
            <PiSignOutFill />
            <span className="nav_name">SignOut</span>
          </a>
        </nav>
      </div>

      <div className={`height-100 bg-light ${isNavExpanded ? "body-pd" : ""}`}>
        <h4>Main Components</h4>
      </div>
    </div>
  );
}
