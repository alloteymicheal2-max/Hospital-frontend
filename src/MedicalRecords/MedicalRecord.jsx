import React, { useEffect, useState } from "react";
import { FileText, Search, SlidersHorizontal,ChevronDown, Eye, LoaderCircle, CalendarDays, UserRound, Stethoscope, Clock3, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, Plus, X, UserPlus, ClipboardPlus, } from "lucide-react";
import HM from "./MedicalRecords.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../NotificationContext";



function MedicalRecords() {
  const { addNotification } = useNotification()
  const [showModal, setShowModal] = useState(false)
  const [serverUnavailable, setServerUnavailable] = useState(false)
  const [checkingServer, setCheckingServer] = useState(false)

  const [patients, setPatients] = useState([])
  const [showsucess, setShowSucess] = useState(false)
  const [medicalRecords, setMedicalRecords] = useState([])
  const [successmessage, setSuccessMessage] = useState("")
  const [selectedPatient, setSelectedPatient] = useState("");
  const [search, setSearch] = useState("")

  const[isRecording,setIsRecording]=useState(false)

  const [medicalStats, setMedicalStats] = useState({
    total_medical_records: 0,
    todays_records: 0,
    recent_records: 0,
    patients_with_records: 0
  })

  const API = import.meta.env.VITE_HOSTING_API
  async function fetchMedicalStats() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/dashboard/medical`, { headers: { Authorization: `Bearer ${token}` } })
      console.log("MEDICAL STATS RESPONSE :", response.data)
      const result = response.data

      if (result.success === true) {
        setMedicalStats(result.data)
      }
    } catch (error) {
      console.log("Unable to fetch Medical records stats", error)
    }
  }





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







  const navigate = useNavigate()

  async function fetchPatients() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/patient`, { headers: { Authorization: `Bearer ${token}` } })
      console.log("FULL RESPONSE:", response);
      console.log("RESPONSE DATA:", response.data);
      const result = response.data

      if (result.success === true) {
        setPatients(result.data)
        setServerUnavailable(false)

      }
    } catch (error) {
      console.log("Unable to fetch patients", error);
      if (!error.response) {
        setServerUnavailable(true);
      }
    }
  }





  async function handleSubmit(e) {
    e.preventDefault();
    setIsRecording(true)
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API}/medical`, { patients_id: selectedPatient }, { headers: { Authorization: `Bearer ${token}` } })
      console.log("BACKEND RESPONSE:", response.data)
      const result = response.data
      if (result.success === true) {
        await new Promise(resolve=>setTimeout(resolve,2000))
        setShowSucess(true)
        setSuccessMessage(result.message)
        setSelectedPatient("");
        setShowModal(false)
        fetchMedicalRecords()

        const user = JSON.parse(localStorage.getItem("user"));
        const user_id = user.id;
        await axios.post(`${API}/notification`,
          { user_id: user_id, type: " Medical record", title: "New Record", message: "New Medical Record created" }
        )

        addNotification(
          "Medical record",
          "New Record",
          "New Medical Record created"
        );
        setTimeout(() => {
          setShowSucess(false)
        }, 3000)
      }

    } catch (error) {
      console.log("Failed to create medical record:", error);
    }
    finally{
      setIsRecording(false)
    }
  }




  async function fetchMedicalRecords() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/medical`, { headers: { Authorization: `Bearer ${token}` } });
      console.log("MEDICAL RESPONSE:", response.data);
      const result = response.data
      if (result.success) {
        setMedicalRecords(result.data)
        setServerUnavailable(false)
      }
      fetchPatients()
    } catch (error) {
      console.log("Unable to fetch medical records:", error)
      if (!error.response) {
        setServerUnavailable(true);
      }
    }
  }


  useEffect(() => {
    fetchPatients(),
      fetchMedicalRecords(),
      fetchMedicalStats()
  }, [])





  const filteredMedicalRecord = medicalRecords.filter((record) => {

    return (
      record.first_name.toLowerCase().includes(search.toLowerCase()) ||
      record.last_name.toLowerCase().includes(search.toLowerCase())
    )
  })




  return (
    <div className={HM.medicalRecordsPage}>
      <div>
        <br className={HM.br1}></br>
        <br className={HM.br2}></br>
        <br className={HM.br3}></br>
        <br className={HM.br4}></br>
      </div>

      {/* ================= HEADER ================= */}
      <header className={HM.header}>
        <div className={HM.headerText}>
          <div className={HM.headerEyebrow}>
            <FileText size={16} />
            Patient Care
          </div>

          <h1>Medical Records</h1>

          <p>
            Manage and review patient medical records, diagnoses,
            treatments and clinical information.
          </p>
        </div>

        <div className={HM.headerActions}>
          <button onClick={() => setShowModal(true)} className={HM.newRecordButton} disabled={serverUnavailable} title={serverUnavailable ? "Server unavailable. Patient registration is temporarily unavailable." : "Add a new Patient"} type="button"> <Plus size={18} />{serverUnavailable ? "Server error" : "New Record"} </button>

        </div>
      </header>


      {/* ================= SUMMARY CARDS ================= */}
      <section className={HM.recordStats}>

        <div className={HM.statCard}>
          <div className={HM.statIcon}>
            <FileText size={21} />
          </div>

          <div className={HM.statContent}>
            <span>Total Records</span>
            <strong>{medicalStats.total_medical_records}</strong>
            <small>All medical records</small>
          </div>
        </div>


        <div className={HM.statCard}>
          <div className={HM.statIcon}>
            <CalendarDays size={21} />
          </div>

          <div className={HM.statContent}>
            <span>Today's Records</span>
            <strong>{medicalStats.todays_records}</strong>
            <small>Created today</small>
          </div>
        </div>


        <div className={HM.statCard}>
          <div className={HM.statIcon}>
            <Clock3 size={21} />
          </div>

          <div className={HM.statContent}>
            <span>Recent Records</span>
            <strong>{medicalStats.recent_records}</strong>
            <small>Last 7 days</small>
          </div>
        </div>


        <div className={HM.statCard}>
          <div className={HM.statIcon}>
            <UserRound size={21} />
          </div>

          <div className={HM.statContent}>
            <span>Patients With Records</span>
            <strong>{medicalStats.patients_with_records}</strong>
            <small>Active patients</small>
          </div>
        </div>

      </section>


      {/* ================= SEARCH / FILTER ================= */}
      <section className={HM.filterPanel}>

        <div className={HM.searchBox}>
          <Search size={19} />

          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patient, record ID or diagnosis..." />
        </div>

{/* 
        <div className={HM.filterActions}>

          <button className={HM.filterButton} type="button">
            <SlidersHorizontal size={17} />
            Filters
          </button>

          <button className={HM.selectButton} type="button">
            All Records
            <ChevronDown size={17} />
          </button>

          <button className={HM.selectButton} type="button">
            All Status
            <ChevronDown size={17} />
          </button>

        </div> */}

      </section>


      {/* ================= RECORDS HEADER ================= */}
      <section className={HM.recordsHeader}>

        <div>
          <h2>Medical Records</h2>
          <p>Recent patient clinical records</p>
        </div>

        <span className={HM.recordsCount}>
          {filteredMedicalRecord.length} records
        </span>

      </section>


      {serverUnavailable ? (
        <div className={HM.recordsServerError}>
          <div className={HM.serverErrorCard}>
            <div className={HM.serverErrorIcon}>
              <AlertCircle size={30} />
            </div>
            <span className={HM.serverErrorLabel}>
              CONNECTION ERROR
            </span>
            <h2>Server unavailable</h2>
            <p>
              We couldn't load the medical records.
              Please try again.
            </p>
            <button type="button" className={HM.retryServerButton} onClick={retryServer} disabled={checkingServer}>{checkingServer ? (<> <LoaderCircle size={16} className={HM.retrySpinner} />Checking... </>) : ("Try again")} </button>
          </div>

        </div>
      ) : (
        filteredMedicalRecord.length > 0 ? (
          <>
            {filteredMedicalRecord.map((record) => (
              <section className={HM.recordsContainer} key={record.id} >

                <article className={HM.recordCard}>

                  <div className={HM.recordDate}>
                    <span>{new Date(record.created_at || record.record_date).toLocaleDateString("en-US", { month: "short" })}</span>
                    <strong>{new Date(record.created_at || record.record_date).getDate()} </strong>
                    <small>{new Date(record.created_at || record.record_date).getFullYear()}</small>
                  </div>


                  <div className={HM.patientInfo}>

                    <div className={HM.patientAvatar}>
                      {record.first_name?.charAt(0)}
                      {record.last_name?.charAt(0)}
                    </div>

                    <div>
                      <h3>{record.first_name}{record.last_name}</h3>

                      <p>
                        <UserRound size={14} />
                        Patient ID: {record.patients_id}
                      </p>
                    </div>

                  </div>


                  <div className={HM.recordInfo}>

                    <div className={HM.infoItem}>
                      {/* <span>Diagnosis</span> */}
                      {/* <strong>{record.primary_diagnosis || "Not Provided"}</strong> */}
                    </div>

                    <div className={HM.infoItem}>
                      {/* <span>Doctor</span>
                      <strong>{record.attending_doctor || "Not provided"}</strong> */}
                    </div>
                    {/* <div className={HM.infoItem}><span>Visit Type</span><strong>{record.visit_type || "Not assigned"}</strong> </div> */}
                  </div>
                  {/* <div className={HM.status}><CheckCircle2 size={15} />  {record.status || "Pending"}</div> */}


                  <button className={HM.viewButton} onClick={(e) => navigate(`/record-details/${record.patients_id}`)} type="button">
                    <Eye size={17} />
                    View Details
                  </button>

                </article>


              </section>
            ))}
          </>
        ) : (

          <div className={HM.noRecords}>
            <div className={HM.noRecordsIcon}>
              <Search size={28} />
            </div>

            <h3>No Patient Found</h3>

            <p>
              We couldn't find any medical record matching "{search}".
            </p>
            <button type="button" onClick={() => { setSearch(""); setCurrentPage(1); }}> Clear Search</button>
          </div>
        )

      )}

      {showsucess && (
        <div className={HM.successMessage}>

          <div className={HM.successIcon}>
            <CheckCircle2 size={22} />
          </div>

          <div className={HM.successContent}>
            <strong>Medical Record Created</strong>

            <span>
              {successmessage}
            </span>
          </div>

          <button type="button" className={HM.successClose} onClick={() => setShowSucess(false)}
          >
            <X size={18} />
          </button>

        </div>
      )}
      {showModal && (
        <div className={HM.modalOverlay}>
          <div className={HM.modal}>
            <div className={HM.modalHeader}>
              <div className={HM.modalTitle}>
                <div className={HM.modalIcon}>
                  <ClipboardPlus size={21} />
                </div>
                <div>
                  <h2>Create Medical Record</h2>
                  <p>Select the patient for this medical record.</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowModal(false)} className={HM.closeModal} >  <X size={20} /></button>
            </div>
            <form className={HM.patientForm} onSubmit={handleSubmit} >

              <div className={HM.formSection}>

                <div className={HM.sectionTitle}>

                  <div className={HM.sectionNumber}>
                    01
                  </div>
                  <div>
                    <h3>Select Patient</h3>
                    <p>
                      Choose the patient whose medical record
                      you want to create.
                    </p>
                  </div>
                </div>
                <div className={HM.patientSelection}>

                  <label htmlFor="patient">
                    Patient
                    <span>*</span>
                  </label>

                  <div className={HM.selectWrapper}>

                    <UserPlus size={18} />
                    <select id="patient" name="patients_id" required value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} >
                      <option value="">Select patient</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.first_name} {patient.last_name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={17} />

                  </div>

                  <small>
                    Select an existing patient to continue.
                  </small>

                </div>

              </div>


              {/* MODAL FOOTER */}
              <div className={HM.formFooter}>
                <button type="button" onClick={() => setShowModal(false)} className={HM.cancelButton}>  Cancel   </button>
                <button type="submit" className={HM.continueButton}   disabled={isRecording}  >  {isRecording?(<><LoaderCircle size={17}  className={HM.spinner}/></>):("Continue")}  <ChevronRight size={18} />      </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default MedicalRecords;