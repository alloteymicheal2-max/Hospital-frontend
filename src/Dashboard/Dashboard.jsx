
import React, { useState, useEffect } from "react";
import { Users, FileText, Bell, Mail, CalendarClock, ArrowUpRight, UserPlus, ClipboardPlus, Settings as SettingsIcon, FileBarChart, Building2, Phone, MapPin, ShieldCheck, Activity, CheckCircle2, CircleAlert, RefreshCw, } from "lucide-react";
import HM from "./Dashboard.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Dashboard() {
  const API = import.meta.env.VITE_HOSTING_API
  const [patients, setPatients] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [medicalRecords, setMedicalRecords] = useState([])
  const [dashboardError, setDashboardError] = useState("");
  const navigate = useNavigate()

  const [dashboardStats, setDashboardStats] = useState({
    total_patients: 0,
    active_patients: 0,
    waiting_patients: 0,
    discharged_patients: 0,
    new_this_month: 0,
    todays_visits: 0
  });

  const [settings, setSettings] = useState({
    hospital_name: "",
    hospital_email: "",
    hospital_phone: "",
    hospital_address: "",

    admin_name: "",
    admin_email: "",
    admin_phone: "",
    admin_role: "",

    email_notification: true,
    appointment_reminders: true,
    patients_alerts: true
  })


  async function fetchDashboardStats() {
    try {

      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/dashboard`, { headers: { Authorization: `Bearer ${token}` } });
      console.log("DASHBOARD RESPONSE", response.data)
      const result = response.data;

      if (result.success === true) {
        setDashboardStats(result.data);
      }
    } catch (error) {
      console.log("Unable to fetch dashboard statistics", error);
      throw error;
    }
  }

  async function handleRefresh() {
    setIsRefreshing(true)

    try {
      await Promise.all([
        fetchadminDetails(),
        fetchPatient(),
        fetchMedicalRecords(),
        fetchDashboardStats()
      ]
      )
      setDashboardError("")
    } catch (error) {
      console.log("Unable to refresh dashboard", error);

      setDashboardError("Unable to refresh dashboard data. Please check your connection and try again.")

    }
    finally {

      setIsRefreshing(false)
    }
  }


  async function fetchadminDetails() {
    try {
      const response = await axios.get(`${API}/settings`)
      console.log("ADMIN RESPONSE", response.data)
      const result = response.data

      if (result.success === true && result.data.length > 0) {
           console.log(" DASHBOARD SETTINGS RECEIVED:", result.data[0])
      console.log(" EMAIL:", result.data[0].email_notification)
      console.log(" APPOINTMENT:", result.data[0].appointment_reminders)
      console.log(" PATIENT ALERTS:", result.data[0].patients_alerts)
        setSettings(result.data[0])
      }
    } catch (error) {
      console.log("Unble to fetch admin details", error)

      throw error;
    }
  }
  async function fetchPatient() {

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/patient`, { headers: { Authorization: `Bearer ${token}` } })
      console.log("Patient response", response.data)
      const result = response.data
      if (result.success === true) {
        setPatients(result.data)
      }
    } catch (error) {
      console.log("Unable to fetch Patients", error);

      throw error;
    }
  }

  async function fetchMedicalRecords() {
    try {
      const response = await axios.get(`${API}/medical`)

      console.log("Medical resopnse", response.data)
      const result = response.data
      if (result.success === true) {
        setMedicalRecords(result.data)
      }
    } catch (error) {
      console.log("Unable to fetch medical records", error)

      throw error;
    }
  }

  useEffect(() => {
    async function loadDashbord() {
      setLoading(true)
      setDashboardError("")

      try {
        await Promise.all([
          fetchadminDetails(),
          fetchPatient(),
          fetchMedicalRecords(),
          fetchDashboardStats()
        ])

      } catch (error) {
        console.log("Unable to laod dashbord", error)
        setDashboardError("Unable to load dashboard data. Please try again.")
      }
      finally {
        setLoading(false)
      }
    }

    loadDashbord()

  }, [])
  return (
    <div>
      <div className={HM.page}>
        <div>
          <br className={HM.br1}></br>
          <br className={HM.br2}></br>
          <br className={HM.br3}></br>
          <br className={HM.br4}></br>
        </div>
        <div className={HM.container}>

          {loading && (
            <div className={HM.loadingOverlay}>
              <div className={HM.loadingCard}>
                <div className={HM.loadingSpinner}></div>
                <h3>Loading Dashboard</h3>
                <p>
                  Preparing your hospital data...
                </p>
              </div>
            </div>
          )}
          {dashboardError && !loading && (
            <div className={HM.errorCard}>
              <div className={HM.errorIcon}>
                <CircleAlert size={22} />
              </div>
              <div className={HM.errorContent}>
                <h3>Server error  Unable to load dashboard</h3>
                <p>{dashboardError}</p>
              </div>

              <button className={HM.retryButton} onClick={handleRefresh} disabled={isRefreshing} >
                <RefreshCw size={16} className={isRefreshing ? HM.spinning : ""} />
                {isRefreshing ? "Retrying..." : "Try Again"}
              </button>
            </div>
          )}

          {/* =========================
               DASHBOARD HEADER
           ========================= */}
          <section className={HM.header}>
            <div className={HM.headerText}>
              <div className={HM.eyebrow}>
                <Activity size={15} />
                Hospital Overview
              </div>
              <h1>
                Good day, {settings.admin_name}
              </h1>

              <p>
                Here's what's happening across{" "}
                <strong>
                  {settings.hospital_name}
                </strong>
                .
              </p>
            </div>
            <div className={HM.headerActions}>
              <button className={HM.refreshButton} disabled={isRefreshing} onClick={handleRefresh} title="Refresh dashboard" ><RefreshCw size={17} className={isRefreshing ? HM.spinning : ""} />  </button>
              <div className={HM.systemStatus}>
                <span className={HM.statusDot}></span>
                <div>
                  <strong>
                    System Online
                  </strong>

                  <span>
                    All services operational
                  </span>
                </div>

              </div>

            </div>

          </section>


          {/* =========================
               STATISTICS
           ========================= */}

          <section className={HM.statsGrid}>

            {/* TOTAL PATIENTS */}

            <div className={HM.statCard}>

              <div className={HM.statTop}>

                <div className={`${HM.statIcon} ${HM.greenIcon}`}>
                  <Users size={21} />
                </div>

                <button
                  className={HM.statLink}
                  title="View patients"
                >
                  <ArrowUpRight size={17} />
                </button>

              </div>

              <div className={HM.statValue}>
                {dashboardStats.total_patients}
              </div>

              <div className={HM.statLabel}>
                Total Patients
              </div>

              <div className={HM.statFooter}>
                <span>
                  <Activity size={13} />
                  {dashboardStats.active_patients} Active Patients
                </span>
              </div>

            </div>


            {/* MEDICAL RECORDS */}

            <div className={HM.statCard}>

              <div className={HM.statTop}>

                <div className={`${HM.statIcon} ${HM.blueIcon}`}>
                  <FileText size={21} />
                </div>

                <button
                  className={HM.statLink}
                  title="View medical records"
                >
                  <ArrowUpRight size={17} />
                </button>

              </div>

              <div className={HM.statValue}>
                {medicalRecords.length}
              </div>

              <div className={HM.statLabel}>
                Medical Records
              </div>

              <div className={HM.statFooter}>
                <span>
                  <FileText size={13} />
                  Patient records
                </span>
              </div>

            </div>


            {/* WAITING PATIENTS */}

            <div className={HM.statCard}>
              <div className={HM.statTop}>
                <div className={`${HM.statIcon} ${HM.orangeIcon}`}>
                  <Users size={21} />
                </div>
                <button className={HM.statLink} title="View waiting patients" >  <ArrowUpRight size={17} />
                </button>

              </div>

              <div className={HM.statValue}>
          {dashboardStats.waiting_patients}
              </div>

              <div className={HM.statLabel}>
                Waiting Patients
              </div>

              <div className={HM.statFooter}>
                <span>
                  <CircleAlert size={13} />
                  Current status
                </span>
              </div>

            </div>


            {/* PATIENT ALERTS */}

            <div className={HM.statCard}>

              <div className={HM.statTop}>

                <div className={`${HM.statIcon} ${HM.purpleIcon}`}>
                  <Bell size={21} />
                </div>

              </div>

              <div className={HM.statValue}>
                {settings.patients_alerts ? "ON" : "OFF"}
              </div>

              <div className={HM.statLabel}>
                Patient Alerts
              </div>

              <div className={HM.statFooter}>
                <span>
                  <ShieldCheck size={13} />
                  Settings controlled
                </span>
              </div>

            </div>

          </section>


          {/* =========================
               MAIN DASHBOARD
           ========================= */}

          <section className={HM.mainGrid}>

            {/* =========================
                 RECENT PATIENTS
             ========================= */}

            <div className={HM.panel}>
              <div className={HM.panelHeader}>
                <div>
                  <div className={HM.panelTitleRow}>
                    <div className={HM.panelIcon}>
                      <Users size={17} />
                    </div>
                    <h2>
                      Recent Patients
                    </h2>
                  </div>
                  <p>
                    Recently registered patients
                  </p>
                </div>
                <button className={HM.viewButton} onClick={()=>navigate("/hospital/patients")} > View all<ArrowUpRight size={15} /></button>
              </div>
              <div className={HM.patientList}>



                {/*
                                   Take two patients at a time, compare their registration dates, 
                                   and arrange the patients so that the most recently registered patient comes first.
                                    */}

                {patients.length === 0 ?
                  (
                    <div className={HM.emptyState}>
                      <div className={HM.emptyIcon}>
                        <Users size={22} /> 
                      </div>
                      <h3>No patients yet</h3>
                      <p>
                        Registered patients will appear here once they are added.
                      </p>
                      <button className={HM.emptyButton} onClick={() => navigate("/hospital/patients")}> Add Patient<ArrowUpRight size={15} /></button>
                    </div>
                  ) :
                  (
                    patients
                      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 7)
                      .map((patient) => (
                        <div className={HM.patientRow} key={patient.id} >
                          <div className={HM.patientAvatar}>
                            {patient.first_name?.charAt(0)}{patient.last_name?.charAt(0)}
                          </div>
                          <div className={HM.patientInfo}>
                            <strong>
                              {patient.first_name} {patient.last_name}
                            </strong>
                            <span>
                              PAT-{patient.id} •
                              {new Date(patient?.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                            </span>
                          </div>
                          <div className={`${HM.patientStatus} ${patient.status === "Active" ? HM.activeStatus : patient.status === "Waiting" ? HM.waitingStatus : HM.otherStatus}`} >
                            <span></span>
                            {patient.status}
                          </div>
                        </div>

                      ))
                  )
                }
              </div>
            </div>
            {/* =========================
                 HOSPITAL PROFILE
             ========================= */}
            <div className={HM.panel}>
              <div className={HM.panelHeader}>
                <div>
                  <div className={HM.panelTitleRow}>
                    <div className={HM.panelIcon}>
                      <Building2 size={17} />
                    </div>

                    <h2>
                      Hospital Profile
                    </h2>

                  </div>

                  <p>
                    Current hospital information
                  </p>

                </div>
                <button className={HM.iconAction}   onClick={()=>navigate("/hospital/settings")}   title="Open settings"> <SettingsIcon size={17} /> </button>
              </div>


              <div className={HM.hospitalProfile}>

                <div className={HM.hospitalIdentity}>

                  <div className={HM.hospitalLogo}>
                    <Building2 size={23} />
                  </div>
                  <div>
                    <strong>
                      {settings.hospital_name}
                    </strong>
                    <span>
                      Hospital Administrator
                    </span>
                  </div>
                </div>
                <div className={HM.detailList}>
                  <div className={HM.detailItem}>
                    <Mail size={16} />
                    <div>
                      <span>
                        Email
                      </span>
                      <strong>
                        {settings.hospital_email}
                      </strong>
                    </div>
                  </div>
                  <div className={HM.detailItem}>
                    <Phone size={16} />
                    <div>
                      <span>
                        Phone
                      </span>
                      <strong>
                        {settings.hospital_phone}
                      </strong>

                    </div>

                  </div>


                  <div className={HM.detailItem}>

                    <MapPin size={16} />

                    <div>

                      <span>
                        Address
                      </span>

                      <strong>
                        {settings.hospital_address}
                      </strong>

                    </div>

                  </div>

                </div>


                <button className={HM.manageButton} onClick={() => navigate("/hospital/settings")}  >Manage hospital settings    <ArrowUpRight size={16} />   </button>

              </div>

            </div>

          </section>


          {/* =========================
               LOWER SECTION
           ========================= */}

          <section className={HM.lowerGrid}>
            {/* =========================
                 SYSTEM PREFERENCES
             ========================= */}
            <div className={HM.panel}>
              <div className={HM.panelHeader}>
                <div>
                  <div className={HM.panelTitleRow}>
                    <div className={HM.panelIcon}>
                      <Bell size={17} />
                    </div>
                    <h2>
                      System Preferences
                    </h2>
                  </div>
                  <p>
                    Notification preferences
                  </p>
                </div>

                <button className={HM.iconAction} title="Manage preferences"   >
                  <SettingsIcon size={17} />
                </button>
              </div>
              <div className={HM.preferenceList}>
                {/* EMAIL */}
                <div className={HM.preferenceItem}>
                  <div className={HM.preferenceIcon}>
                    <Mail size={17} />
                  </div>
                  <div className={HM.preferenceText}>

                    <strong>
                      Email Notifications
                    </strong>

                    <span>
                      System email notifications
                    </span>

                  </div>

                  <div className={HM.enabled}>
                    {settings.email_notification ? "Enabled" : "Disabled"}
                  </div>
                </div>
                {/* APPOINTMENTS */}
                <div className={HM.preferenceItem}>
                  <div className={HM.preferenceIcon}>
                    <CalendarClock size={17} />
                  </div>
                  <div className={HM.preferenceText}>
                    <strong>
                      Appointment Reminders
                    </strong>
                    <span>
                      Reminders for upcoming appointments
                    </span>
                  </div>
                  <div className={HM.enabled}>
                    {settings.appointment_reminders ? "Enabled" : "Disabled"}
                  </div>
                </div>
                {/* PATIENT ALERTS */}
                <div className={HM.preferenceItem}>
                  <div className={HM.preferenceIcon}>
                    <Bell size={17} />
                  </div>
                  <div className={HM.preferenceText}>
                    <strong>
                      Patient Alerts
                    </strong>
                    <span>
                      Important patient notifications
                    </span>
                  </div>
                  <div className={HM.enabled}>
                    {settings.patients_alerts ? "Enabled" : "Disabled"}
                  </div>

                </div>

              </div>

            </div>


            {/* =========================
                 QUICK ACTIONS
             ========================= */}
            <div className={HM.panel}>
              <div className={HM.panelHeader}>
                <div>
                  <div className={HM.panelTitleRow}>
                    <div className={HM.panelIcon}>
                      <Activity size={17} />
                    </div>
                    <h2>
                      Quick Actions
                    </h2>
                  </div>
                  <p>
                    Frequently used hospital tools
                  </p>
                </div>
              </div>
              <div className={HM.actionGrid}>
                {/* ADD PATIENT */}
                <button className={HM.actionCard} onClick={() => navigate("/hospital/patients")}   >
                  <div className={HM.actionIcon}>
                    <UserPlus size={19} />
                  </div>
                  <div>
                    <strong>  Add Patient
                    </strong>

                    <span>
                      Register a new patient
                    </span>

                  </div>

                  <ArrowUpRight size={16} />

                </button>


                {/* MEDICAL RECORD */}

                <button className={HM.actionCard} onClick={() => navigate("/hospital/medical-records")} >
                  <div className={HM.actionIcon}>
                    <ClipboardPlus size={19} />
                  </div>
                  <div>
                    <strong>
                      Medical Records
                    </strong>
                    <span>
                      Manage patient records
                    </span>
                  </div>
                  <ArrowUpRight size={16} />
                </button>
                {/* REPORTS */}
                <button className={HM.actionCard} onClick={() => navigate("/hospital/reports")}   >
                  <div className={HM.actionIcon}>
                    <FileBarChart size={19} />
                  </div>
                  <div>
                    <strong>
                      Reports
                    </strong>
                    <span>
                      View hospital reports
                    </span>
                  </div>
                  <ArrowUpRight size={16} />
                </button>
                {/* SETTINGS */}
                <button className={HM.actionCard} onClick={() => navigate("/hospital/settings")} >
                  <div className={HM.actionIcon}>
                    <SettingsIcon size={19} />
                  </div>
                  <div>
                    <strong>
                      Settings
                    </strong>
                    <span>
                      Manage hospital information
                    </span>
                  </div>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </section>
          {/* =========================
               ADMIN PROFILE
           ========================= */}
          <section className={HM.adminCard}>
            <div className={HM.adminLeft}>
              <div className={HM.adminAvatar}>
                MA
              </div>
              <div>
                <span className={HM.adminLabel}>
                  System Administrator
                </span>
                <h3>
                  {settings.admin_name}
                </h3>
                <p>
                  Hospital Administrator
                </p>
              </div>
            </div>
            <div className={HM.adminRight}>
              <div className={HM.adminContact}>
                <Mail size={15} />
                <span>
                  {settings.admin_email}
                </span>
              </div>
              <div className={HM.adminContact}>
                <Phone size={15} />
                <span>
                  {settings.admin_phone}
                </span>

              </div>


              <button className={HM.adminSettingsButton}  onClick={()=>navigate("/hospital/settings")}  > Edit profile<ArrowUpRight size={15} /></button>

            </div>

          </section>


          {/* =========================
               FOOTER STATUS
           ========================= */}

          <div className={HM.footerStatus}>

            <CheckCircle2 size={15} />

            <span>
              Dashboard connected to your hospital system
            </span>

          </div>

        </div>
      </div>




    </div>

  )
}

export default Dashboard;

