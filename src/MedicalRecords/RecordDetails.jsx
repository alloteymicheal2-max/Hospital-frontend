import React, { useState, useEffect } from "react";
import { ArrowLeft, Printer, MoreVertical, UserRound, UserRoundCheck, Phone, MapPin, HeartPulse, Clock3, FileText, Plus, Search, CalendarDays, ChevronDown, CheckCircle2, Pencil, Trash2, Info, ShieldCheck, FilePlus2, X, LoaderCircle } from "lucide-react";
import HM from "./RecordDetails.module.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
const API = import.meta.env.VITE_HOSTING_API


function Records() {
  const navigate = useNavigate()
  const [patients, setPatients] = useState(null)
  const [showsucess, setShowSucess] = useState(false)
  const [successmessage, setSuccessmessage] = useState("")
  const [messageTitle, setMessageTitle] = useState("Success")
  const [medicalRecords, setMedicalRecord] = useState([])
  const [customFields, setCustomFields] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null)
  const [IsCreatingRecord, setIsCreatingRecord] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

    const [serverUnavailable, setServerUnavailable] = useState(false)
    const [checkingServer, setCheckingServer] = useState(false)

  const [formData, setFormData] = useState({
    record_title: "",
    record_type: "",
    record_date: "",
    attending_doctor: "",
    status: "Draft"
  })



  const { patients_id } = useParams();

  async function fetchPatient() {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${API}/patient/${patients_id}`, { headers: { Authorization: `Bearer ${token}` } })
      const result = response.data
      if (result.success === true) {
        setPatients(result.data)
        serverUnavailable(false)

      }
    } catch (error) {
      console.log("Failed to  fetch patient:", error)
      setServerUnavailable(error.response ? false:true)
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

  async function handleSubmit(e) {
    e.preventDefault();
    setIsCreatingRecord(true)
    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(`${API}/record`, { patients_id: patients_id, record_title: formData.record_title, record_type: formData.record_type, record_date: formData.record_date, attending_doctor: formData.attending_doctor, status: formData.status }, { headers: { Authorization: `Bearer ${token}` } })
      console.log("BACKEND RESPONE:", response.data);
      const result = response.data;

      if (result.success === true) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        setShowSucess(true);
        setSuccessmessage(result.message)
        await fetchMedicalRecords()

        setFormData({
          record_title: "",
          record_type: "",
          record_date: "",
          attending_doctor: "",
          status: "Draft"
        });
      }

      setTimeout(() => {
        setShowSucess(false)
      }, 3000);
    } catch (error) {
      console.log("Unable to create Medical history:", error)

    } finally {
      setIsCreatingRecord(false)
    }

  }

  async function fetchMedicalRecords() {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${API}/record/patient/${patients_id}`, { headers: { Authorization: `Bearer ${token}` } })
      console.log("MEDICAL RECORDS", response.data)
      const result = response.data
      if (result.success === true) {
        setMedicalRecord(result.data)
        setServerUnavailable(false)
         for(const record of result.data){
          fetchCustomFields(record.id)
         }
      }
    } catch (error) {
      console.log("Unable to fetch medical records", error)
      setServerUnavailable(error.response? false:true )
    }
  }




  function addCustomField(recordId) {
    const currentFields = customFields[recordId] || []

    setCustomFields({
      ...customFields, [recordId]: [
        ...currentFields, {
          field_name: "",
          field_value: "",
          field_type: "text"
        }
      ]
    })

  }
  async function handleSaveCustomField(recordId) {
    setIsSaving(true)
    try {

      const token = localStorage.getItem("token")

      const fields = customFields[recordId] || []
      for (const field of fields) {

        const response = await axios.post(`${API}/record/customField`,
          {
            medical_history_id: recordId,
            field_name: field.field_name,
            field_value: field.field_value,
            field_type: field.field_type
          }, { headers: { Authorization: `Bearer ${token}` } })

        console.log("CUSTOMS FIELDS", response.data)
        const result = response.data

        if (result.success === true) {
          await new Promise(resolve => setTimeout(resolve, 2000))
          setShowSucess(true)
          setSuccessmessage(result.message)

          setCustomFields({ ...customFields, [recordId]: [] })
        }
      }

      setTimeout(() => {
        setShowSucess(false)
      }, 3000);
    }
    catch (error) {
      console.log("Unable to create custom field:", error)
    }
    finally {
      setIsSaving(false)
    }
  }

  async function fetchCustomFields(recordId) {
    try {
      const token = localStorage.getItem("token")
      console.log("CUSTOM FIELD RECORD ID:", recordId)
      console.log("TOKEN EXISTS:", !!token)
      const response = await axios.get(`${API}/record/customFiled/${recordId}`, { headers: { Authorization: `Bearer ${token}` } })
      console.log("FETCHING RECORDS", response.data)

      const result = response.data

      if (result.success === true) {
       setCustomFields(prev=>({
        ...prev,[recordId]:result.data
       }))
      }
    } catch (error) {

      console.log("Unable to fetch Custom Fields",error.response?.data|| error.message)

    }

  }

  function deleteCustomField(recordId, index) {

    const currentFields = customFields[recordId] || []

    const updatedFields = currentFields.filter((_, fieldIndex) =>
      fieldIndex !== index
    );
 
    setCustomFields({
      ...customFields,
      [recordId]: updatedFields
    })
  }



  function handleCustomFieldChange(recordId, index, name, value) {
    const currentFields = customFields[recordId] || []
    const updatedFields = [...currentFields]

    updatedFields[index][name] = value

    setCustomFields({
      ...customFields,
      [recordId]: updatedFields
    })
  }


  function handleChange(e) {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }


  async function handleUpadtePatient(e, recordId) {
    e.preventDefault()
    setIsCreatingRecord(true)
    try {
      const token = localStorage.getItem("token")
      const response = await axios.put(`${API}/record/${recordId}`, { record_title: formData.record_title, record_type: formData.record_type, record_date: formData.record_date, attending_doctor: formData.attending_doctor, status: formData.status }, { headers: { Authorization: `Bearer ${token}` } });
      console.log("EDITING RESPONSE :", response.data)
      const result = response.data
      if (result.success) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        setMessageTitle("Success")
        setSuccessmessage(result.message)
        setShowSucess(true)
        setEditingRecord(null)

        setFormData({
          record_title: "",
          record_type: "",
          record_date: "",
          attending_doctor: "",
          status: "Draft"
        });

        await fetchMedicalRecords()

        setTimeout(() => {
          setShowSucess(false)
        }, 1500)
      }
    } catch (error) {
      console.log("Failed to fetch patient for editing:", error)
      setSuccessmessage(error.response?.data?.message)
      setShowSucess(false)

      setTimeout(() => {
        setShowSucess(false)
      }, 1000)
    } finally {
      setIsCreatingRecord(false)
    }
  }

  function handleEditClick(record) {
    setEditingRecord(record)

    setFormData({
      record_title: record.record_title || "",
      record_type: record.record_type || "",
      record_date: record.record_date ? record.record_date.split("T")[0] : "",
      attending_doctor: record.attending_doctor || "",
      status: record.status || "Draft"
    })

    setMessageTitle("Ready to edit")
    setSuccessmessage("Medical record loaded. You can now edit the information.");
    setShowSucess(true);

    //"Smoothly scroll until the top of this form reaches the top of the visible area.//
    setTimeout(() => {
      document.getElementById("medical-record-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);

    setTimeout(() => {
      setShowSucess(false)
    }, 2500);
  }



  async function handleDeleteRecord(recordId) {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.delete(`${API}/record/${recordId}`, { headers: { Authorization: `Bearer ${token}` } })
      console.log("DELETE RESPONSE", response.data)
      const result = response.data
      if (result.success === true) {

        setShowDeleteConfirm(false);
        setRecordToDelete(null);

        setSuccessmessage(result.message);
        setShowSucess(true)
        await fetchMedicalRecords();

        setTimeout(() => {
          setShowSucess(false)
        }, 2000);
      }
    } catch (error) {
      console.log("Unable to delete patients", error)
      setSuccessmessage(error.response?.data?.message)
      setShowSucess(true)

      setTimeout(() => {
        setShowSucess(false)
      }, 2000);
    }
  }





  useEffect(() => {
    retryServer()
    fetchPatient()
    fetchMedicalRecords()
  }, [patients_id]);

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "";
    const birthYear = new Date(dateOfBirth).getFullYear()
    const currentYear = new Date().getFullYear()

    return currentYear - birthYear;
  }

  console.log("Patient:", patients);


  return (
    <div className={HM.recordsPage}>
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
      {showsucess && (
        <div className={HM.successCard}>
          <div className={HM.successIcon}>
            <CheckCircle2 size={22} />
          </div>

          <div className={HM.successContent}>
            <h4>{messageTitle}</h4>
            <p>{successmessage}</p>
          </div>
          <button type="button" className={HM.successClose} onClick={() => setShowSucess(false)}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* =====================================================
          TOP NAVIGATION
      ===================================================== */}
      <div className={HM.topNavigation}>
        <button onClick={(e) => navigate("/hospital/medical-records")} className={HM.backButton} type="button"><ArrowLeft size={18} /><span >Back to Medical Records</span>   </button>
        <div className={HM.topActions}>
          <button className={HM.printButton} onClick={() => navigate(`/hospital/reports/${patients_id}`)} type="button"><Printer size={18} /> <span>Print</span></button>
          <button className={HM.patientAction} type="button"><MoreVertical size={20} /></button>
        </div>
      </div>
      {/* =====================================================
          PATIENT HEADER
      ===================================================== */}
      <section className={HM.patientHeader}>
        <div className={HM.patientIdentity}>
          <div className={HM.patientAvatar}>
            {patients?.first_name?.charAt(0)} {patients?.last_name?.charAt(0)}
          </div>
          <div className={HM.patientName}>
            <div className={HM.patientLabel}>
              <UserRoundCheck size={16} />
              PATIENT
            </div>
            <h1>{patients?.first_name} {patients?.last_name} </h1>
            <p>
              Patient ID: <strong>PAT-{patients_id}</strong>
            </p>
          </div>
        </div>
        <div className={HM.patientDetails}>
          <div>
            <span>Gender</span>
            <strong> {patients?.gender}</strong>
          </div>
          <div>
            <span>Age</span>
            <strong>{calculateAge(patients?.date_of_birth)}years</strong>
          </div>
          <div>
            <span>Date of Birth</span>
            <strong>{new Date(patients?.date_of_birth).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</strong>
          </div>
          <div>
            <span>Registered</span>
            <strong>{new Date(patients?.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</strong>
          </div>
        </div>
      </section>
      {/* =====================================================
          PATIENT QUICK INFORMATION
      ===================================================== */}
      <section className={HM.patientQuickInfo}>
        <div className={HM.quickInfoItem}>
          <Phone size={19} />
          <div>
            <span>Phone</span>
            <strong>{patients?.phone || "Not Provided"}</strong>
          </div>
        </div>
        <div className={HM.quickInfoItem}>
          <MapPin size={19} />
          <div>
            <span>Address</span>
            <strong>{patients?.residential_address || "Not Provided"}</strong>
          </div>
        </div>
        <div className={HM.quickInfoItem}>
          <HeartPulse size={19} />
          <div>
            <span>Medical Records</span>
            <strong>{patients?.medical_reccords}</strong>
          </div>
        </div>
        <div className={HM.quickInfoItem}>
          <Clock3 size={19} />
          <div>
            <span>Last Updated</span>
            <strong>24 Aug 2026</strong>
          </div>
        </div>
      </section>
      {/* =====================================================
          MEDICAL RECORD HISTORY HEADER
      ===================================================== */}
      <section className={HM.recordSearchSection}>
        <div className={HM.sectionHeading}>
          <div>
            <h2>  <FileText size={21} />  Medical Record History</h2>
            <p> View and manage medical information recorded for this patient. </p>
          </div>
          <button className={HM.newRecordButton} type="button"><Plus size={18} />New Medical Record  </button>
        </div>
        {/* SEARCH */}
        <div className={HM.recordSearch}>
          <Search size={18} />
          <input type="text" placeholder="Search this patient's records..." />
        </div>
        {/* FILTERS */}
        <div className={HM.recordFilters}>
          <div className={HM.filterItem}>
            <label>Month</label>
            <div className={HM.selectBox}>
              <CalendarDays size={17} />
              <select defaultValue="">
                <option value="">All months</option>
                <option>January</option>
                <option>February</option>
                <option>March</option>
                <option>April</option>
                <option>May</option>
                <option>June</option>
                <option>July</option>
                <option>August</option>
                <option>September</option>
                <option>October</option>
                <option>November</option>
                <option>December</option>
              </select>
              <ChevronDown size={16} />
            </div>
          </div>
          <div className={HM.filterItem}>
            <label>Year</label>
            <div className={HM.selectBox}>
              <CalendarDays size={17} />
              <select defaultValue="">
                <option value="">All years</option>
                <option>2026</option>
                <option>2025</option>
                <option>2024</option>
              </select>
              <ChevronDown size={16} />
            </div>
          </div>
          <div className={HM.filterItem}>

            <label>Record Type</label>

            <div className={HM.selectBox}>

              <FileText size={17} />

              <select defaultValue="" name="record_type" value={formData.record_type} onChange={handleChange} >
                <option value="">All types</option>
                <option>Consultation</option>
                <option>Follow-up</option>
                <option>Assessment</option>
                <option>General Record</option>
              </select>

              <ChevronDown size={16} />

            </div>

          </div>


          <div className={HM.filterItem}>

            <label>Status</label>

            <div className={HM.selectBox}>

              <CheckCircle2 size={17} />

              <select defaultValue="">
                <option value="">All statuses</option>
                <option>Completed</option>
                <option>Draft</option>
                <option>Recently Updated</option>
              </select>

              <ChevronDown size={16} />

            </div>

          </div>


          <button className={HM.applyFilterButton} type="button">
            Apply
          </button>

        </div>

      </section>


      {/* =====================================================
          RECORD SUMMARY
      ===================================================== */}

      <div className={HM.recordsSummary}>

        <div>
          <span>Showing</span>
          <strong>2 medical records</strong>
        </div>

        <button className={HM.clearFiltersButton} type="button">
          Clear filters
        </button>

      </div>


      {/* =====================================================
          MEDICAL RECORD 1
      ===================================================== */}

      {medicalRecords.length > 0 ? (<>   {medicalRecords.map((record) => (
        <section className={HM.recordCard} key={record.id} >

          {/* RECORD HEADER */}

          <div className={HM.recordCardHeader}>

            <div className={HM.recordTitleArea}>

              <div className={HM.recordIcon}>
                <FileText size={22} />
              </div>

              <div>

                <span className={HM.recordType}>
                  {record.record_type}
                </span>

                <h2>
                  {record.record_title}
                </h2>

                <p>
                  Created on{" "}
                  {new Date(record.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                  })}
                </p>

              </div>

            </div>


            <div className={HM.recordCardActions}>

              <span className={`${HM.recordStatus} ${HM.completed}`}>
                <CheckCircle2 size={15} />
                {record.status}
              </span>
              <button className={HM.iconAction} type="button" onClick={() => handleEditClick(record)} title="Edit record" >  <Pencil size={17} />   </button>
              <button className={`${HM.iconAction} ${HM.deleteAction}`} onClick={() => { setRecordToDelete(record); setShowDeleteConfirm(true) }} type="button" title="Delete record"     ><Trash2 size={17} /></button>
            </div>

          </div>


          {/* RECORD META */}
          <div className={HM.recordMeta}>
            <div className={HM.recordMetaItem}>
              <span>
                <UserRound size={16} />
                Attending Doctor
              </span>

              <strong>
                {record.attending_doctor || "Not provided "}
              </strong>
            </div>

            <div className={HM.recordMetaItem}>
              <span>
                <CalendarDays size={16} />
                Record Date
              </span>

              <strong>
                {new Date(record.record_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                })}
              </strong>
            </div>

            <div className={HM.recordMetaItem}>
              <span>
                <Clock3 size={16} />
                Last Updated
              </span>

              <strong>
                {new Date(record.updated_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                })}
              </strong>
            </div>
          </div>
          {/* =====================================================
            HEALTH INFORMATION SECTION 1
        ===================================================== */}
          <div className={HM.informationSection}>
            <div className={HM.informationHeader}>
              <div>
                <h3>  Health Information </h3>
                <p> General health information recorded during this visit.</p>
              </div>
              <button onClick={() => addCustomField(record.id)} className={HM.addFieldButton} type="button ">  <Plus size={17} />Add Field</button>
            </div>




            {(customFields[record.id] || []).map((field, index) => (
              <div className={HM.customField} key={index} >
                <div className={HM.fieldName}>
                  <input className={HM.fieldNameInput} type="text" value={field.field_name} placeholder="field name" onChange={(e) => handleCustomFieldChange(record.id, index, "field_name", e.target.value)} />
                  <span>  Property  </span>
                </div>
                <div className={HM.fieldValue}>
                  <textarea value={field.field_value} onChange={(e) => handleCustomFieldChange(record.id, index, "field_value", e.target.value)} placeholder="Enter information..." />
                </div>
                <button className={HM.fieldDelete} onClick={() => deleteCustomField(record.id, index)} type="button" title="Remove field"> <Trash2 size={17} />   </button>

              </div>

            ))}
            <button onClick={() => addCustomField(record.id)} className={HM.addAnotherField} type="button"><Plus size={18} /> Add Another Information Field</button>
          </div>
          {/* RECORD FOOTER */}
          <div className={HM.recordFooter}>
            <div className={HM.lastModified}>
              <Info size={17} />
              <span>
                Last changes saved on 24 Aug 2026 at 10:15 AM
              </span>
            </div>
            <div className={HM.saveActions}>
              <button className={HM.cancelButton} type="button"> Cancel</button>
              <button className={HM.saveButton} type="button" disabled={isSaving} onClick={() => handleSaveCustomField(record.id)}    ><CheckCircle2 size={17} />{isSaving ? (<><LoaderCircle size={17} className={HM.spinner} />Saving...</>) : (<>Save changes</>)}</button>
            </div>
          </div>
        </section>
      ))}
        {/* =====================================================
          CREATE NEW RECORD
      ===================================================== */}

        {/* =====================================================
          FOOTER
      ===================================================== */}


        <div className={HM.pageFooter}>

          <div>

            <ShieldCheck size={17} />

            <span>
              Patient information is securely stored.
            </span>

          </div>


          <span>
            Patient ID: {patients_id}
          </span>

        </div>
        {showDeleteConfirm && (
          <div className={HM.deleteOverlay}>
            <div className={HM.deleteCard}>

              <div className={HM.deleteIcon}>
                <Trash2 size={26} />
              </div>

              <div className={HM.deleteContent}>
                <h3>Delete Medical Record?</h3>

                <p>
                  Are you sure you want to delete this medical record?
                  This action cannot be undone.
                </p>

                {recordToDelete && (
                  <div className={HM.deleteRecordInfo}>
                    <strong>{recordToDelete.record_title}</strong>
                    <span>
                      {recordToDelete.record_type}
                    </span>
                  </div>
                )}
              </div>

              <div className={HM.deleteActions}>
                <button type="button" className={HM.cancelDelete} onClick={() => { setShowDeleteConfirm(false); setRecordToDelete(null); }}>    Cancel  </button>
                <button type="button" className={HM.confirmDelete} onClick={() => { handleDeleteRecord(recordToDelete.id); }}>  <Trash2 size={17} />      Delete Record   </button>
              </div>
            </div>
          </div>
        )}</>) : (<>
          <div className={HM.emptyRecordsState}>
            <div className={HM.emptyRecordsIcon}>
              <FileText size={34} strokeWidth={1.7} />
            </div>

            <div className={HM.emptyRecordsContent}>
              <span className={HM.emptyRecordsBadge}>
                MEDICAL RECORDS
              </span>

              <h2>No Medical Records Yet</h2>

              <p>
                This patient does not have any medical records at the moment.
                Create a medical record to document consultations, diagnoses,
                follow-ups, treatments, and other important clinical information.
              </p>

              <div className={HM.emptyRecordsInfo}>
                <Info size={16} />
                <span>
                  Patient records will appear here after they are created.
                </span>
              </div>

              <button type="button" className={HM.emptyRecordsButton} onClick={() => { document.getElementById("medical-record-form")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} ><Plus size={17} /> Create Medical Record</button>
            </div>
          </div>

        </>)}

      <section className={HM.newRecordSection} id="medical-record-form" >
        <div className={HM.newRecordIcon}>
          <FilePlus2 size={24} />
        </div>

        <div className={HM.newRecordContent}>
          <h2>
            {editingRecord ? "Edit Medical Record" : "Add a New Medical Record"}
          </h2>

          <p> {editingRecord ? "Update the information for this medical record." : "Create a separate record for another consultation, illness, follow-up or patient visit."}
          </p>

        </div>

        {/* CREATE RECORD FORM */}

        <form id="medical-record-form" className={HM.createRecordForm} onSubmit={(e) => { if (editingRecord) { handleUpadtePatient(e, editingRecord.id) } else { handleSubmit(e) } }}>
          {/* RECORD TITLE */}
          <div className={HM.formGroup}>
            <label htmlFor="record_title">
              Record Title
            </label>
            <input id="record_title" type="text" name="record_title" value={formData.record_title} onChange={handleChange} placeholder="e.g. Malaria Consultation" required />
          </div>
          {/* RECORD TYPE */}
          <div className={HM.formGroup}>
            <label htmlFor="record_type">
              Record Type
            </label>
            <select id="record_type" name="record_type" value={formData.record_type} onChange={handleChange} required >
              <option value=""> Select record type </option>
              <option value="Consultation"> Consultation</option>
              <option value="Follow-up">Follow-up </option>
              <option value="Assessment">Assessment</option>
              <option value="General Record">General Record  </option>
            </select>
          </div>
          {/* RECORD DATE */}
          <div className={HM.formGroup}>
            <label htmlFor="new_record_date">
              <CalendarDays size={16} />
              Record Date
            </label>
            <input id="new_record_date" type="date" name="record_date" value={formData.record_date} onChange={handleChange} required />
          </div>
          {/* ATTENDING DOCTOR */}
          <div className={HM.formGroup}>
            <label htmlFor="new_attending_doctor">
              <UserRound size={16} />
              Attending Doctor
            </label>
            <input id="new_attending_doctor" type="text" name="attending_doctor" value={formData.attending_doctor} onChange={handleChange} placeholder="Enter doctor's name" required />
          </div>
          {/* STATUS */}
          <div className={HM.formGroup}>
            <label htmlFor="new_status">
              Status
            </label>
            <select id="new_status" name="status" value={formData.status} onChange={handleChange} >
              <option value="Draft"> Draft  </option>
              <option value="Active">Active</option>
              <option value="Completed"> Completed </option>
            </select>
          </div>

          {/* BUTTON */}
          <div className={HM.createRecordActions}>
            <button className={HM.cancelButton} type="button" onClick={() => {
              setEditingRecord(null);
              setFormData({
                record_title: "",
                record_type: "",
                record_date: "",
                attending_doctor: "",
                status: "Draft"
              });
            }}
            >
              Cancel
            </button>

            <button className={HM.saveButton} disabled={IsCreatingRecord} type="submit" > <CheckCircle2 size={17} />  {IsCreatingRecord ? (<><LoaderCircle size={17} className={HM.spinner} />{editingRecord ? "saving Changes..." : "creating..."}</>) : (<>{editingRecord ? "update Record" : "Create Record"}</>)}</button>

          </div>

        </form>

      </section>

    </div>
  );
}

export default Records;