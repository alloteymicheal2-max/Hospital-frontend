
import React, { useState ,useEffect} from "react";
import { FileText, Search, SlidersHorizontal, ChevronDown, MoreHorizontal, Eye, Pencil, Download, CalendarDays, UserRound, Stethoscope, Activity, Clock3, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, Plus, X, ClipboardPlus, } from "lucide-react";
import HM from "./MedicalRecords.module.css";
import axios from "axios";


function MedicalRecords() {
  const [showModal, setShowModal] = useState()
  const [records,setRecords]=useState([])
  const [patients,setPatients]=useState([])

  const [formData, setFormData] = useState({
    patients_id: "",
    record_date: "",
    attending_doctor: "",
    visit_type: "",
    reason_for_visit: "",
    symptoms: "",
    primary_diagnosis: "",
    diagnosis_category: "",
    treatment_plan: "",
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    investigation: "",
    investigation_result: "",
    clinical_notes: "",
    status: "",
    follow_up_date: ""
  })
  function handleChange(e) {
    setFormData({
      ...formData, [e.target.name]: e.target.value

    })
  }

  const API = import.meta.env.VITE_HOSTING_API
  const [showsucess, setShowSucess] = useState(false)
  const [successmessage, setSuccessMessage] = useState("")


  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const response = await axios.post(`${API}/medical`, formData)
      const result = response.data

      if (result.success === true) {
        setShowSucess(true)
        setSuccessMessage(result.message)

          fetchRecords()
         fetchPatients()

        setTimeout(() => {
          setShowSucess(false)
        }, 3000);
      }

    } catch (error) {
      console.log("failed to record patient", error)
      setShowSucess(true)
      setSuccessMessage(error.message)
      setTimeout(() => {
        setShowSucess(false)
      }, 2000)
    }
  }

  async function fetchRecords() {
try {
      const response=await axios.get(`${API}/medical`)
    const result=response.data
    if(result.success === true){
      setRecords(result.data)
    }
} catch (error) {
  console.log(error.message)
     setShowSucess(true)
      setSuccessMessage(error.message)
        
        setTimeout(()=>{
          setShowSucess(false)
        },3000)
  
}
  }

async function fetchPatients() {
  try {
    const response=await axios.get(`${API}/patient`)
     console.log("Patients response:", response.data);
    const result=response.data

    if(result.success ===true){
      setPatients(result.data)
    }
  } catch (error) {
    console.log("Failed to load to patients:",error)
  }
  
}

useEffect(()=>{
  fetchRecords()
  fetchPatients()
},[])
    


  return (
    <div className={HM.page}>
         <div>
              <br className={HM.br1}></br>
              <br className={HM.br2}></br>
              <br className={HM.br3}></br>
              <br className={HM.br4}></br>
            </div>
    
      {/* =========================================
          PAGE HEADER
      ========================================= */}
      <section className={HM.pageHeader}>
        <div>
          <div className={HM.eyebrow}>
            <FileText size={13} />
            Medical documentation
          </div>
          <h1>
            Medical Records
          </h1>
          <p>
            Manage patient diagnoses, treatments, prescriptions,
            consultations and medical history.
          </p>
        </div>
        <div className={HM.headerActions}>
          <button className={HM.exportButton}>
            <Download size={15} />
            Export records
          </button>
          <button className={HM.primaryButton} onClick={() => setShowModal(true)} ><Plus size={15} />  Add medical record </button>
        </div>

      </section>



      {/* =========================================
          SUMMARY CARDS
      ========================================= */}

      <section className={HM.summaryGrid}>

        <div className={HM.summaryCard}>

          <div className={HM.summaryIcon}>
            <FileText size={18} />
          </div>

          <div>

            <span>
              Total records
            </span>

            <strong>
              4,821
            </strong>

            <small>
              All medical records
            </small>
          </div>
        </div>
        <div className={HM.summaryCard}>

          <div className={HM.summaryIcon}>
            <Activity size={18} />
          </div>

          <div>

            <span>
              Active cases
            </span>

            <strong>
              326
            </strong>

            <small>
              Currently under care
            </small>
          </div>
        </div>
        <div className={HM.summaryCard}>
          <div className={HM.summaryIcon}>
            <Clock3 size={18} />
          </div>
          <div>
            <span>Pending review </span>
            <strong>18</strong>
            <small>Records awaiting review</small>
          </div>
        </div>
        <div className={HM.summaryCard}>
          <div className={HM.summaryIcon}>
            <CheckCircle2 size={18} />
          </div>
          <div>
            <span> Completed</span>
            <strong>4,477</strong>
            <small>Completed records</small>
          </div>
        </div>
      </section>
      {/* =========================================
          RECORDS TABLE
      ========================================= */}
      <section className={HM.recordsCard}>
        <div className={HM.toolbar}>
          <div>
            <h2> Medical record</h2>
            <span>Patient diagnosis and treatment history  </span>
          </div>
          <div className={HM.toolbarActions}> <div className={HM.searchBox}> <Search size={15} /> <input  type="text"  placeholder="Search records..." /></div>
            <button className={HM.filterButton}><SlidersHorizontal size={15} />Filters</button>
            <button className={HM.sortButton}> Latest <ChevronDown size={14} />   </button>
          </div>
        </div>



        {/* =========================================
            TABLE
        ========================================= */}

        <div className={HM.tableWrapper}>
          <div className={HM.table}>
            <div className={HM.tableHeader}>
              <span>  Patient  </span>
              <span>Record ID   </span>
              <span>   Diagnosis </span>
              <span>   Doctor </span>
              <span>  Date</span>
              <span>Status </span>
              <span>   Actions   </span>
            </div>
            {/* RECORD 1 */}

          {records.map((record)=>(
              <div className={HM.recordRow} key={record.id} >
              <div className={HM.patientInfo}>
                <div className={HM.avatar}>
                     {record.first_name?.charAt(0)}
                {record.last_name?.charAt(0)}
                </div>
                <div>
                  <strong>
                 {record.first_name} {record.last_name}
                  </strong>
                  <span>
                 Patient #{record.patients_id}
                  </span>
                </div>
              </div>
              <span className={HM.recordId}> #MR-{record.id} </span>
              <div className={HM.diagnosis}>  <Stethoscope size={13} /><div>
                  <strong>{record.primary_diagnosis || "No diagnosis"}</strong>
                  <span> {record.diagnosis_category || "General"}   </span>
                </div>
              </div>
              <div className={HM.doctor}><UserRound size={13} />{record.attending_doctor || "Not assigned"}
              </div>
              <div className={HM.date}>  <CalendarDays size={12} />{record.record_date.split("T")[0]}
              </div>
              <span className={`${HM.status} ${HM.completed}`}>
                 {record.status || "Unknown"}
              </span>
              <div className={HM.rowActions}>
                <button   className={HM.viewButton} title="View record"><Eye size={14} />  </button>
                <button className={HM.editButton}  title="Edit record" >   <Pencil size={14} />   </button>
                <button className={HM.moreButton} title="More options" >     <MoreHorizontal size={16} />    </button>
              </div>
            </div>
          ))}
          </div>
        </div>



        {/* =========================================
            PAGINATION
        ========================================= */}

        <div className={HM.pagination}>
          <span>
            Showing 1–6 of 4,821 records
          </span>
          <div className={HM.paginationButtons}>

            <button>
              <ChevronLeft size={14} />
            </button>

            <button className={HM.currentPage}>
              1
            </button>
            <button>
              2
            </button>

            <button>
              3
            </button>

            <span>
              ...
            </span>

            <button>
              804
            </button>

            <button>
              <ChevronRight size={14} />
            </button>

          </div>

        </div>

      </section>



      {/* =========================================
          QUICK INFORMATION
      ========================================= */}

      <section className={HM.infoGrid}>

        <div className={HM.infoCard}>

          <div className={HM.infoIcon}>
            <AlertCircle size={17} />
          </div>

          <div>

            <h3>
              Records requiring attention
            </h3>

            <p>
              18 medical records are currently waiting
              for review by authorized medical staff.
            </p>

          </div>

          <button>
            Review records
          </button>

        </div>



        <div className={HM.infoCard}>

          <div className={HM.infoIcon}>
            <FileText size={17} />
          </div>
          <div>
            <h3>
              Medical documentation
            </h3>
            <p>
              Keep patient records accurate, complete
              and securely organized.
            </p>
          </div>
          <button>Documentation guide </button>
        </div>
      </section>
      {/* =================================================
          ADD MEDICAL RECORD MODAL

          DESIGN ONLY
          NO LOGIC
      ================================================= */}

      {showModal && (
        <div className={HM.modalOverlay}>
          {showsucess && (
        <p>{successmessage}</p>
      )}
          <div className={HM.modal}>
            {/* Modal Header */}
            <div className={HM.modalHeader}>
              <div>
                <span className={HM.modalLabel}>
                  NEW MEDICAL RECORD
                </span>
                <h2>
                  Create medical record
                </h2>
                <p>
                  Add the patient's consultation, diagnosis,
                  treatment and clinical information.
                </p>
              </div>
              <button className={HM.closeButton} onClick={() => setShowModal(false)} >      <X size={18} />   </button>
            </div>
            {/* =========================================
              FORM
          ========================================= */}

          
            <form onSubmit={handleSubmit} className={HM.recordForm}>
              {/* =====================================
                PATIENT INFORMATION
            ===================================== */}
              <div className={HM.formSection}>
                <div className={HM.sectionTitle}>
                  <span className={HM.sectionNumber}>
                    01
                  </span>
                  <div>
                    <h3>Patient information</h3>
                    <p> Select the patient this record belongs to.</p>
                  </div>
                </div>
                <div className={HM.formGrid}>
                  <div className={HM.inputGroup}>
                    <label>  Patient </label>
                   <select name="patients_id" value={formData.patients_id}  onChange={handleChange}required>
                      <option value="">Select patient</option>
             {patients.map((patient) => (
           <option key={patient.id} value={patient.id}>
             {patient.first_name} {patient.last_name}
              </option>
              ))}
             </select>
                  </div>
                  <div className={HM.inputGroup}>
                    <label>Record date    </label>
                    <input  name="record_date" type="date" value={formData.record_date} onChange={handleChange} />
                  </div>
                </div>
              </div>
              {/* =====================================
                CONSULTATION
            ===================================== */}
              <div className={HM.formSection}>
                <div className={HM.sectionTitle}>
                  <span className={HM.sectionNumber}>
                    02
                  </span>
                  <div>
                    <h3>  Consultation  </h3>
                    <p>Information about the patient's visit.  </p>
                  </div>
                </div>
                <div className={HM.formGrid}>
                  <div className={HM.inputGroup}>
                    <label> Attending doctor  </label>
                    <select name="attending_doctor" value={formData.attending_doctor} onChange={handleChange} >
                      <option>   Select doctor    </option>
                      <option>    Dr. Sarah Mensah</option>
                      <option>     Dr. David Owusu</option>
                      <option>  Dr. Michael Boateng </option>
                      <option>     Dr. Grace Addo   </option>
                      <option>    Dr. John Asar </option>
                      <option>   Dr. Linda Arthur  </option>
                    </select>
                  </div>
                  <div className={HM.inputGroup}>
                    <label>   Visit type  </label>
                    <select  name="visit_type" value={formData.visit_type} onChange={handleChange} >
                      <option> Select visit type   </option>
                      <option>   General consultation </option>
                      <option>  Follow-up  </option>
                      <option>Emergency</option>
                      <option> Specialist consultation     </option>
                      <option>       Routine check-up</option>
                    </select>
                  </div>
                  <div className={`${HM.inputGroup} ${HM.fullWidth}`}>
                    <label>      Reason for visit </label>
                    <input  name="reason_for_visit" value={formData.reason_for_visit} onChange={handleChange} type="text" placeholder="What brought the patient to the hospital?" />
                  </div>

                  <div className={`${HM.inputGroup} ${HM.fullWidth}`}>
                    <label>Symptoms      </label>
                    <textarea rows="3"  name="symptoms" value={formData.symptoms} onChange={handleChange} placeholder="Describe the patient's symptoms..." />
                  </div>
                </div>
              </div>
              {/* =====================================
                DIAGNOSIS & TREATMENT
            ===================================== */}
              <div className={HM.formSection}>
                <div className={HM.sectionTitle}>
                  <span className={HM.sectionNumber}>
                    03
                  </span>
                  <div>
                    <h3>   Diagnosis & treatment </h3>
                    <p> Record the doctor's findings and treatment plan.        </p>
                  </div>
                </div>
                <div className={HM.formGrid}>
                  <div className={HM.inputGroup}>
                    <label>   Primary diagnosis      </label>
                    <input    name="primary_diagnosis" value={formData.primary_diagnosis} onChange={handleChange} type="text" placeholder="Enter diagnosis" />
                  </div>
                  <div className={HM.inputGroup}>
                    <label> Diagnosis category   </label>
                    <select name="diagnosis_category"   value={formData.diagnosis_category} onChange={handleChange} >
                      <option>  Select category </option>
                      <option>  General   </option>
                      <option> Cardiovascular     </option>
                      <option>  Respiratory</option>
                      <option>    Neurological   </option>
                      <option>   Gastrointestinal</option>
                      <option>  Hematology</option>
                      <option>    Other  </option>
                    </select>
                  </div>
                  <div className={`${HM.inputGroup} ${HM.fullWidth}`}>
                    <label>  Treatment plan</label>
                    <textarea  name="treatment_plan" value={formData.treatment_plan} onChange={handleChange} rows="4" placeholder="Describe the treatment given or recommended..."
                    />
                  </div>
                </div>
              </div>
              {/* =====================================
                PRESCRIPTION
            ===================================== */}
              <div className={HM.formSection}>
                <div className={HM.sectionTitle}>
                  <span className={HM.sectionNumber}>
                    04
                  </span>
                  <div>
                    <h3>Prescription</h3>
                    <p> Add medication prescribed to the patient.  </p>
                  </div>
                </div>
                <div className={HM.formGrid}>
                  <div className={HM.inputGroup}>
                    <label>  Medication </label>
                    <input  name="medication" value={formData.medication} onChange={handleChange} type="text" placeholder="Medication name" />
                  </div>
                  <div className={HM.inputGroup}>
                    <label>Dosage</label>
                    <input  name="dosage" value={formData.dosage} onChange={handleChange} type="text" placeholder="e.g. 500mg" />
                  </div>
                  <div className={HM.inputGroup}>
                    <label>Frequency </label>
                    <select  name="frequency" value={formData.frequency} onChange={handleChange} >
                      <option>    Select frequency  </option>
                      <option>    Once daily   </option>
                      <option>Twice daily</option>
                      <option>  Three times daily</option>
                      <option>   As needed   </option>
                    </select>
                  </div>
                  <div className={HM.inputGroup}>
                    <label>  Duration     </label>
                    <input   name="duration" value={formData.duration} onChange={handleChange} type="text" placeholder="e.g. 7 days" />

                  </div>
                </div>
              </div>
              {/* =====================================
                INVESTIGATIONS
            ===================================== */}
              <div className={HM.formSection}>
                <div className={HM.sectionTitle}>
                  <span className={HM.sectionNumber}>
                    05
                  </span>
                  <div>
                    <h3> Investigations</h3>
                    <p>Record laboratory tests and clinical results.</p>
                  </div>
                </div>
                <div className={HM.formGrid}>
                  <div className={HM.inputGroup}>
                    <label>Test / investigation</label>
                    <input type="text"  name="investigation" value={formData.investigation} onChange={handleChange} placeholder="e.g. Complete blood count" />
                  </div>
                  <div className={HM.inputGroup}>
                    <label>Result</label>
                    <input type="text"  name="investigation_result" value={formData.investigation_result} onChange={handleChange} placeholder="Enter test result" />
                  </div>
                  <div className={`${HM.inputGroup} ${HM.fullWidth}`}>
                    <label> Clinical notes</label>
                    <textarea  name="clinical_notes" rows="4" value={formData.clinical_notes} onChange={handleChange} placeholder="Additional clinical observations or doctor's notes..."
                    />
                  </div>
                </div>
              </div>
              {/* =====================================
                RECORD STATUS
            ===================================== */}
              <div className={HM.formSection}>
                <div className={HM.sectionTitle}>
                  <span className={HM.sectionNumber}>
                    06
                  </span>
                  <div>
                    <h3> Record status   </h3>
                    <p>Select the current status of this medical record.</p>
                  </div>
                </div>
                <div className={HM.formGrid}>
                  <div className={HM.inputGroup}>
                    <label>Status</label>
                    <select value={formData.status} name="status" onChange={handleChange} >
                      <option>Select status </option>
                      <option>Active </option>
                      <option>Under review </option>
                      <option>Completed</option>
                    </select>
                  </div>
                  <div className={HM.inputGroup}>
                    <label>Follow-up date </label>

                    <input value={formData.follow_up_date}  name="follow_up_date" onChange={handleChange} type="date" />
                  </div>
                </div>
              </div>
              {/* =====================================
                FORM FOOTER
            ===================================== */}

              <div className={HM.formFooter}>

                <div className={HM.formNotice}>

                  <ClipboardPlus size={15} />

                  <p>
                    Medical information should only be
                    accessible to authorized hospital staff.
                  </p>

                </div>

                <div className={HM.formButtons}>

                  <button  onClick={()=>setShowModal(false)} type="button"    className={HM.cancelButton}  >Cancel</button>

                  <button
                    type="submit"
                    className={HM.saveButton}
                  >
                    <CheckCircle2 size={15} />
                    Save medical record
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default MedicalRecords;









    <div className={HM.page}>
      <div>
        <br className={HM.br1}></br>
        <br className={HM.br2}></br>
        <br className={HM.br3}></br>
        <br className={HM.br4}></br>
      </div>
      <div className={HM.container}>

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
            <button className={HM.refreshButton}  disabled={isRefreshing}  onClick={handleRefresh} title="Refresh dashboard" ><RefreshCw size={17}  className={isRefreshing?HM.spinning:""} />  </button>
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
              {patients.length}
            </div>

            <div className={HM.statLabel}>
              Total Patients
            </div>

            <div className={HM.statFooter}>
              <span>
                <Activity size={13} />
                {patients.filter((patient) => patient.status === "Active").length}
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
              {patients.filter((patient) => patient.status === "waiting").length}
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
              {settings.patient_alerts ? "ON" : "OFF"}
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
              <button className={HM.viewButton}> View all<ArrowUpRight size={15} /></button>
            </div>
            <div className={HM.patientList}>
              {/*
              Take two patients at a time, compare their registration dates, 
              and arrange the patients so that the most recently registered patient comes first.
               */}
              {patients
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

              <button
                className={HM.iconAction}
                title="Open settings"
              >
                <SettingsIcon size={17} />
              </button>

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
                  {settings.email_notifications ? "Enabled" : "Disabled"}
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
                  {settings.patient_alerts ? "Enabled" : "Disabled"}
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


            <button className={HM.adminSettingsButton}>
              Edit profile
              <ArrowUpRight size={15} />
            </button>

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




          <div className={HM.table}>
            <div className={HM.tableHeader}>
              <span>Patient</span>
              <span>Patient ID</span>
              <span>Contact</span>
              <span>Gender</span>
              <span>Last visit</span>
              <span>Status</span>
              <span>Actions</span>
              <span></span>
            </div>
            {currentPatients.length > 0 ? (

              currentPatients.map((patient) => (
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
                    {patient.date_of_birth}
                  </span>

                  <span
                    className={`${HM.status} ${patient.status === "Waiting"
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

                <button
                  type="button"
                  onClick={() => {
                    setSearch("")
                    setCurrentPage(1)
                  }}
                >
                  Clear Search
                </button>

              </div>
            )}

          </div>