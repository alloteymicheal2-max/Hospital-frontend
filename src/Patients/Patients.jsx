import { Search, Users, UserPlus, SlidersHorizontal, MoreHorizontal, LoaderCircle, Phone, Mail, ChevronDown, ChevronLeft, ChevronRight, HeartPulse, CalendarDays, X, Eye, Pencil, Trash2 } from "lucide-react";

import HM from "./Patients.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios"
import { useNotification } from "../../NotificationContext";


const API = import.meta.env.VITE_HOSTING_API
function Patients() {

  const { addNotification } = useNotification()
  const [currentFilter, setCurrentFilter] = useState("All")
  const [showModal, setShowModal] = useState(false)
  const [showsucess, setShowSucess] = useState(false)
  const [successmessage, setSuccessmessage] = useState("")
  const [serverUnavailable, setServerUnavailable] = useState(false)
  const [checkingServer, setCheckingServer] = useState(false)
  const [sortType, setSortType] = useState("Newest")
  const [search, setSearch] = useState("")
  const [patients, setPatients] = useState([])
  const [openStatusId, setOpenStatusId] = useState(null)
  const [viewPatientModal, setViewPatientModal] = useState(null)
  const [deletePatientModal, setDeletePatientModal] = useState(null)
  const [editPatientModal, setEditPatientModal] = useState(null)

  const [isRegistering, setIsRegistering] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [patient, setPatient] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    email: "",
    residential_address: "",
    emergency_contact_name: "",
    emergency_relationship: "",
    emergency_contact_phone: "",
    blood_group: "",
    patient_type: "",
    medical_history: "",
    status: ""
  })
  const [dashboardStats, setDashboardStats] = useState({
    total_patients: 0,
    active_patients: 0,
    waiting_patients: 0,
    discharged_patients: 0,
    new_this_month: 0,
    todays_visits: 0
  });





  async function retryServer() {
    setCheckingServer(true)
    try {
      const token = localStorage.getItem("token");
      await axios.get(`${API}/patient`, { headers: { Authorization: `Bearer ${token}` } });
      setServerUnavailable(false);
    } catch (error) {
      setServerUnavailable(
        error.response ? false : true
      );
    } finally {
      setCheckingServer(false)
    }
  }

  async function fetchDashboardStats() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/dashboard`, { headers: { Authorization: `Bearer${token}` } });
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
  const formPatient = editPatientModal ? editPatientModal : patient

  function handleChange(e) {
    const { name, value } = e.target

    if (editPatientModal) {
      setEditPatientModal({ ...editPatientModal, [name]: value })
    }
    else {
      setPatient({ ...patient, [name]: value })
    }
  }


  async function handleSubmit(e) {
    e.preventDefault()
    setIsRegistering(true)
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API}/patient`, patient, { headers: { Authorization: `Bearer ${token}` } })
      const result = response.data
      if (result.success) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        setSuccessmessage(result.message)
        setShowSucess(true)

        setPatient({
          first_name: "",
          last_name: "",
          date_of_birth: "",
          gender: "",
          phone: "",
          email: "",
          residential_address: "",
          emergency_contact_name: "",
          emergency_relationship: "",
          emergency_contact_phone: "",
          blood_group: "",
          patient_type: "",
          medical_history: "",
          status: ""

        })

        await fetchPatient()

        {/*
        Who is logged in?
Get their user ID
Create notification for that user
Save notification in PostgreSQL
Later fetch notifications for that user
        */}
        const user = JSON.parse(localStorage.getItem("user"));
        const user_id = user.id;
        await axios.post(`${API}/notification`,
          { user_id: user_id, type: "patient", title: "New Patient", message: "A new patient has been added" }
        )
        addNotification(
          "patient", "New Patient", "A new Patient has been added "
        )

        setTimeout(() => {
          setShowSucess(false)
          setShowModal(false)
        }, 3000)
      } else {
        setSuccessmessage(result.message)
      }
    } catch (error) {
      console.log(error.message)
      setShowSucess(true)
      setSuccessmessage(error.response?.data?.message || "failed to to register patient")
      setTimeout(() => {
        setShowSucess(false)
      }, 1000);

      if (error.response?.status === 401) {
        window.location.href = "/login"
      }

    } finally {
      setIsRegistering(false)
    }
  }

  useEffect(() => {
    fetchPatient(),
      fetchDashboardStats()
  }, [])


  async function fetchPatient() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/patient`, { headers: { Authorization: `Bearer ${token}` } });
      const result = response.data;
      if (result.success === true) {
        setPatients(result.data);
        setServerUnavailable(false)
      } else {
        console.log("PATIENT API MESSAGE:", result.message);
      }

    } catch (error) {
      console.log("PATIENT ERROR STATUS:", error.response?.status);
      setServerUnavailable(error.response ? false : true)
    }
  }


  async function handleViewPatient(patient) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/patient/${patient.id}`, { headers: { Authorization: `Bearer ${token}` } });
      const result = response.data

      if (result.success) {
        setViewPatientModal(result.data)
      }

    } catch (error) {
      console.log("Failed to fetch patient:", error)
    }

  }

  function handleEditPatient(patient) {
    setEditPatientModal(patient)
    setShowModal(false)
  }

  async function handleUpadtePatient(e) {
    e.preventDefault()
    setIsUpdating(true)
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API}/patient/${editPatientModal.id}`, editPatientModal, { headers: { Authorization: `Bearer ${token}` } });
      const result = response.data
      if (result.success) {

        await new Promise(resolve => setTimeout(resolve, 2000))
        console.log(result.data)
        setSuccessmessage(result.message)
        setShowSucess(true)
        await fetchPatient()

        setTimeout(() => {
          setShowSucess(false)
          setEditPatientModal(null)
        }, 1500)
      }
    } catch (error) {
      console.log("Failed to fetch patient for editing:", error)
      setSuccessmessage(error.response?.data?.message || "Failed to update")
      setShowSucess(false)

      setTimeout(() => {
        setShowSucess(false)
      }, 1000)
    } finally {
      setIsUpdating(false)
    }
  }

  async function handleDeletePatient(id) {
    setIsDeleting(true)
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API}/patient/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      const result = response.data

      if (result.success) {
        await new Promise(resolve => setTimeout(resolve, 2000))   /*wait until 2 seconds beore processing */
        setDeletePatientModal(null)
        setSuccessmessage(result.message),
          setShowSucess(true)

        await fetchPatient()
        setTimeout(() => {
          setShowSucess(false)
        }, 1000)
      }
    } catch (error) {
      console.log("failed to delete patient:", error)
      setSuccessmessage(error.response?.data?.message || "Failed to delete patient")

      setTimeout(() => {
        setShowSucess(false)
      }, 1000);
    } finally {
      setIsDeleting(false)
    }
  }


  useEffect(() => {
    function handleClickOutside() {
      setOpenStatusId(null)
    }
    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])





  const filteredPatients = patients.filter((patient) => {

    const searchMatch =
      patient.first_name.toLowerCase().includes(search.toLowerCase()) ||
      patient.last_name.toLowerCase().includes(search.toLowerCase())
    if (!searchMatch) {
      return false
    }

    if (currentFilter === "All") {
      return true;
    }

    else if (currentFilter === "Active") {
      return patient.status === "Active"
    }

    else if (currentFilter === "Waiting") {
      return patient.status === "Waitng"
    }
    else {
      return true
    }
  })







  async function changeStatus(id, newstatus) {
    try {

      const selectedPatient = patients.find((patient) => patient.id === id);
      if (!selectedPatient) {
        return;
      }
      const updatedPatient = { ...selectedPatient, status: newstatus };
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API}/patient/${id}`, updatedPatient, { headers: { Authorization: `Bearer ${token}` } });
      const result = response.data;

      console.log("STATUS UPDATE RESPONSE:", result);
      console.log("NEW STATUS:", result.data?.status);

      if (result.success) {
        setPatients(patients.map((patient) => patient.id === id ? result.data : patient));
        setOpenStatusId(null);
      }
    } catch (error) {
      console.log(
        "Failed to update patient status:",
        error.response?.data || error.message
      );
    }
  }

  function filter() {
    if (currentFilter === "All") {
      setCurrentFilter("Active")
    }
    else if (currentFilter === "Active") {
      setCurrentFilter("Waiting")
    }
    else if (currentFilter === "Waiting") {
      setCurrentFilter("Discharged")
    }
    else {
      setCurrentFilter("All")
    }
  }

  function sortPatients() {
    if (sortType === "Newest") {
      setSortType("Oldest")
    }
    else {
      setSortType("Newest")
    }
  }

  let sortedPatients = [...filteredPatients]

  if (sortType === "Newest") {
    sortedPatients.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at)
    })
  }
  else {
    sortedPatients.sort((a, b) => {
      return new Date(a.created_at) - new Date(b.created_at)
    })
  }

  return (
    <div className={HM.page} >
      <div>
        <br className={HM.br1}></br>
        <br className={HM.br2}></br>
        <br className={HM.br3}></br>
        <br className={HM.br4}></br>
      </div>
      {/* =====================================
          PAGE HEADER
      ===================================== */}
      <section className={HM.pageHeader}>
        <div>
          <div className={HM.eyebrow}>
            <Users size={13} />
            us Patient management
          </div>
          <h1>
            Patients
          </h1>
          <p>
            Manage patient information, records and appointments.
          </p>
        </div>
        <button className={HM.primaryButton} onClick={() => { setEditPatientModal(null), setShowModal(true) }} disabled={serverUnavailable} title={serverUnavailable ? "Server unavailable. Patient registration is temporarily unavailable." : "Add a new Patient"}   ><UserPlus size={16} /> {serverUnavailable ? "Server  error " : "Add new patient"}</button>
      </section>
      {/* =====================================
          SUMMARY CARDS
      ===================================== */}
      <section className={HM.summaryGrid}>
        <div className={HM.summaryCard}>
          <div className={HM.summaryIcon}>
            <Users size={18} />
          </div>
          <div>
            <span>Total patients</span>
            <strong>{patients.length}</strong>
            <small>
              Registered patients
            </small>
          </div>
        </div>
        <div className={HM.summaryCard}>
          <div className={HM.summaryIcon}>
            <HeartPulse size={18} />
          </div>
          <div>
            <span>Active patients</span>

            <strong>{dashboardStats.active_patients}</strong>

            <small>
              Currently receiving care
            </small>
          </div>
        </div>
        <div className={HM.summaryCard}>
          <div className={HM.summaryIcon}>
            <CalendarDays size={18} />
          </div>
          <div>
            <span>Today's visits</span>
            <strong>{dashboardStats.todays_visits}</strong>
            <small>
              Scheduled appointments
            </small>
          </div>
        </div>
        <div className={HM.summaryCard}>
          <div className={HM.summaryIcon}>
            <UserPlus size={18} />
          </div>
          <div>
            <span>New this month</span>
            <strong>{dashboardStats.new_this_month}</strong>
            <small>Newly registered</small>
          </div>
        </div>
      </section>
      {/* =====================================
          PATIENT TABLE
      ===================================== */}
      <section className={HM.patientCard}>
        <div className={HM.toolbar}>
          <div>
            <h2>All patients</h2>
            <span>
              {dashboardStats.total_patients} patient records
            </span>
          </div>
          <div className={HM.toolbarActions}>
            <div className={HM.searchBox}>
              <Search size={15} />
              <input type="text" onChange={(e) => setSearch(e.target.value)} placeholder="Search patients..." />
            </div>
            <button onClick={filter} className={HM.filterButton}><SlidersHorizontal size={15} /> Filters</button>
            <button className={HM.sortButton} onClick={sortPatients}   >Newest<ChevronDown size={14} /></button>

          </div>

        </div>



        {/* =====================================
            PATIENT TABLE
        ===================================== */}
        <div className={HM.tableWrapper}>

          {serverUnavailable ? (
            <div className={HM.tableServerError}>
              <div className={HM.serverErrorCard}>
                <div className={HM.serverErrorIcon}>
                  <HeartPulse size={30} />
                </div>
                <span className={HM.serverErrorLabel}>
                  CONNECTION ERROR
                </span>
                <h2>
                  Server unavailable
                </h2>
                <p> We couldn't load the patient records.Please try again.</p>
                <button className={HM.retryServerButton} onClick={retryServer} disabled={checkingServer} >{checkingServer ? (<> <LoaderCircle size={16} className={HM.retrySpinner} /> Checking... </>) : ("Try again")} </button>
              </div>
            </div>
          ) :
            (<>
              <div className={HM.table}>
                <div className={HM.tableHeader}>
                  <span>Patient</span>
                  <span>Patient ID</span>
                  <span>Contact</span>
                  <span>Gender</span>
                  <span>D.O.B</span>
                  <span>Status</span>
                  <span>Actions</span>
                  <span></span>
                </div>
                {sortedPatients.length > 0 ? (
                  sortedPatients.map((patient) => (
                    <div className={HM.patientRow} key={patient.id}>
                      <div className={HM.patientInfo}>
                        <div className={HM.avatar}>
                          {patient.first_name[0].toUpperCase()}
                          {patient.last_name[0].toUpperCase()}
                        </div>
                        <div>
                          <strong>
                            {patient.first_name} {patient.last_name}
                          </strong>
                          <span>
                            {patient.date_of_birth}
                          </span>
                        </div>
                      </div>
                      <span className={HM.patientId}>
                        #PT-{patient.id}
                      </span>
                      <div className={HM.contact}>
                        <span>
                          <Phone size={11} />
                          {patient.phone}
                        </span>
                        <span>
                          <Mail size={11} />
                          {patient.email || "no email"}
                        </span>
                      </div>
                      <span>
                        {patient.gender}
                      </span>
                      <span>
                        {patient.date_of_birth.split("T")[0]}
                      </span>
                      <span className={`${HM.status} ${patient.status === "Waiting"
                        ? HM.waiting
                        : patient.status === "Discharged"
                          ? HM.discharged
                          : HM.active
                        }`}
                      >
                        {patient.status || "Active"}
                      </span>
                      <span className={HM.newicons}>
                        <Pencil size={17} onClick={() => handleEditPatient(patient)} />
                        <Eye size={17} onClick={() => handleViewPatient(patient)} />
                        <Trash2 size={17} onClick={() => setDeletePatientModal(patient)} />
                      </span>
                      <button className={HM.moreButton} onClick={(e) => {
                        e.stopPropagation()
                        setOpenStatusId(
                          openStatusId === patient.id
                            ? null
                            : patient.id
                        )
                      }}
                      >
                        <MoreHorizontal size={17} />
                      </button>
                      {openStatusId === patient.id && (
                        <div className={HM.statusMenu} onClick={(e) => e.stopPropagation()} >
                          <button onClick={() => changeStatus(patient.id, "Active")} >Active </button>
                          <button onClick={() => changeStatus(patient.id, "Waiting")} >     Waiting     </button>
                          <button onClick={() => changeStatus(patient.id, "Discharged")} >       Discharged
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className={HM.noPatients}>
                    <div className={HM.noPatientsIcon}>
                      <Search size={28} />
                    </div>
                    <h3>No Patient Found</h3>
                    <p>
                      We couldn't find any patient matching "{search}".
                    </p>
                    <button type="button" onClick={() => { setSearch(""), setCurrentPage(1) }} >   Clear Search</button>
                  </div>
                )}

              </div>

            </>)}
        </div>
      </section>
      {deletePatientModal && (
        <div className={HM.deleteOverlay}>
          <div className={HM.deleteModal}>
            <div className={HM.deleteIcon}>
              <Trash2 size={26} />
            </div>
            <h2>Delete Patient?</h2>
            <p>Are you sure you want to delete{" "}
              <strong>{deletePatientModal.first_name} {deletePatientModal.last_name}</strong>?
            </p>
            <span className={HM.deleteWarning}>This action cannot be undone.   </span>
            <div className={HM.deleteActions}>
              <button type="button" className={HM.cancelDelete} onClick={() => setDeletePatientModal(null)} >Cancel</button>
              <button type="button" disabled={isDeleting} className={HM.confirmDelete} onClick={() => handleDeletePatient(deletePatientModal.id)}> <Trash2 size={16} />{isDeleting ? (<><LoaderCircle size={17} className={HM.spinner} />Deleting...</>) : (<>Delete Patient</>)}  </button>
            </div>
          </div>
        </div>
      )}
      {/* =====================================
          ADD PATIENT MODAL
          DESIGN ONLY
          NO LOGIC
      ===================================== */}
      {(showModal || editPatientModal) && (
        <div className={HM.modalOverlay}>
          <div className={HM.modal}>
            {/* Modal Header */}
            <div className={HM.modalHeader}>
              <div>
                <span className={HM.modalLabel}>
                  {editPatientModal ? "EDIT PATIENT" : "NEW PATIENT"}
                </span>
                <h2>
                  {editPatientModal ? "Edit patient information" : "Register a new patient"}
                </h2>
                <p>
                  {editPatientModal ? "Update the patient's personal and medical information below." : "Enter the patient's personal and contact information below."}
                </p>
              </div>
              <button className={HM.closeButton} onClick={() => { setShowModal(false), setEditPatientModal(null) }} > <X size={18} />     </button>
            </div>
            {/* =====================================
              FORM
          ===================================== */}

            <form onSubmit={editPatientModal ? handleUpadtePatient : handleSubmit} className={HM.patientForm}  >
              {showsucess && (
                <div className={HM.successToast}>
                  <div className={HM.successIcon}>
                    ✓
                  </div>
                  <div className={HM.successContent}>
                    <strong>{successmessage}</strong>
                    <span> The operation was completed successfully.</span>
                  </div>
                  <button type="button" onClick={() => setShowSucess(false)} className={HM.toastClose} ><X size={18} /></button>
                </div>
              )}
              <div className={HM.formSection}>
                <div className={HM.sectionTitle}>
                  <span className={HM.sectionNumber}>
                    01
                  </span>
                  <div>
                    <h3>Personal information </h3>
                    <p> Basic information about the patient.   </p>
                  </div>
                </div>
                <div className={HM.formGrid}>
                  <div className={HM.inputGroup}>
                    <label> First name  </label>
                    <input name="first_name" type="text" placeholder="Enter first name" value={formPatient.first_name} onChange={handleChange} />
                  </div>
                  <div className={HM.inputGroup}>
                    <label> Last name  </label>
                    <input required name="last_name" type="text" placeholder="Enter last name" value={formPatient.last_name} onChange={handleChange} />
                  </div>
                  <div className={HM.inputGroup}>
                    <label>Date of birth</label>
                    <input required name="date_of_birth" type="date" value={formPatient.date_of_birth} onChange={handleChange} />
                  </div>
                  <div className={HM.inputGroup}>
                    <label>Gender</label>
                    <select name="gender" required value={formPatient.gender} onChange={handleChange} >
                      <option value="" > Select gender     </option>
                      <option>Male</option>
                      <option> Female</option>
                      <option> Other</option>
                    </select>
                  </div>
                </div>
              </div>
              {/* Contact Information */}
              <div className={HM.formSection}>
                <div className={HM.sectionTitle}>
                  <span className={HM.sectionNumber}> 02 </span>
                  <div>
                    <h3> Contact information</h3>
                    <p> How the hospital can reach the patient. </p>
                  </div>
                </div>
                <div className={HM.formGrid}>
                  <div className={HM.inputGroup}>
                    <label>Phone number</label>
                    <input name="phone" onChange={handleChange} value={formPatient.phone} type="tel" placeholder="+233 XX XXX XXXX" />
                  </div>
                  <div className={HM.inputGroup}>
                    <label>  Email address </label>
                    <input name="email" required type="email" placeholder="patient@email.com" onChange={handleChange} value={formPatient.email} />
                  </div>
                  <div className={`${HM.inputGroup} ${HM.fullWidth}`}>
                    <label>Residential address</label>
                    <input name="residential_address" onChange={handleChange} value={formPatient.residential_address} type="text" placeholder="Enter residential address" />
                  </div>
                </div>
              </div>
              {/* Emergency Contact */}
              <div className={HM.formSection}>
                <div className={HM.sectionTitle}>
                  <span className={HM.sectionNumber}>  03</span>
                  <div>
                    <h3>Emergency contact </h3>
                    <p>Person to contact in case of an emergency.</p>
                  </div>
                </div>
                <div className={HM.formGrid}>
                  <div className={HM.inputGroup}>
                    <label> Contact name </label>
                    <input required type="text" name="emergency_contact_name" placeholder="Full name" onChange={handleChange} value={formPatient.emergency_contact_name} />
                  </div>
                  <div className={HM.inputGroup}>
                    <label>   Relationship </label>
                    <select required name="emergency_relationship" onChange={handleChange} value={formPatient.emergency_relationship} >
                      <option value="" >    Select relationship</option>
                      <option>Parent</option>
                      <option>Spouse </option>
                      <option>Sibling</option>
                      <option> Friend</option>
                      <option> Other</option>
                    </select>
                  </div>
                  <div className={HM.inputGroup}>
                    <label>Contact phone </label>
                    <input name="emergency_contact_phone" onChange={handleChange} value={formPatient.emergency_contact_phone} type="tel" placeholder="+233 XX XXX XXXX" />
                  </div>
                </div>
              </div>
              {/* Medical Information */}
              <div className={HM.formSection}>
                <div className={HM.sectionTitle}>
                  <span className={HM.sectionNumber}>04</span>
                  <div>
                    <h3>  Medical information</h3>
                    <p>Initial health information for the patient. </p>
                  </div>
                </div>
                <div className={HM.formGrid}>
                  <div className={HM.inputGroup}>
                    <label>Blood group</label>
                    <select name="blood_group" onChange={handleChange} value={formPatient.blood_group} >
                      <option value="" >Select blood group</option>
                      <option>A+</option>
                      <option>A-</option>
                      <option>B+</option>
                      <option>B-</option>
                      <option>AB+</option>
                      <option>AB-</option>
                      <option>O+</option>
                      <option>O-</option>
                    </select>
                  </div>
                  <div className={HM.inputGroup}>
                    <label>  Patient type</label>
                    <select name="patient_type" onChange={handleChange} value={formPatient.patient_type} >
                      <option value="" >Select patient type</option>
                      <option> Outpatient</option>
                      <option> Inpatient</option>
                      <option> Emergency</option>
                    </select>
                  </div>
                  <div className={`${HM.inputGroup} ${HM.fullWidth}`}>
                    <label>Medical history</label>
                    <textarea rows="4" name="medical_history" onChange={handleChange} value={formPatient.medical_history} placeholder="Enter relevant medical history, allergies or existing conditions..." />
                  </div>
                </div>
              </div>
              {/* Form Footer */}
              <div className={HM.formFooter}>
                <p>  Patient information should be kept confidential.</p>
                <div className={HM.frmButtons}>
                  <button type="button" onClick={() => { setShowModal(false), setEditPatientModal(false) }} className={HM.cancelButton}>Cancel</button>
                  <button type="submit" className={HM.registerButton} disabled={isRegistering || isUpdating} >{isRegistering || isUpdating ? (<><LoaderCircle size={17} className={HM.spinner} />{editPatientModal ? "Saving changes..." : "Registering..."}</>) : (<><UserPlus size={15} />{editPatientModal ? "Save Chnages" : "Register Patient"}</>)}</button>
                </div>
              </div>
            </form>

          </div>
        </div>
      )}
      {viewPatientModal && (
        <div className={HM.modalOverlay}>
          <div className={HM.viewPatientModal}>
            {/* =========================
          MODAL HEADER
      ========================= */}
            <div className={HM.viewModalHeader}>
              <div>
                <span className={HM.viewModalLabel}> PATIENT PROFILE</span>
                <h2> Patient Details</h2>
                <p> View complete information about this patient </p>
              </div>
              <button type="button" className={HM.viewCloseButton} onClick={() => { setViewPatientModal(null) }}>  <X size={20} /></button>
            </div>
            {/* =========================
          PATIENT IDENTITY
      ========================= */}
            <div className={HM.patientProfileHeader}>
              <div className={HM.patientAvatar}>
                {viewPatientModal.first_name?.charAt(0)}
                {viewPatientModal.last_name?.charAt(0)}
              </div>
              <div className={HM.patientIdentity}>
                <h3>
                  {viewPatientModal.first_name}{" "}
                  {viewPatientModal.last_name}
                </h3>
                <p> Patient ID:{" "} <strong> #PT-{String(viewPatientModal.id).padStart(4, "0")}</strong></p>
              </div>
              <div className={HM.patientStatus}>
                <span className={HM.statusDot}></span>Active
              </div>
            </div>
            {/* =========================
          QUICK INFORMATION
      ========================= */}
            <div className={HM.patientQuickInfo}>
              <div className={HM.quickInfoItem}>
                <span>Gender</span>
                <strong>
                  {viewPatientModal.gender || "Not provided"}
                </strong>
              </div>
              <div className={HM.quickInfoItem}>
                <span>Blood Group</span>
                <strong>
                  {viewPatientModal.blood_group || "Not provided"}
                </strong>
              </div>
              <div className={HM.quickInfoItem}>
                <span>Patient Type</span>
                <strong>
                  {viewPatientModal.patient_type || "Not provided"}
                </strong>
              </div>
              <div className={HM.quickInfoItem}>
                <span>Phone</span>
                <strong>
                  {viewPatientModal.phone || "Not provided"}
                </strong>
              </div>
            </div>
            {/* =========================
    PERSONAL INFORMATION
========================= */}

            <div className={HM.viewSection}>

              <div className={HM.viewSectionHeader}>
                <div>
                  <h3>Personal Information</h3>
                  <p>Basic information about the patient</p>
                </div>
              </div>

              <div className={HM.detailsGrid}>

                <div className={HM.detailItem}>
                  <span>Full Name</span>
                  <strong>
                    {viewPatientModal.first_name}{" "}
                    {viewPatientModal.last_name}
                  </strong>
                </div>

                <div className={HM.detailItem}>
                  <span>Date of Birth</span>
                  <strong>
                    {viewPatientModal.date_of_birth ? new Date(viewPatientModal.date_of_birth).toLocaleDateString() : "Not provided"}
                  </strong>
                </div>
                <div className={HM.detailItem}>
                  <span>Gender</span>
                  <strong>
                    {viewPatientModal.gender || "Not provided"}
                  </strong>
                </div>
                <div className={HM.detailItem}>
                  <span>Phone Number</span>
                  <strong>
                    {viewPatientModal.phone || "Not provided"}
                  </strong>
                </div>
                <div className={HM.detailItem}>
                  <span>Email Address</span>
                  <strong>
                    {viewPatientModal.email || "Not provided"}
                  </strong>
                </div>
                <div className={HM.detailItem}>
                  <span>Residential Address</span>
                  <strong>
                    {viewPatientModal.residential_address || "Not provided"}
                  </strong>
                </div>
              </div>
            </div>
            {/* =========================
          CLOSE BUTTON
      ========================= */}
            <div className={HM.viewModalFooter}>
              <button type="button" className={HM.viewModalClose} onClick={() => setViewPatientModal(null)} >Close</button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}


export default Patients;
