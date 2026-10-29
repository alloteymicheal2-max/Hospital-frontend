import {
  Search, Users, UserPlus, SlidersHorizontal, MoreHorizontal, LoaderCircle,
  Phone, Mail, ChevronDown, HeartPulse, CalendarDays, X, Eye, Pencil, Trash2
} from "lucide-react";

import HM from "./Patients.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNotification } from "../../NotificationContext";

const API = import.meta.env.VITE_HOSTING_API;

/* =====================================
   HELPERS (all null-safe)
===================================== */
const EMPTY_PATIENT = {
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
};

const EMPTY_STATS = {
  total_patients: 0,
  active_patients: 0,
  waiting_patients: 0,
  discharged_patients: 0,
  new_this_month: 0,
  todays_visits: 0
};

function getToken() {
  try {
    return localStorage.getItem("token") || "";
  } catch {
    return "";
  }
}

function authHeaders() {
  return { headers: { Authorization: `Bearer ${getToken()}` } };
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
}

function str(value) {
  return value === null || value === undefined ? "" : String(value);
}

function initials(patient) {
  const first = str(patient?.first_name).charAt(0).toUpperCase();
  const last = str(patient?.last_name).charAt(0).toUpperCase();
  return `${first}${last}` || "?";
}

function dateOnly(value) {
  if (!value) return "—";
  return str(value).split("T")[0] || "—";
}

function prettyDate(value) {
  if (!value) return "Not provided";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "Not provided" : d.toLocaleDateString();
}

function timeOf(value) {
  const t = new Date(value).getTime();
  return Number.isNaN(t) ? 0 : t;
}

/* Turns a patient from the API into something safe for controlled inputs */
function normalizeForForm(patient) {
  const safe = { ...EMPTY_PATIENT };
  Object.keys(patient || {}).forEach((key) => {
    safe[key] = patient[key] === null || patient[key] === undefined ? "" : patient[key];
  });
  safe.date_of_birth = dateOnly(patient?.date_of_birth) === "—" ? "" : dateOnly(patient?.date_of_birth);
  return safe;
}

/* =====================================
   ERROR BOUNDARY
   If anything inside the page still throws while
   rendering, show a message instead of a blank page.
===================================== */
class PatientsErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Patients page crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "60px 24px", textAlign: "center" }}>
          <h2>Something went wrong</h2>
          <p>The patients page ran into an unexpected problem.</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            style={{ marginTop: 16, padding: "10px 18px", cursor: "pointer" }}
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function Patients() {
  const notification = useNotification();
  const addNotification = notification?.addNotification;

  const [currentFilter, setCurrentFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [showsucess, setShowSucess] = useState(false);
  const [toastType, setToastType] = useState("success");
  const [successmessage, setSuccessmessage] = useState("");
  const [serverUnavailable, setServerUnavailable] = useState(false);
  const [checkingServer, setCheckingServer] = useState(false);
  const [sortType, setSortType] = useState("Newest");
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [openStatusId, setOpenStatusId] = useState(null);
  const [viewPatientModal, setViewPatientModal] = useState(null);
  const [deletePatientModal, setDeletePatientModal] = useState(null);
  const [editPatientModal, setEditPatientModal] = useState(null);

  const [isRegistering, setIsRegistering] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [patient, setPatient] = useState({ ...EMPTY_PATIENT });
  const [dashboardStats, setDashboardStats] = useState({ ...EMPTY_STATS });

  /* ---------- helpers ---------- */
  function showToast(message, type = "success", duration = 3000) {
    setSuccessmessage(message || "");
    setToastType(type);
    setShowSucess(true);
    setTimeout(() => setShowSucess(false), duration);
  }

  function handleAuthError(error) {
    if (error?.response?.status === 401) {
      try {
        localStorage.removeItem("token");
      } catch {
        /* ignore */
      }
      window.location.href = "/login";
      return true;
    }
    return false;
  }

  /* ---------- API calls ---------- */
  async function fetchPatient() {
    try {
      const response = await axios.get(`${API}/patient`, authHeaders());
      const result = response?.data;
      if (result?.success === true) {
        setPatients(Array.isArray(result.data) ? result.data : []);
        setServerUnavailable(false);
      } else {
        console.log("PATIENT API MESSAGE:", result?.message);
      }
    } catch (error) {
      console.log("PATIENT ERROR STATUS:", error?.response?.status);
      setServerUnavailable(error?.response ? false : true);
      handleAuthError(error);
    }
  }

  async function fetchDashboardStats() {
    try {
      const response = await axios.get(`${API}/dashboard`, authHeaders());
      const result = response?.data;
      if (result?.success === true && result.data) {
        setDashboardStats((prev) => ({ ...prev, ...result.data }));
      }
    } catch (error) {
      // Do not rethrow: stats failing must never break the page
      console.log("Unable to fetch dashboard statistics", error);
      handleAuthError(error);
    }
  }

  async function retryServer() {
    setCheckingServer(true);
    try {
      await fetchPatient();
      await fetchDashboardStats();
    } finally {
      setCheckingServer(false);
    }
  }

  useEffect(() => {
    fetchPatient();
    fetchDashboardStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleClickOutside() {
      setOpenStatusId(null);
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  /* ---------- form ---------- */
  const formPatient = editPatientModal ? editPatientModal : patient;

  function handleChange(e) {
    const { name, value } = e.target;
    if (editPatientModal) {
      setEditPatientModal((prev) => ({ ...(prev || {}), [name]: value }));
    } else {
      setPatient((prev) => ({ ...prev, [name]: value }));
    }
  }

  function closeFormModal() {
    setShowModal(false);
    setEditPatientModal(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsRegistering(true);
    try {
      const response = await axios.post(`${API}/patient`, patient, authHeaders());
      const result = response?.data;

      if (result?.success) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setSuccessmessage(result.message || "Patient registered");
        setToastType("success");
        setShowSucess(true);
        setPatient({ ...EMPTY_PATIENT });

        await fetchPatient();
        await fetchDashboardStats();

        // Notification is a bonus step: if it fails, the patient was still saved
        try {
          const user = getStoredUser();
          if (user?.id) {
            await axios.post(
              `${API}/notification`,
              {
                user_id: user.id,
                type: "patient",
                title: "New Patient",
                message: "A new patient has been added"
              },
              authHeaders()
            );
          }
          if (typeof addNotification === "function") {
            addNotification("patient", "New Patient", "A new Patient has been added ");
          }
        } catch (notifyError) {
          console.log("Notification failed:", notifyError);
        }

        setTimeout(() => {
          setShowSucess(false);
          setShowModal(false);
        }, 3000);
      } else {
        showToast(result?.message || "Failed to register patient", "error", 3000);
      }
    } catch (error) {
      console.log(error?.message);
      showToast(error?.response?.data?.message || "Failed to register patient", "error", 3000);
      handleAuthError(error);
    } finally {
      setIsRegistering(false);
    }
  }

  async function handleViewPatient(p) {
    if (!p?.id) return;
    try {
      const response = await axios.get(`${API}/patient/${p.id}`, authHeaders());
      const result = response?.data;
      if (result?.success && result.data) {
        setViewPatientModal(result.data);
      } else {
        // fall back to the row data we already have
        setViewPatientModal(p);
      }
    } catch (error) {
      console.log("Failed to fetch patient:", error);
      handleAuthError(error);
    }
  }

  function handleEditPatient(p) {
    if (!p) return;
    setEditPatientModal(normalizeForForm(p));
    setShowModal(false);
  }

  async function handleUpadtePatient(e) {
    e.preventDefault();
    if (!editPatientModal?.id) return;
    setIsUpdating(true);
    try {
      const response = await axios.put(
        `${API}/patient/${editPatientModal.id}`,
        editPatientModal,
        authHeaders()
      );
      const result = response?.data;
      if (result?.success) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setSuccessmessage(result.message || "Patient updated");
        setToastType("success");
        setShowSucess(true);
        await fetchPatient();
        await fetchDashboardStats();

        setTimeout(() => {
          setShowSucess(false);
          setEditPatientModal(null);
        }, 1500);
      } else {
        showToast(result?.message || "Failed to update patient", "error", 3000);
      }
    } catch (error) {
      console.log("Failed to update patient:", error);
      showToast(error?.response?.data?.message || "Failed to update patient", "error", 3000);
      handleAuthError(error);
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDeletePatient(id) {
    if (!id) return;
    setIsDeleting(true);
    try {
      const response = await axios.delete(`${API}/patient/${id}`, authHeaders());
      const result = response?.data;

      if (result?.success) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setDeletePatientModal(null);
        showToast(result.message || "Patient deleted", "success", 1500);
        await fetchPatient();
        await fetchDashboardStats();
      } else {
        showToast(result?.message || "Failed to delete patient", "error", 3000);
      }
    } catch (error) {
      console.log("failed to delete patient:", error);
      showToast(error?.response?.data?.message || "Failed to delete patient", "error", 3000);
      handleAuthError(error);
    } finally {
      setIsDeleting(false);
    }
  }

  async function changeStatus(id, newstatus) {
    try {
      const selectedPatient = patients.find((p) => p?.id === id);
      if (!selectedPatient) return;

      const updatedPatient = { ...selectedPatient, status: newstatus };
      const response = await axios.put(`${API}/patient/${id}`, updatedPatient, authHeaders());
      const result = response?.data;

      if (result?.success) {
        // If the server does not send the patient back, fall back to our local copy
        const savedPatient = result.data && result.data.id ? result.data : updatedPatient;
        setPatients((prev) => prev.map((p) => (p?.id === id ? savedPatient : p)));
        setOpenStatusId(null);
        fetchDashboardStats();
      }
    } catch (error) {
      console.log("Failed to update patient status:", error?.response?.data || error?.message);
      handleAuthError(error);
    }
  }

  /* ---------- filter / sort ---------- */
  const safePatients = Array.isArray(patients) ? patients.filter(Boolean) : [];

  const filteredPatients = safePatients.filter((p) => {
    const term = search.trim().toLowerCase();
    const searchMatch =
      str(p.first_name).toLowerCase().includes(term) ||
      str(p.last_name).toLowerCase().includes(term);

    if (!searchMatch) return false;
    if (currentFilter === "All") return true;

    // A patient with no status is treated as Active (same as the table display)
    const status = p.status || "Active";
    return status === currentFilter;
  });

  function filter() {
    if (currentFilter === "All") setCurrentFilter("Active");
    else if (currentFilter === "Active") setCurrentFilter("Waiting");
    else if (currentFilter === "Waiting") setCurrentFilter("Discharged");
    else setCurrentFilter("All");
  }

  function sortPatients() {
    setSortType((prev) => (prev === "Newest" ? "Oldest" : "Newest"));
  }

  const sortedPatients = [...filteredPatients].sort((a, b) =>
    sortType === "Newest"
      ? timeOf(b.created_at) - timeOf(a.created_at)
      : timeOf(a.created_at) - timeOf(b.created_at)
  );

  const totalRecords = dashboardStats?.total_patients ?? safePatients.length;

  /* =====================================
     RENDER
  ===================================== */
  return (
    <div className={HM.page}>
      <div>
        <br className={HM.br1}></br>
        <br className={HM.br2}></br>
        <br className={HM.br3}></br>
        <br className={HM.br4}></br>
      </div>

      {/* PAGE HEADER */}
      <section className={HM.pageHeader}>
        <div>
          <div className={HM.eyebrow}>
            <Users size={13} />
            us Patient management
          </div>
          <h1>Patients</h1>
          <p>Manage patient information, records and appointments.</p>
        </div>
        <button
          className={HM.primaryButton}
          onClick={() => {
            setEditPatientModal(null);
            setShowModal(true);
          }}
          disabled={serverUnavailable}
          title={
            serverUnavailable
              ? "Server unavailable. Patient registration is temporarily unavailable."
              : "Add a new Patient"
          }
        >
          <UserPlus size={16} /> {serverUnavailable ? "Server  error " : "Add new patient"}
        </button>
      </section>

      {/* SUMMARY CARDS */}
      <section className={HM.summaryGrid}>
        <div className={HM.summaryCard}>
          <div className={HM.summaryIcon}>
            <Users size={18} />
          </div>
          <div>
            <span>Total patients</span>
            <strong>{safePatients.length}</strong>
            <small>Registered patients</small>
          </div>
        </div>
        <div className={HM.summaryCard}>
          <div className={HM.summaryIcon}>
            <HeartPulse size={18} />
          </div>
          <div>
            <span>Active patients</span>
            <strong>{dashboardStats?.active_patients ?? 0}</strong>
            <small>Currently receiving care</small>
          </div>
        </div>
        <div className={HM.summaryCard}>
          <div className={HM.summaryIcon}>
            <CalendarDays size={18} />
          </div>
          <div>
            <span>Today's visits</span>
            <strong>{dashboardStats?.todays_visits ?? 0}</strong>
            <small>Scheduled appointments</small>
          </div>
        </div>
        <div className={HM.summaryCard}>
          <div className={HM.summaryIcon}>
            <UserPlus size={18} />
          </div>
          <div>
            <span>New this month</span>
            <strong>{dashboardStats?.new_this_month ?? 0}</strong>
            <small>Newly registered</small>
          </div>
        </div>
      </section>

      {/* PATIENT TABLE */}
      <section className={HM.patientCard}>
        <div className={HM.toolbar}>
          <div>
            <h2>All patients</h2>
            <span>{totalRecords} patient records</span>
          </div>
          <div className={HM.toolbarActions}>
            <div className={HM.searchBox}>
              <Search size={15} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patients..."
              />
            </div>
            <button onClick={filter} className={HM.filterButton}>
              <SlidersHorizontal size={15} /> {currentFilter === "All" ? "Filters" : currentFilter}
            </button>
            <button className={HM.sortButton} onClick={sortPatients}>
              {sortType}
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        <div className={HM.tableWrapper}>
          {serverUnavailable ? (
            <div className={HM.tableServerError}>
              <div className={HM.serverErrorCard}>
                <div className={HM.serverErrorIcon}>
                  <HeartPulse size={30} />
                </div>
                <span className={HM.serverErrorLabel}>CONNECTION ERROR</span>
                <h2>Server unavailable</h2>
                <p> We couldn't load the patient records.Please try again.</p>
                <button
                  className={HM.retryServerButton}
                  onClick={retryServer}
                  disabled={checkingServer}
                >
                  {checkingServer ? (
                    <>
                      <LoaderCircle size={16} className={HM.retrySpinner} /> Checking...
                    </>
                  ) : (
                    "Try again"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <>
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
                  sortedPatients.map((p, index) => (
                    <div className={HM.patientRow} key={p.id ?? `row-${index}`}>
                      <div className={HM.patientInfo}>
                        <div className={HM.avatar}>{initials(p)}</div>
                        <div>
                          <strong>
                            {str(p.first_name)} {str(p.last_name)}
                          </strong>
                          <span></span>
                        </div>
                      </div>

                      <span className={HM.patientId}>#PT-{str(p.id)}</span>

                      <div className={HM.contact}>
                        <span>
                          <Phone size={11} />
                          {p.phone || "no phone"}
                        </span>
                        <span>
                          <Mail size={11} />
                          {p.email || "no email"}
                        </span>
                      </div>

                      <span>{p.gender || "—"}</span>

                      <span>{dateOnly(p.date_of_birth)}</span>

                      <span
                        className={`${HM.status} ${
                          p.status === "Waiting"
                            ? HM.waiting
                            : p.status === "Discharged"
                            ? HM.discharged
                            : HM.active
                        }`}
                      >
                        {p.status || "Active"}
                      </span>

                      <span className={HM.newicons}>
                        <Pencil size={17} onClick={() => handleEditPatient(p)} />
                        <Eye size={17} onClick={() => handleViewPatient(p)} />
                        <Trash2 size={17} onClick={() => setDeletePatientModal(p)} />
                      </span>

                      <button
                        className={HM.moreButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenStatusId(openStatusId === p.id ? null : p.id);
                        }}
                      >
                        <MoreHorizontal size={17} />
                      </button>

                      {openStatusId === p.id && (
                        <div className={HM.statusMenu} onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => changeStatus(p.id, "Active")}>Active </button>
                          <button onClick={() => changeStatus(p.id, "Waiting")}> Waiting </button>
                          <button onClick={() => changeStatus(p.id, "Discharged")}>
                            Discharged
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
                      {search
                        ? `We couldn't find any patient matching "${search}".`
                        : "There are no patients to show yet."}
                    </p>
                    {search && (
                      <button type="button" onClick={() => setSearch("")}>
                        Clear Search
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* DELETE MODAL */}
      {deletePatientModal && (
        <div className={HM.deleteOverlay}>
          <div className={HM.deleteModal}>
            <div className={HM.deleteIcon}>
              <Trash2 size={26} />
            </div>
            <h2>Delete Patient?</h2>
            <p>
              Are you sure you want to delete{" "}
              <strong>
                {str(deletePatientModal.first_name)} {str(deletePatientModal.last_name)}
              </strong>
              ?
            </p>
            <span className={HM.deleteWarning}>This action cannot be undone. </span>
            <div className={HM.deleteActions}>
              <button
                type="button"
                className={HM.cancelDelete}
                onClick={() => setDeletePatientModal(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                className={HM.confirmDelete}
                onClick={() => handleDeletePatient(deletePatientModal.id)}
              >
                <Trash2 size={16} />
                {isDeleting ? (
                  <>
                    <LoaderCircle size={17} className={HM.spinner} />
                    Deleting...
                  </>
                ) : (
                  <>Delete Patient</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PATIENT MODAL */}
      {(showModal || editPatientModal) && (
        <div className={HM.modalOverlay}>
          <div className={HM.modal}>
            <div className={HM.modalHeader}>
              <div>
                <span className={HM.modalLabel}>
                  {editPatientModal ? "EDIT PATIENT" : "NEW PATIENT"}
                </span>
                <h2>{editPatientModal ? "Edit patient information" : "Register a new patient"}</h2>
                <p>
                  {editPatientModal
                    ? "Update the patient's personal and medical information below."
                    : "Enter the patient's personal and contact information below."}
                </p>
              </div>
              <button className={HM.closeButton} onClick={closeFormModal}>
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={editPatientModal ? handleUpadtePatient : handleSubmit}
              className={HM.patientForm}
            >
              {showsucess && (
                <div
                  className={[HM.successToast, toastType === "error" && HM.errorToast]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <div className={HM.successIcon}>{toastType === "error" ? "!" : "✓"}</div>
                  <div className={HM.successContent}>
                    <strong>{successmessage}</strong>
                    <span>
                      {toastType === "error"
                        ? " Something went wrong. Please try again."
                        : " The operation was completed successfully."}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSucess(false)}
                    className={HM.toastClose}
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {/* Personal Information */}
              <div className={HM.formSection}>
                <div className={HM.sectionTitle}>
                  <span className={HM.sectionNumber}>01</span>
                  <div>
                    <h3>Personal information </h3>
                    <p> Basic information about the patient. </p>
                  </div>
                </div>
                <div className={HM.formGrid}>
                  <div className={HM.inputGroup}>
                    <label> First name </label>
                    <input
                      required
                      name="first_name"
                      type="text"
                      placeholder="Enter first name"
                      value={str(formPatient.first_name)}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={HM.inputGroup}>
                    <label> Last name </label>
                    <input
                      required
                      name="last_name"
                      type="text"
                      placeholder="Enter last name"
                      value={str(formPatient.last_name)}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={HM.inputGroup}>
                    <label>Date of birth</label>
                    <input
                      required
                      name="date_of_birth"
                      type="date"
                      value={str(formPatient.date_of_birth)}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={HM.inputGroup}>
                    <label>Gender</label>
                    <select
                      name="gender"
                      required
                      value={str(formPatient.gender)}
                      onChange={handleChange}
                    >
                      <option value=""> Select gender </option>
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
                    <input
                      name="phone"
                      onChange={handleChange}
                      value={str(formPatient.phone)}
                      type="tel"
                      placeholder="+233 XX XXX XXXX"
                    />
                  </div>
                  <div className={HM.inputGroup}>
                    <label> Email address </label>
                    <input
                      name="email"
                      required
                      type="email"
                      placeholder="patient@email.com"
                      onChange={handleChange}
                      value={str(formPatient.email)}
                    />
                  </div>
                  <div className={`${HM.inputGroup} ${HM.fullWidth}`}>
                    <label>Residential address</label>
                    <input
                      name="residential_address"
                      onChange={handleChange}
                      value={str(formPatient.residential_address)}
                      type="text"
                      placeholder="Enter residential address"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className={HM.formSection}>
                <div className={HM.sectionTitle}>
                  <span className={HM.sectionNumber}> 03</span>
                  <div>
                    <h3>Emergency contact </h3>
                    <p>Person to contact in case of an emergency.</p>
                  </div>
                </div>
                <div className={HM.formGrid}>
                  <div className={HM.inputGroup}>
                    <label> Contact name </label>
                    <input
                      required
                      type="text"
                      name="emergency_contact_name"
                      placeholder="Full name"
                      onChange={handleChange}
                      value={str(formPatient.emergency_contact_name)}
                    />
                  </div>
                  <div className={HM.inputGroup}>
                    <label> Relationship </label>
                    <select
                      required
                      name="emergency_relationship"
                      onChange={handleChange}
                      value={str(formPatient.emergency_relationship)}
                    >
                      <option value=""> Select relationship</option>
                      <option>Parent</option>
                      <option>Spouse </option>
                      <option>Sibling</option>
                      <option> Friend</option>
                      <option> Other</option>
                    </select>
                  </div>
                  <div className={HM.inputGroup}>
                    <label>Contact phone </label>
                    <input
                      name="emergency_contact_phone"
                      onChange={handleChange}
                      value={str(formPatient.emergency_contact_phone)}
                      type="tel"
                      placeholder="+233 XX XXX XXXX"
                    />
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className={HM.formSection}>
                <div className={HM.sectionTitle}>
                  <span className={HM.sectionNumber}>04</span>
                  <div>
                    <h3> Medical information</h3>
                    <p>Initial health information for the patient. </p>
                  </div>
                </div>
                <div className={HM.formGrid}>
                  <div className={HM.inputGroup}>
                    <label>Blood group</label>
                    <select
                      name="blood_group"
                      onChange={handleChange}
                      value={str(formPatient.blood_group)}
                    >
                      <option value="">Select blood group</option>
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
                    <label> Patient type</label>
                    <select
                      name="patient_type"
                      onChange={handleChange}
                      value={str(formPatient.patient_type)}
                    >
                      <option value="">Select patient type</option>
                      <option> Outpatient</option>
                      <option> Inpatient</option>
                      <option> Emergency</option>
                    </select>
                  </div>
                  <div className={`${HM.inputGroup} ${HM.fullWidth}`}>
                    <label>Medical history</label>
                    <textarea
                      rows="4"
                      name="medical_history"
                      onChange={handleChange}
                      value={str(formPatient.medical_history)}
                      placeholder="Enter relevant medical history, allergies or existing conditions..."
                    />
                  </div>
                </div>
              </div>

              {/* Form Footer */}
              <div className={HM.formFooter}>
                <p> Patient information should be kept confidential.</p>
                <div className={HM.frmButtons}>
                  <button type="button" onClick={closeFormModal} className={HM.cancelButton}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={HM.registerButton}
                    disabled={isRegistering || isUpdating}
                  >
                    {isRegistering || isUpdating ? (
                      <>
                        <LoaderCircle size={17} className={HM.spinner} />
                        {editPatientModal ? "Saving changes..." : "Registering..."}
                      </>
                    ) : (
                      <>
                        <UserPlus size={15} />
                        {editPatientModal ? "Save changes" : "Register Patient"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW PATIENT MODAL */}
      {viewPatientModal && (
        <div className={HM.modalOverlay}>
          <div className={HM.viewPatientModal}>
            <div className={HM.viewModalHeader}>
              <div>
                <span className={HM.viewModalLabel}> PATIENT PROFILE</span>
                <h2> Patient Details</h2>
                <p> View complete information about this patient </p>
              </div>
              <button
                type="button"
                className={HM.viewCloseButton}
                onClick={() => setViewPatientModal(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className={HM.patientProfileHeader}>
              <div className={HM.patientAvatar}>{initials(viewPatientModal)}</div>
              <div className={HM.patientIdentity}>
                <h3>
                  {str(viewPatientModal.first_name)} {str(viewPatientModal.last_name)}
                </h3>
                <p>
                  Patient ID:{" "}
                  <strong>#PT-{String(viewPatientModal.id ?? "").padStart(4, "0")}</strong>
                </p>
              </div>
              <div className={HM.patientStatus}>
                <span className={HM.statusDot}></span>
                {viewPatientModal.status || "Active"}
              </div>
            </div>

            <div className={HM.patientQuickInfo}>
              <div className={HM.quickInfoItem}>
                <span>Gender</span>
                <strong>{viewPatientModal.gender || "Not provided"}</strong>
              </div>
              <div className={HM.quickInfoItem}>
                <span>Blood Group</span>
                <strong>{viewPatientModal.blood_group || "Not provided"}</strong>
              </div>
              <div className={HM.quickInfoItem}>
                <span>Patient Type</span>
                <strong>{viewPatientModal.patient_type || "Not provided"}</strong>
              </div>
              <div className={HM.quickInfoItem}>
                <span>Phone</span>
                <strong>{viewPatientModal.phone || "Not provided"}</strong>
              </div>
            </div>

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
                    {str(viewPatientModal.first_name)} {str(viewPatientModal.last_name)}
                  </strong>
                </div>
                <div className={HM.detailItem}>
                  <span>Date of Birth</span>
                  <strong>{prettyDate(viewPatientModal.date_of_birth)}</strong>
                </div>
                <div className={HM.detailItem}>
                  <span>Gender</span>
                  <strong>{viewPatientModal.gender || "Not provided"}</strong>
                </div>
                <div className={HM.detailItem}>
                  <span>Phone Number</span>
                  <strong>{viewPatientModal.phone || "Not provided"}</strong>
                </div>
                <div className={HM.detailItem}>
                  <span>Email Address</span>
                  <strong>{viewPatientModal.email || "Not provided"}</strong>
                </div>
                <div className={HM.detailItem}>
                  <span>Residential Address</span>
                  <strong>{viewPatientModal.residential_address || "Not provided"}</strong>
                </div>
              </div>
            </div>

            <div className={HM.viewModalFooter}>
              <button
                type="button"
                className={HM.viewModalClose}
                onClick={() => setViewPatientModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Wrapped so a render crash shows a message instead of a blank page */
export default function PatientsPage() {
  return (
    <PatientsErrorBoundary>
      <Patients />
    </PatientsErrorBoundary>
  );
}
