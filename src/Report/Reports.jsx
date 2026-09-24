import { ArrowLeft, Printer, UserRound, Hospital, MapPin, Phone, Mail, Info, CheckSquare, Square, FileText, ClipboardPlus, UserRoundCheck, BadgeCheck, CalendarDays, Clock3, ShieldCheck, LockKeyhole, FileText as FileTextIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import HM from "./Reports.module.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useNotification } from "../../NotificationContext";
const API = import.meta.env.VITE_HOSTING_API
function Reports() {
  const { patients_id } = useParams()
  const [patient, setPatient] = useState(null)
  const [medicalRecords, setMedicalRecords] = useState([])
  const [customFields, setCustomFields] = useState([]);
  const { active100, setActive100 } = useNotification()
      const [serverUnavailable, setServerUnavailable] = useState(false)
      const [checkingServer, setCheckingServer] = useState(false)
  const [settings, setSettings] = useState({
    hospital_name: "",
    hospital_email: "",
    hospital_phone: "",
    hospital_address: ""
  })
  async function fetchPatient() {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${API}/patient/${patients_id}`, { headers: { Authorization: `Bearer ${token}` } })
      console.log("FETCHING RESPONSE:", response.data)
      const result = response.data

      if (result.success === true) {
        setPatient(result.data)
        setServerUnavailable(false)
      }
    } catch (error) {
      console.log("Unable  to  fetch patient", error)
      setServerUnavailable(error.response?false:true)
    }
  }
  async function fetchMedicalRecords() {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${API}/record/patient/${patients_id}`, { headers: { Authorization: `Bearer ${token}` } })
      console.log("MEDICAL RECORDSssss", response.data)
      const result = response.data
      if (result.success === true) {
        setMedicalRecords(result.data)
        await fetchCustomFields(result.data)
        setServerUnavailable(false)
      }
    } catch (error) {
      console.log("Unable to fetch medical records", error)
      serverUnavailable(error.response?false:true)
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



  async function fetchCustomFields(records) {
    try {

      let allCustomsFields = []
      const token = localStorage.getItem("token")
      for (const record of records) {
        const response = await axios.get(`${API}/record/customFiled/${record.id}`, { headers: { Authorization: `Bearer ${token}` } })
        console.log("FETCHING RECORDS", response.data)

        const result = response.data

        if (result.success === true) {
          allCustomsFields = [...allCustomsFields, ...result.data]
        }
      }

      setCustomFields(allCustomsFields)
    } catch (error) {

      console.log("Unable to fetch Custom Fields", error)

    }

  }


  useEffect(() => {
    if (!patients_id) {
      return
    }
    retryServer()
    fetchPatient();
    fetchMedicalRecords()
    fetchhospitalDetails()
  }, [patients_id]
  )
  const navigate = useNavigate()


  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "";
    const birthYear = new Date(dateOfBirth).getFullYear()
    const currentYear = new Date().getFullYear()

    return currentYear - birthYear;
  }

  async function fetchhospitalDetails() {
    try {
      const response = await axios.get(`${API}/settings`)
      const result = response.data


      if (result.success === true && result.data.length > 0) {
        setSettings(result.data[0]);
      }
    } catch (error) {
      console.log("Unable to fetch details", error)
    }
  }



  return (
    <div className={HM.printReportsPage}>

       {serverUnavailable && (
    <div className={HM.serverErrorOverlay}>
      <div className={HM.serverErrorCard}>
        <div className={HM.serverErrorIcon}>
          <LoaderCircle size={30} />
        </div>
        <div className={HM.serverErrorContent}>
          <span className={HM.serverErrorBadge}>
            CONNECTION ERROR
          </span>
          <h2>Server Unavailable</h2>
          <p>
            We couldn't connect to the hospital server.
            Please check your connection and try again.
          </p>
          <div className={HM.serverErrorInfo}>
            <span className={HM.statusDot}></span>
            <span>
              The system is currently unable to reach the backend server.
            </span>
          </div>
        </div>
        <button type="button"   className={HM.retryServerButton}   onClick={async () => {  await retryServer()
            if (!serverUnavailable) {
              fetchPatient()
              fetchMedicalRecords()
            }
          }}
          disabled={checkingServer}
        >
          {checkingServer ? (  <><LoaderCircle size={17} className={HM.spinner}    /> Checking connection...</> ) : (<> <LoaderCircle size={17} />Retry Connection</> )}
        </button>
      </div>
    </div>
  )}
     

      {!patients_id ? (<>
        <div className={HM.defaultReportsState}>
          <div className={HM.defaultReportsIcon}>
            <FileText size={38} strokeWidth={1.6} />
          </div>

          <span className={HM.defaultReportsBadge}>
            REPORT CENTER
          </span>

          <h1>No Report Selected</h1>

          <p>
            Select a patient's medical record to view their medical
            information, review their report, or prepare it for printing.
          </p>

          <div className={HM.defaultReportsInfo}>
            <Info size={16} />
            <span>
              Reports become available after selecting a patient's medical record.
            </span>
          </div>

          <button type="button" className={HM.defaultReportsButton} onClick={() => navigate("/hospital/medical-records")} ><FileText size={17} />  Go to Medical Record </button>
        </div>

      </>) :
        (<>


          <div className={HM.topNavigation}>
            <button className={HM.backButton} onClick={(e) =>{ navigate(`/record-details/${patients_id}`); setActive100(false)}}  ><ArrowLeft size={17} /><span>Back to Reports </span></button>
            <div className={HM.topTitle}>
              <Printer size={20} />
              <div>
                <span> REPORT PREVIEW</span>
                <h1> Patient Reports     </h1>
              </div>
            </div>
            <button className={HM.printAllButton}><Printer size={16} />  Print Selected</button>
          </div>
          {/* =====================================================
          PATIENT SUMMARY
      ====================================================== */}
          <div className={HM.patientSummary}>
            <div className={HM.patientIdentity}>
              <div className={HM.patientAvatar}>
                <UserRound size={24} />
              </div>
              <div>
                <span className={HM.patientLabel}>
                  PATIENT
                </span>

                <h2>
                  {patient?.first_name} {patient?.last_name}
                </h2>

                <p>
                  Patient ID:
                  <strong> {" "}   {patients_id} </strong>
                </p>
              </div>
            </div>
            <div className={HM.patientDetails}>
              <div>
                <span>
                  Date of Birth
                </span>
                <strong>
                  {patient?.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Not Provided"}
                </strong>

              </div>

              <div>

                <span> Age  </span>
                <strong>{calculateAge(patient?.date_of_birth)} years </strong>
              </div>
              <div>
                <span>Gender </span>
                <strong>{patient?.gender} </strong>
              </div>
              <div>
                <span> Phone  </span>
                <strong>   {patient?.phone}  </strong>
              </div>
            </div>
          </div>

          {/* =====================================================
          INSTRUCTION
      ====================================================== */}
          <div className={HM.reportInstruction}>
            <div className={HM.instructionIcon}>
              <Info size={19} />
            </div>
            <div>

              <h3>
                Select information to print
              </h3>

              <p>
                Check or uncheck individual information
                before printing the patient's medical report.
              </p>

            </div>


            <div className={HM.selectionActions}>

              <button>

                <CheckSquare size={14} />

                Select All

              </button>


              <button>

                <Square size={14} />

                Clear All

              </button>

            </div>

          </div>


          {/* =====================================================
          REPORT SUMMARY
      ====================================================== */}

          <div className={HM.reportSummaryBar}>

            <div>

              <FileText size={16} />

              <span>
                {medicalRecords.length} medical records
              </span>

            </div>


            <div className={HM.selectedCount}>

              <CheckSquare size={15} />

              <span>
                Selected information ready for printing
              </span>

            </div>

          </div>


          {/* =====================================================
          MEDICAL REPORT DOCUMENTS
      ====================================================== */}
          {medicalRecords.length > 0 ? (
            <>
              {medicalRecords.map((record) => (
                <div className={HM.reportDocument} key={record.id} >
                  <div className={HM.documentHospitalHeader}>
                    <div className={HM.hospitalBrand}>
                      <div className={HM.hospitalLogo}>
                        <Hospital size={23} />
                      </div>
                      <div>
                        <h2> {settings.hospital_name}  </h2>
                        <p>Quality Care • Compassion • Excellence</p>
                      </div>
                    </div>
                    <div className={HM.hospitalContact}>
                      <span> <MapPin size={12} /> {settings.hospital_address}</span>
                      <span>  <Phone size={12} />    {settings.hospital_phone}   </span>
                      <span>  <Mail size={12} /> {settings.hospital_email}   </span>
                    </div>
                  </div>
                  {/* =================================================
              DOCUMENT TITLE
          ================================================== */}
                  <div className={HM.documentTitle}>
                    <div>
                      <span>MEDICAL RECORD </span>
                      <h2> {record.record_title}</h2>
                      <p className={HM.recordReference}> Record No: {record.id}    </p>
                    </div>
                    <label className={HM.includeRecord}>
                      <input type="checkbox" defaultChecked />
                      Include this record
                    </label>
                  </div>
                  {/* =================================================
              PATIENT INFORMATION
          ================================================= */}
                  <div className={HM.documentPatientInfo}>
                    <div>
                      <span>Patient Name  </span>
                      <strong>
                        {patient?.first_name} {patient?.last_name}
                      </strong>
                    </div>
                    <div>
                      <span> Patient ID</span>
                      <strong>     {patients_id}</strong>
                    </div>
                    <div>
                      <span>Age </span>
                      <strong>{calculateAge(patient?.date_of_birth)} years</strong>
                    </div>
                    <div>
                      <span> Gender      </span>
                      <strong>{patient?.gender}   </strong>
                    </div>
                    <div>
                      <span> Record Date    </span>
                      <strong>{record.record_date ? record.record_date.split("T")[0] : ""} </strong>
                    </div>
                    <div>
                      <span>    Status    </span>
                      <strong className={record.status === "Completed" ? HM.completedStatus : HM.updatedStatus}> {record.status}</strong>
                    </div>
                  </div>
                  {/* =================================================
              CLINICAL INFORMATION
          ================================================== */}
                  <div className={HM.documentSection}>
                    <div className={HM.documentSectionHeader}>
                      <div>
                        <span>CLINICAL INFORMATION</span>
                        <h3>Medical Details</h3>
                      </div>
                      <ClipboardPlus size={19} />
                    </div>
                    <div className={HM.medicalTable}>

                      {customFields
                        .filter((field) => field.medical_history_id === record.id)
                        .map((field) => (
                          <div className={HM.reportField} key={field.id}>

                            <label>
                              <input type="checkbox" defaultChecked />

                              <span>
                                {field.field_name}
                              </span>
                            </label>

                            <div className={HM.reportValue}>
                              {field.field_value}
                            </div>

                          </div>
                        ))}


                    </div>
                  </div>
                  <div className={HM.recordDetails}>
                    <div>
                      <span>
                        Recorded By
                      </span>
                      <strong>
                        <UserRoundCheck size={12} />
                        {record.attending_doctor}
                      </strong>
                    </div>
                    <div>
                      <span>Professional Role </span>
                      <strong>
                        <UserRound size={12} />
                        Attending Doctor
                      </strong>
                    </div>
                    <div>
                      <span>
                        License / Registration
                      </span>
                      <strong>
                        ______________________________
                      </strong>

                    </div>
                    <div>
                      <span> Record Date   </span>
                      <strong>
                        <CalendarDays size={12} />
                        {record.record_date ? record.record_date.split("T")[0] : ""}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Last Updated
                      </span>

                      <strong> <Clock3 size={12} />
                        {record.updated_at ? record.updated_at.split("T")[0] : ""}
                      </strong>
                    </div>
                    <div>

                      <span>
                        Document Reference
                      </span>
                      <strong>

                        <FileTextIcon size={12} />
                        MR-{record.id}
                      </strong>

                    </div>

                  </div>


                  {/* =================================================
              DOCTOR DECLARATION
          ================================================== */}

                  <div className={HM.doctorDeclaration}>

                    <div className={HM.declarationHeader}>

                      <ShieldCheck size={18} />

                      <div>

                        <span>
                          CLINICAL DECLARATION
                        </span>

                        <h3>
                          Attending Clinician
                        </h3>

                      </div>

                    </div>


                    <p>
                      I confirm that the information contained
                      in this medical record represents the
                      patient's clinical information recorded
                      during the stated consultation or review.
                    </p>

                  </div>


                  {/* =================================================
              SIGNATURE SECTION
          ================================================== */}

                  <div className={HM.signatureSection}>

                    <div className={HM.signatureBox}>

                      <div className={HM.signatureSpace}></div>

                      <div className={HM.signatureLine}></div>

                      <strong>
                        {record.attending_doctor}
                      </strong>

                      <span>
                        Attending Doctor
                      </span>

                      <span>
                        Medical Record #{record.id}
                      </span>

                      <small>
                        Doctor's Signature
                      </small>

                    </div>


                    <div className={HM.signatureBox}>

                      <div className={HM.signatureSpace}></div>

                      <div className={HM.signatureLine}></div>

                      <strong>
                        ______________________________
                      </strong>

                      <span>
                        Reviewing Clinician
                      </span>

                      <span>
                        Professional ID: __________________
                      </span>

                      <small>
                        Reviewing Signature
                      </small>

                    </div>


                    <div className={HM.signatureBox}>

                      <div className={HM.signatureSpace}></div>

                      <div className={HM.signatureLine}></div>

                      <strong>
                        {record.record_date}
                      </strong>
                      <span>Date    </span>
                      <span>
                        Time: __________________
                      </span>
                      <small>
                        Date of Authorization
                      </small>
                    </div>
                  </div>
                  {/* =================================================
              CONFIDENTIALITY NOTICE
          ================================================== */}
                  <div className={HM.confidentialityNotice}>
                    <LockKeyhole size={14} />
                    <div>

                      <strong>
                        CONFIDENTIAL MEDICAL INFORMATION
                      </strong>

                      <p>
                        This document contains confidential
                        patient information and is intended
                        only for authorized medical or
                        administrative purposes. Unauthorized
                        disclosure or distribution is prohibited.
                      </p>

                    </div>

                  </div>


                  {/* =================================================
              DOCUMENT FOOTER
          ================================================== */}

                  <div className={HM.documentFooter}>

                    <div>

                      <Hospital size={12} />

                      <span>
                        {settings.hospital_name}
                      </span>

                    </div>


                    <span>
                      {settings.hospital_address}
                    </span>


                    <span>
                      Record: {record.id}
                    </span>

                  </div>

                </div>

              ))}

            </>) : (<>
              <div className={HM.emptyReportState}>
                <div className={HM.emptyReportIcon}>
                  <FileText size={34} strokeWidth={1.7} />
                </div>

                <div className={HM.emptyReportContent}>
                  <span className={HM.emptyReportBadge}>
                    REPORTS
                  </span>

                  <h2>No Reports Yet</h2>

                  <p>
                    There are currently no medical reports available for this patient.
                    Once a medical record is created, the patient's report will appear
                    here and can be reviewed or printed.
                  </p>

                  <div className={HM.emptyReportInfo}>
                    <Info size={16} />
                    <span>
                      Create a medical record to generate a report.
                    </span>
                  </div>

                  <button className={HM.emptyReportButton} onClick={() => navigate("/hospital/medical-records")} ><ClipboardPlus size={17} /> Go to Medical Records</button>
                </div>
              </div>
            </>)}

          {/* =====================================================
          FINAL ACTIONS
      ====================================================== */}

          <div className={HM.finalActions}>

            <div className={HM.finalMessage}>

              <div className={HM.finalIcon}>

                <FileText size={18} />

              </div>


              <div>

                <h3>
                  Reports are ready
                </h3>

                <p>
                  Only the selected records and information
                  will be included when printing.
                </p>
              </div>
            </div>
            <div className={HM.finalButtons}>
              <button className={HM.cancelPrintButton} onClick={()=>setActive100(false)}><ArrowLeft size={15} />Back </button>
              <button className={HM.printButton} onClick={() => { setActive100(true); window.print() }}  >   <Printer size={15} />   Print Reports</button>
            </div>
          </div>
          {/* =====================================================
          PAGE FOOTER
      ====================================================== */}
          <div className={HM.pageFooter}>
            <div>
              <LockKeyhole size={11} />
              <span>
                Confidential patient information
              </span>
            </div>
            <span>
              {settings.hospital_name}
            </span>
          </div>

        </>)}
    </div>
  );
}

export default Reports;


