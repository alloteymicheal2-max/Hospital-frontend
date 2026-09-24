import { Search, RotateCcw, Trash, LoaderCircle, UserRound, CalendarDays, AlertTriangle, Trash2 } from "lucide-react";
import HM from "./RecycleBin.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
// import Patients from "../Patients/Patients";

function RecycleBin() {
  const [serverUnavailable, setServerUnavailable] = useState(false)
  const [checkingServer, setCheckingServer] = useState(false)
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [modalAction, setModalAction] = useState("")
  const [successAction, setSuccessAction] = useState("")
  const [deletedPatients, setDeletePatients] = useState([])
  const [search, setSearch] = useState("")
  const [showsucess, setShowSucess] = useState(false)
  const [successmessage, setSuccessmessage] = useState("")

  const [isDeleting,setIsDeleting]=useState(false)
  const API = import.meta.env.VITE_HOSTING_API


  async function fetchDeletePatient() {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${API}/patient/recycle-bin`, { headers: { Authorization: `Bearer ${token}` } })
      const result = response.data
      console.log("API RESPONSE:", result)

      if (result.success) {
        setDeletePatients(result.data)
        setServerUnavailable(false)
      }
    } catch (error) {
      console.log("failed to deleted patients", error)
      if (!error.response) {
        setServerUnavailable(true)
      }
    }
  }

  async function retryServer() {
    setCheckingServer(true)
    try {
      const token = localStorage.getItem("token");
      await axios.get(`${API}/patient/recycle-bin`, { headers: { Authorization: `Bearer ${token}` } });
      setServerUnavailable(false);
      await fetchDeletePatient()
    } catch (error) {
      setServerUnavailable(
        error.response ? false : true
      );
    } finally {
      setCheckingServer(false)
    }
  }



  useEffect(() => {
    fetchDeletePatient()
  }, [])

  async function handleRestorePatient(id) {
    setIsDeleting(true)
    try {
      const token = localStorage.getItem("token")
      const response = await axios.put(`${API}/patient/recycle-bin/${id}/restore`, {}, { headers: { Authorization: `Bearer ${token}` } })
      const result = response.data

      if (result.success) {
        await new Promise(resolve=>setTimeout(resolve,2000))
        setSuccessmessage(result.message)
        setShowSucess(true)
        setSuccessAction("restore")
        await fetchDeletePatient()
        setTimeout(() => {
          setShowSucess(false)
        }, 3000);
      }
    } catch (error) {
      console.log("failed to restore Patient:", error)
    }finally{
      setIsDeleting(false)
    }
  }

  async function handleDelete(id) {
    setIsDeleting(true)
    try {
      const token = localStorage.getItem("token")
      console.log("Deleting patient ID:", id);
      console.log("Token exists:", !!token);
      const response = await axios.delete(`${API}/patient/recycle-bin/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      const result = response.data

      if (result.success === true) {
        await new Promise(resolve=>setTimeout(resolve,5000))
        console.log(result.message)
        setSuccessmessage(result.message)
        setShowSucess(true)

        setSuccessAction("delete")
        await fetchDeletePatient()
        setTimeout(() => {
          setShowSucess(false)
        }, 3000);
      }
    } catch (error) {
      console.log("Unable to delete patients", error)
      console.log("BACKEND ERROR:", error.response?.data);
      setSuccessmessage(error.response?.data?.message || "failed to Delete")
      setShowSucess(true)

      await fetchDeletePatient()
      setTimeout(() => {
        setShowSucess(false)
      }, 3000);

    }finally{
      setIsDeleting(false)
    }

  }


  async function handelModalAction() {
      if (modalAction === "restore") {

    await handleRestorePatient(selectedPatient.id)

  } else {

    await handleDelete(selectedPatient.id)

  }

  setShowRestoreModal(false)
  setSelectedPatient(null)
  setModalAction("")
  }

  const filteredPatients = deletedPatients.filter((patient) => {
    return (
      patient.first_name.toLowerCase().includes(search.toLowerCase()) ||
      patient.last_name.toLowerCase().includes(search.toLowerCase())
    )
  })

  return (
    <div className={HM.page}>
      <div>
        <br className={HM.br1}></br>
        <br className={HM.br2}></br>
        <br className={HM.br3}></br>
        <br className={HM.br4}></br>
      </div>
      {showsucess && (
        <div className={HM.successToast}>
          <div className={HM.successIcon}>✓</div>

          <div className={HM.successContent}>
            <strong>{successAction === "delete" ? "Patient Deleted Successfully" : "Patient restored sucessfully"}</strong>
            <span>{successmessage}</span>
          </div>
          <button type="button" onClick={() => setShowSucess(false)} className={HM.successClose}> ×</button>
        </div>
      )}
      {/* ================================
          PAGE HEADER
      ================================= */}
      <div className={HM.pageHeader}>
        <div>
          <div className={HM.eyebrow}>
            <Trash2 size={13} />
            Deleted items
          </div>
          <h1> Recycle Bin</h1>
          <p>  Manage deleted patients and records before they are permanently removed.</p>
        </div>
        <button className={HM.emptyButton} disabled={serverUnavailable} title={serverUnavailable ? "Server unavailable." : "Permanently delete all items"} type="button"> <Trash size={14} />  {serverUnavailable ? "Server error" : "Empty Recycle bin"} </button>

      </div>
      {/* ================================

      ================================= */}
      <div className={HM.warning}>
        <div className={HM.warningIcon}>
          <AlertTriangle size={16} />
        </div>
        <div>
          <strong>Items in the recycle bin  </strong>
          <span>Deleted items can be restored or permanently removed</span>
        </div>
      </div>
      {/* ================================
          TOOLBAR
      ================================= */}
      <div className={HM.toolbar}>
        <div className={HM.searchBox}>
          <Search size={15} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search deleted items..." />
        </div>
        <button className={HM.filterButton}>All items  </button>
      </div>
      {/* ================================
          DELETED ITEMS
      ================================= */}
     <section className={HM.card}>
        <div className={HM.cardHeader}>
          <div>
            <h2>Deleted items</h2>
            <p> {deletedPatients.length}items currently in the recycle bin</p>
          </div>
        </div>

         {serverUnavailable ? (
          <div className={HM.recycleServerError}>
            <div className={HM.serverErrorCard}>
              <div className={HM.serverErrorIcon}>
                <AlertTriangle size={30} />
              </div>
              <span className={HM.serverErrorLabel}>
                CONNECTION ERROR
              </span>
              <h2>Server unavailable</h2>
              <p>
                We couldn't load the deleted items.
                Please try again.
              </p>
              <button type="button" className={HM.retryServerButton} onClick={retryServer} disabled={checkingServer} > {checkingServer ? (<><LoaderCircle size={16} className={HM.retrySpinner} />Checking... </>) : ("Try again")}
              </button>
            </div>

          </div>

        ) : (

          <div className={HM.items}>
    { filteredPatients.map((patient) => {
            return (
            <div className={HM.item} key={patient.id} >
              <div className={HM.itemIcon}>
                <UserRound size={17} />
              </div>
              <div className={HM.itemInfo}>
                <strong> {patient.first_name} {patient.last_name}</strong>
                <span> Patient record • PAT-{patient.id}</span>
              </div>
              <div className={HM.date}>
                <CalendarDays size={12} />
                {new Date(patient.deleted_at).toLocaleDateString()}
              </div>
              <div className={HM.actions}>
                <button className={HM.restoreButton} onClick={() => { setShowRestoreModal(true), setModalAction("restore"), setSelectedPatient(patient) }} ><RotateCcw size={13} /> Restore </button>
                <button className={HM.deleteButton} onClick={() => { setShowRestoreModal(true), setSelectedPatient(patient), setModalAction("delete") }}  ><Trash2 size={13} /></button>
              </div>
            </div>
            )
          })}

          </div>
)}


      </section>

      {/* ================================
          FOOTER INFORMATION
      ================================= */}
      <div className={HM.infoBox}>
        <Trash2 size={15} />
        <div>
          <strong>Keep your hospital records organized</strong>
          <span>
            Restored items will return to their original location.
            Permanently deleted items cannot be recovered.
          </span>
        </div>
      </div>

      {/* ================================
    RESTORE CONFIRMATION CARD
================================= */}
      {showRestoreModal && selectedPatient && (
        <div className={HM.modalOverlay}>
          <div className={modalAction === "restore" ? HM.restoreModal : HM.deleteModal}>

            <div className={modalAction === "restore" ? HM.restoreModalIcon : HM.deleteModalIcon}>
              {modalAction === "restore" ? (<> <RotateCcw size={24} /></>) : (<> <Trash2 size={26} /></>)}
            </div>

            <div className={HM.restoreModalContent}>
              <h2>{modalAction === "restore" ? "Restore Patient?" : "Delete Patient parmaenently"}</h2>
              <p>{modalAction === "restore" ? "Are you sure you want to restore" : "Are you sure you want to delete permanently"}{" "}<strong> {selectedPatient.first_name} {selectedPatient.last_name}     </strong> ?</p>
              <span>
                {modalAction === "restore" ? "This patient will be moved back to the active Patients list and will no longer appear in the Recycle Bin." : "This Patinet will be delted permanently"}
              </span>
            </div>
            <div className={HM.restoreModalActions}>
              <button type="button"     className={HM.cancelRestoreButton} onClick={() => { setShowRestoreModal(false), setSelectedPatient(null) }} >Cancel</button>
              <button type="button"    disabled={isDeleting}  className={HM.confirmRestoreButton}  onClick={handelModalAction}  >{isDeleting?(<><LoaderCircle size={17} className={HM.spinner}/>{modalAction === "restore" ? "Restoring..." : "Deleting..."}   </>):(<> {modalAction === "restore" ? "Restore Patient" : "Delete Patient Permanently"}  {modalAction === "restore" ? (<> <RotateCcw size={24} /></>) : (<> <Trash2 size={26} /></>)}</>)}</button>               
            </div>

          </div>
        </div>
      )}


    </div>
  );

}
export default RecycleBin;

