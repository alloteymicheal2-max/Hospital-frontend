import React, { use, useContext, useEffect, useState } from "react";
import { HeartPulse, LayoutDashboard, Users, FileText, BarChart3, SettingsIcon, WifiOff, LoaderCircle, Bell, Search, ChevronDown, Trash2, Menu, X, LogOut, ImagePlay, } from "lucide-react";
import Protectedroutes from "../Protectedroutes";


import { useNotification } from "../../NotificationContext";
import { Routes, Route, Link, NavLink, useNavigate, } from "react-router-dom";
import HM from "./Header.module.css";
import useInternetConnection from "../hooks/useInternetConnection";
import Dashboard from "../Dashboard/Dashboard";
import Patients from "../Patients/Patients";
import MedicalRecords from "../MedicalRecords/MedicalRecord";
import Reports from "../Report/Reports";
import Settings from "../Setting/Settings";
import RecycleBin from "../Recyclebin/Recyclebin";
import axios from "axios";


function Header() {
  const { notification: contextNotifications } = useNotification();
  const API = import.meta.env.VITE_HOSTING_API
  const isOnline = useInternetConnection();
  const [notificationExpanded, setNotificationExpanded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notification, setNotification] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const navigate = useNavigate();
  const { active100, setActive100 } = useNotification()
  const [settings, setSettings] = useState({
    hospital_name: "",
    hospital_email: "",
    hospital_phone: "",
    hospital_address: "",

    admin_name: "",
    admin_email: "",
    admin_phone: "",
    admin_role: "",

    email_notifications: true,
    appointment_reminders: true,
    patient_alerts: true
  })


  async function fetchNotifications() {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const user_id = user.id

      console.log("Fetching notifications for user:", user_id);
      const response = await axios.get(`${API}/notification/${user_id}`)
      const result = response.data

      if (result.success) {
        setNotification(result.data)
      }

    } catch (error) {
      console.log("Unable to fetch Notification", error)
    }
  }





  async function fetchUnreadNotifications() {
    try {
      const user = JSON.parse(localStorage.getItem("user"))
      const user_id = user.id
      const response = await axios.get(`${API}/notification/${user_id}/unread`)
      const result = response.data
      if (result.success) {
        console.log("UNREAD NOTIFICATIONS:", result.data);

        console.log("UNREAD COUNT:", result.data.length);
        setUnreadCount(result.data.length)
      }
    } catch (error) {
      console.log("Unable to fetch unread notifications")
      console.log("ERROR RESPONSE:", error.response);

      console.log("ERROR MESSAGE:", error.message);
    }
  }


  async function markAsRead(notification_id) {
    try {
      const response = await axios.put(`${API}/notification/${notification_id}`)
      const result = response.data

      if (result.success) {
        setNotification((previousNotifications) =>
          previousNotifications.map((notification) => {

            if (notification.id === notification_id) {
              return {
                ...notification,
                is_read: true
              }
            }
            return notification
          })
        )

        setUnreadCount((previousCount) => {
          if (previousCount > 0) {
            return previousCount - 1
          }

          return 0
        })
      }

    } catch (error) {
      console.log("Unable to mark notification as read", error)

    }
  }

  const closeMobileMenu = () => {
    setMenuOpen(false);
  };

  async function fetchadminDetails() {
    try {
      const response = await axios.get(`${API}/settings`)
      console.log("ADMIN RESPONSE", response.data)
      const result = response.data

      if (result.success === true && result.data.length > 0) {
        setSettings(result.data[0])
      }
    } catch (error) {
      console.log("Unble to fetch admin details", error)

      throw error;
    }
  }
  useEffect(() => {
    if (contextNotifications.length > 0) {
      fetchNotifications()
      setUnreadCount((previousCount) => {
        return previousCount + 1
      })
    }
  }, [contextNotifications])



  useEffect(() => {

    fetchadminDetails();
    fetchUnreadNotifications()

    fetchNotifications();
  }, []);

  return (
    <>
      <header className={`${HM.header} ${menuOpen ? HM.headerOpen : ""} ${active100? HM.hideH:""}`}>
        <Link to="/hospital/dashboard" className={HM.logoArea} onClick={closeMobileMenu} >
          <div className={HM.logoIcon}>    <HeartPulse size={21} onClick={() => navigate("/hospital/dashboard")} /></div>
          <div className={HM.logoText}>
            <strong>   {settings.hospital_name}  </strong>
            <span>  Hospital Management</span>
          </div>
        </Link>
        <button type="button" className={HM.menuButton} onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>  {menuOpen ? (<X size={22} />) : (<Menu size={22} />)}      </button>
        <nav className={`${HM.navigation} ${menuOpen ? HM.navigationOpen : ""}`}>
          <NavLink to="/hospital/dashboard" className={({ isActive }) => isActive ? `${HM.navLink} ${HM.active}` : HM.navLink} onClick={closeMobileMenu}> <LayoutDashboard size={17} />  <span> Dashboard </span> </NavLink>
          <NavLink to="/hospital/patients" className={({ isActive }) => isActive ? `${HM.navLink} ${HM.active}` : HM.navLink} onClick={closeMobileMenu}    >  <Users size={17} /><span>  Patients  </span></NavLink>
          <NavLink to="/hospital/medical-records" className={({ isActive }) => isActive ? `${HM.navLink} ${HM.active}` : HM.navLink} onClick={closeMobileMenu}><FileText size={17} /><span>Medical Records </span></NavLink>
          <NavLink to="/hospital/reports" className={({ isActive }) => isActive ? `${HM.navLink} ${HM.active}` : HM.navLink} onClick={closeMobileMenu}>  <BarChart3 size={17} /> <span>  Report </span></NavLink>
          <NavLink to="/hospital/recycle-bin" className={({ isActive }) => isActive ? `${HM.navLink} ${HM.active}` : HM.navLink} onClick={closeMobileMenu} ><Trash2 size={18} /><span>Recycle bin </span></NavLink>
          <NavLink to="/hospital/settings" className={({ isActive }) => isActive ? `${HM.navLink} ${HM.active}` : HM.navLink} onClick={closeMobileMenu}      >   <SettingsIcon size={17} /> <span> Settings   </span> </NavLink>
        </nav>
        <div className={HM.headerRight}>
          <div className={HM.connectionStatus}>
            <span className={isOnline ? HM.onlineDot : HM.offlineDot} />
            {/* <span> {isOnline ? "Online"     : "Offline"}   </span> */}
          </div>
          <button className={HM.iconButton} onClick={() => setNotificationOpen(!notificationOpen)} type="button" aria-label="Notifications"><Bell size={17} />{unreadCount > 0 && (<span className={HM.notificationBadge}   >  {unreadCount} </span>)}         </button>
          {notificationOpen && (
            <div className={`${HM.notificationPanel} ${notificationExpanded ? HM.notificationExpanded : ""}`} >
              <div className={HM.notificationHeader}>
                <div className={HM.notificationTitleArea}>
                  <div className={HM.notificationTitleIcon}>
                    <Bell size={19} />
                  </div>
                  <div>
                    <h3>Notifications</h3>
                    <p>
                      {unreadCount > 0 ? (`${unreadCount} unread notification`) : ("You're all caught up")}
                      {/* {unreadCount > 0? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`: "You're all caught up"} */}
                    </p>
                  </div>
                </div>
                <div className={HM.notificationHeaderActions}>
                  <button type="button" className={HM.expandNotificationButton} onClick={() => setNotificationExpanded(!notificationExpanded)} title={notificationExpanded ? "Collapse notifications" : "Expand notifications"} >{notificationExpanded ? (<X size={17} />) : (<ImagePlay size={17} />)}
                    <span>
                      {notificationExpanded ? "Collapse" : "Expand"}
                    </span>
                  </button>
                  <button type="button" onClick={() => { setNotificationOpen(false); setNotificationExpanded(false); }} className={HM.notificationClose} ><X size={17} />  </button>
                </div>
              </div>
              <div className={HM.notificationBody}>
                {notification.length === 0 ? (
                  <div className={HM.emptyNotification}>
                    <div className={HM.emptyNotificationIcon}>
                      <Bell size={30} />
                    </div>
                    <h4>No notifications</h4>
                    <p>
                      You're all caught up. New activity will appear here.
                    </p>
                  </div>
                ) : (
                  <div className={HM.notificationList}>
                    {notification.map((notification) => (
                      <div key={notification.id} className={`${HM.notificationItem} ${notification.is_read ? HM.notificationRead : HM.notificationUnread}`} onClick={() => markAsRead(notification.id)} >
                        <div className={HM.notificationItemIcon}>{notification.is_read ? (<Bell size={17} />) : (<div className={HM.unreadNotificationIcon}> <Bell size={17} /> </div>)}  </div>
                        <div className={HM.notificationItemContent}>
                          <div className={HM.notificationItemTop}>
                            <h4>
                              {notification.title}
                            </h4>
                            {!notification.is_read && (<span className={HM.unreadIndicator}>New </span>)}
                          </div>
                          <p>
                            {notification.message}
                          </p>
                          <span className={HM.notificationDate}>  {new Date(notification.created_at).toLocaleString().split("T")[0]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <button type="button" className={HM.logoutBtn} onClick={() => { navigate("/login"); localStorage.removeItem("token") }} > <LogOut size={17} /><span>Logout</span></button>
        </div>
        {!isOnline && (
          <div className={HM.offlineOverlay}>
            <div className={HM.offlineCard}>
              <div className={HM.offlineIcon}>
                <WifiOff size={42} strokeWidth={1.8} />
              </div>
              <div className={HM.offlineContent}>
                <h2> No Internet Connection  </h2>
                <p>Your internet connection appear     to be unavailable.</p>
                <div className={HM.waitingStatus}><LoaderCircle size={17} className={HM.spinner} /><span> Waiting for internet to be restored...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
      <Protectedroutes>
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="medical-records" element={<MedicalRecords />} />
          <Route path="reports" element={<Reports />} />
          <Route path="reports/:patients_id" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="recycle-bin" element={<RecycleBin />} />
        </Routes>
      </Protectedroutes>
    </>
  );
}


export default Header;
