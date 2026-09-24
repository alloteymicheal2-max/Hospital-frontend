
import React, { useEffect, useState } from "react";
import { Settings as SettingsIcon, Building2, UserRound, Bell, LockKeyhole, CheckCircle2, Palette, Save, EyeOff, Eye, AlertTriangle, LoaderCircle } from "lucide-react";
import HM from "./Settings.module.css";
import axios from "axios";

const API = import.meta.env.VITE_HOSTING_API
function Settings() {
  const [showsucess, setShowSucess] = useState(false)
  const [successmessage, setSuccessmessage] = useState("")
  const [serverUnavailable, setServerUnavailable] = useState(false)
  const [checkingServer, setCheckingServer] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [messageType, setMessageType] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isActive,setIsActive]=useState(false)
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });

  const [settings, setSettings] = useState({
    id:null,
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




  async function retryServer() {
    setCheckingServer(true)
    try {
      const token = localStorage.getItem("token");
      await axios.get(`${API}/settings`, { headers: { Authorization: `Bearer ${token}` } });
      setServerUnavailable(false);
    } catch (error) {
      setServerUnavailable(
        error.response ? false : true
      );
    } finally {
      setCheckingServer(false)
    }
  }
  function handlePasswordChange(e) {
    const { name, value } = e.target

    setPasswordData({ ...passwordData, [name]: value })
  }
  function handlechange(e) {
    const { name, value, type, checked } = e.target
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value
    })
  }

  async function handleSaveChanges(e) {
    e.preventDefault()
   console.log("========== SAVING SETTINGS ==========");
    console.log("SETTINGS OBJECT:", settings);
    console.log("SETTINGS ID:", settings.id);
    console.log("PUT URL:", `${API}/settings/${settings.id}`);

   setIsSaving(true)
    try {

  console.log("EMAIL:", settings.email_notification);
  console.log("APPOINTMENT:", settings.appointment_reminders);
  console.log("PATIENT ALERTS:", settings.patients_alerts);


  console.log("🔥 DATA BEING SENT TO BACKEND:", {
    email_notification: settings.email_notification,
    appointment_reminders: settings.appointment_reminders,
    patients_alerts: settings.patients_alerts
});

      const response = await axios.put(`${API}/settings/${settings.id}`, settings)
      console.log("🔥 BACKEND SAVED DATA:", {
    email_notification: response.data.data.email_notification,
    appointment_reminders: response.data.data.appointment_reminders,
    patients_alerts: response.data.data.patients_alerts
});
      // console.log("BACKEND RESPONSEEEE:", response.data)
      const result = response.data

      if (result.success === true) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        setMessageType("success")
        setShowSucess(true)
        setSuccessmessage(result.message)
        setSettings(result.data)

        setTimeout(() => {
          setShowSucess(false)
        }, 2500)
      }
    } catch (error) {
      console.log("Unable to save changes", error)
      setMessageType("error")
      setShowSucess(true)
      setSuccessmessage(error.response?.data?.message)
      setTimeout(() => {
        setShowSucess(false);
      }, 2500);

    }finally{
      setIsSaving(false)
    }
  }


  async function fetchSettings() {
    try {
             
    const settingsURL = `${API}/settings`;

        console.log("================================");
        console.log("SETTINGS API URL:", settingsURL);


      const response = await axios.get(`${API}/settings`)

       console.log("SETTINGS FULL RESPONSE:", response);
        console.log("SETTINGS RESPONSE DATA:", response.data);
        console.log("SETTINGS DATA ARRAY:", response.data.data);

      const result = response.data

   console.log("SETTINGS FROM BACKEND:", result.data);

      if (result.success === true && result.data.length > 0) {

  console.log("🔥 SETTING RECORD RECEIVED:", result.data[0]);
    console.log("🔥 SETTING ID RECEIVED:", result.data[0].id);

        setSettings(result.data[0])
        setServerUnavailable(false)
      }
    } catch (error) {
      console.log("Unable to fetch settings", error)
      if (!serverUnavailable) {
        setServerUnavailable(true)
      }
    }
  }

  async function handleChangePassword() {
    setIsActive(true)
    try {
      const token = localStorage.getItem("token");
      console.log("TOKEN:", token);
      console.log("PASSWORD DATA:", passwordData);
      const response = await axios.put(`${API}/user/reset`, passwordData, { headers: { Authorization: `Bearer ${token}` } });
      console.log("RESET RESPONSE:", response.data)
      const result = response.data;
      if (result.success === true) {
        await new Promise(resolve=>setTimeout(resolve,2000))
        setShowPasswordModal(false);
        setPasswordData({
          current_password: "",
          new_password: "",
          confirm_password: ""
        });
        setMessageType("success")
        setShowSucess(true);
        setSuccessmessage(result.message);

        setTimeout(() => {
          setShowSucess(false);
        }, 2500);
      }

    } catch (error) {
      console.log("Uable to change password error", error)
      const message = error.response?.data?.message || "Unable to change password";
      setShowSucess(true);
      setSuccessmessage(message);


      setTimeout(() => {
        setShowSucess(false);
      }, 3000);
    }
    finally{
      setIsActive(false)
    }
  }



  useEffect(() => {
    fetchSettings()
  }, [])

  return (

    <div className={HM.page}>
      {showsucess && (
        <div className={HM.successCard}>
          <div className={HM.successIcon}>
            <CheckCircle2 size={20} />
          </div>
          <div className={HM.successContent}>
            <strong>Settings Updated Successfully</strong>
            <p>
              {messageType === "success" ? "Setting Updated succesfully" : "Unable to update settings "}
            </p>
          </div>
          <button className={HM.successClose} onClick={() => setShowSucess(false)} >   ×</button>
        </div>
      )}
      <div>
        <br className={HM.br1}></br>
        <br className={HM.br2}></br>
        <br className={HM.br3}></br>
        <br className={HM.br4}></br>
      </div>

      {/* PAGE HEADER */}

      <div className={HM.pageHeader}>

        <div className={HM.headerIcon}>
          <SettingsIcon size={18} />
        </div>
        <div>
          <h1>
            Settings
          </h1>
          <p>
            Manage your hospital information and account preferences.
          </p>
        </div>
      </div>
      {serverUnavailable ? (
        <div className={HM.settingsServerError}>
          <div className={HM.serverErrorCard}>
            <div className={HM.serverErrorIcon}>
              <AlertTriangle size={30} />
            </div>
            <span className={HM.serverErrorLabel}>
              CONNECTION ERROR
            </span>
            <h2>
              Server unavailable
            </h2>
            <p>
              We couldn't load your hospital settings.
              Please try again.
            </p>
            <button type="button" className={HM.retryServerButton} onClick={retryServer} disabled={checkingServer} >{checkingServer ? (<> <LoaderCircle size={16} className={HM.retrySpinner} />Checking...</>) : ("Try again")} </button>
          </div>
        </div>

      ) : (
        <>

          <section className={HM.section}>
            <div className={HM.sectionHeader}>
              <div className={HM.sectionIcon}>
                <Building2 size={16} />
              </div>
              <div>
                <h2>
                  Hospital information
                </h2>
                <p>
                  Basic information about your hospital.
                </p>
              </div>
            </div>
            <div className={HM.formGrid}>
              <div className={HM.formGroup}>
                <label>
                  Hospital name
                </label>
                <input type="text" placeholder="Enter hospital name" name="hospital_name" onChange={handlechange} value={settings.hospital_name} />
              </div>
              <div className={HM.formGroup}>
                <label>
                  Hospital email
                </label>
                <input type="email" placeholder="hospital@example.com" name="hospital_email" onChange={handlechange} value={settings.hospital_email} />
              </div>
              <div className={HM.formGroup}>
                <label>
                  Phone number
                </label>
                <input type="tel" placeholder="+233 XX XXX XXXX" name="hospital_phone" value={settings.hospital_phone} onChange={handlechange} />
              </div>
              <div className={HM.formGroup}>
                <label>
                  Hospital address
                </label>
                <input type="text" placeholder="Enter hospital address" name="hospital_address" value={settings.hospital_address} onChange={handlechange} />
              </div>
            </div>
          </section>
          {/* ADMIN PROFILE */}
          <section className={HM.section}>
            <div className={HM.sectionHeader}>
              <div className={HM.sectionIcon}>
                <UserRound size={16} />
              </div>
              <div>
                <h2>
                  Administrator profile
                </h2>
                <p>
                  Information about the hospital administrator.
                </p>
              </div>
            </div>
            <div className={HM.formGrid}>
              <div className={HM.formGroup}>
                <label>
                  Full name
                </label>
                <input type="text" placeholder="Enter full name" name="admin_name" onChange={handlechange} value={settings.admin_name} />
              </div>
              <div className={HM.formGroup}>
                <label>
                  Email address
                </label>
                <input type="email" placeholder="admin@example.com" name="admin_email" onChange={handlechange} value={settings.admin_email} />
              </div>
              <div className={HM.formGroup}>
                <label>
                  Phone number
                </label>
                <input type="tel" placeholder="+233 XX XXX XXXX" onChange={handlechange} value={settings.admin_phone} name="admin_phone" />
              </div>
              <div className={HM.formGroup}>
                <label>       Role
                </label>
                <input type="text" name="admin_role" onChange={handlechange} placeholder="Enter administrator role" value={settings.admin_role} />

              </div>

            </div>

          </section>



          {/* NOTIFICATIONS */}

          <section className={HM.section}>
            <div className={HM.sectionHeader}>
              <div className={HM.sectionIcon}>
                <Bell size={16} />
              </div>
              <div>
                <h2>
                  Notifications
                </h2>
                <p>
                  Choose how you receive hospital notifications.
                </p>
              </div>
            </div>
            <div className={HM.settingsList}>
              <div className={HM.settingRow}>
                <div>
                  <strong>
                    Email notifications
                  </strong>
                  <span>
                    Receive important hospital updates by email.
                  </span>
                </div>
                <label className={HM.switch}>
                  <input type="checkbox" checked={settings.email_notification} name="email_notification" onChange={handlechange} />
                  <span></span>
                </label>
              </div>
              <div className={HM.settingRow}>
                <div>
                  <strong>
                    Appointment reminders
                  </strong>
                  <span>
                    Get reminders about upcoming appointments.
                  </span>
                </div>
                <label className={HM.switch}>
                  <input type="checkbox" name="appointment_reminders" checked={settings.appointment_reminders} onChange={handlechange} />
                  <span></span>
                </label>
              </div>
              <div className={HM.settingRow}>
                <div>
                  <strong>
                    Patient alerts
                  </strong>
                  <span>
                    Receive important patient-related alerts.
                  </span>
                </div>
                <label className={HM.switch}>
                  <input type="checkbox" name="patients_alerts" onChange={handlechange} checked={settings.patients_alerts} />
                  <span></span>
                </label>
              </div>
            </div>
          </section>
          {/* SECURITY */}
          <section className={HM.section}>
            <div className={HM.sectionHeader}>
              <div className={HM.sectionIcon}>
                <LockKeyhole size={16} />
              </div>
              <div>
                <h2>
                  Security
                </h2>
                <p>
                  Manage your administrator account security.
                </p>
              </div>
            </div>
            <div className={HM.securityBox}>
              <div>
                <strong>
                  Password
                </strong>
                <span>
                  Change your administrator account password.
                </span>
              </div>
              <button onClick={() => setShowPasswordModal(true)} className={HM.secondaryButton}>Change password</button>

            </div>

          </section>



          {/* APPEARANCE */}
          <section className={HM.section}>
            <div className={HM.sectionHeader}>
              <div className={HM.sectionIcon}>
                <Palette size={16} />
              </div>
              <div>
                <h2>
                  Appearance
                </h2>
                <p>
                  Choose the appearance of your hospital system.
                </p>
              </div>
            </div>

            <div className={HM.appearanceOptions}>
              <label className={HM.themeOption}>
                <input type="radio" name="theme" />
                <div className={HM.themePreview}>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <span>  Light</span>
              </label>
              <label className={HM.themeOption}>
                <input type="radio" name="theme" />
                <div className={HM.darkPreview}>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <span>
                  Dark
                </span>
              </label>
            </div>
          </section>
        </>
      )}
      <div className={HM.saveArea}>
        <button onClick={handleSaveChanges} disabled={serverUnavailable} title={serverUnavailable ? "Server unavailable." : "Permanently delete all items"} className={HM.saveButton}>    <Save size={15} />{isSaving ? (<><LoaderCircle size={17} className={HM.spinner} />Saving...</>) : (<>{serverUnavailable ? "server error" : "Save Changes"}</>)}</button>
      </div>
      {showPasswordModal && (
        <div className={HM.passwordModalOverlay}>
          <div className={HM.passwordModal}>
            <div className={HM.passwordModalHeader}>
              <div>
                <h2>Change password</h2>
                <p>
                  Update your administrator account password.
                </p>
              </div>
              <button type="button" onClick={() => setShowPasswordModal(false)} className={HM.closePasswordModal} > ×</button>
            </div>
            <div className={HM.passwordForm}>
              <div className={HM.formGroup}>
                <label>Current password</label>
                <div className={HM.passwordInputWrapper}>
                  <input type={showCurrentPassword ? "text" : "password"} name="current_password" value={passwordData.current_password} onChange={handlePasswordChange} placeholder="Enter your current password" />
                  <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className={HM.passwordToggle}>{showCurrentPassword ? (<EyeOff size={18} />) : (<Eye size={18} />)}</button>
                </div>
              </div>
              {/* NEW PASSWORD */}
              <div className={HM.formGroup}>
                <label>New password</label>
                <div className={HM.passwordInputWrapper}>
                  <input type={showNewPassword ? "text" : "password"} name="new_password" value={passwordData.new_password} onChange={handlePasswordChange} placeholder="Enter your new password" />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className={HM.passwordToggle} > {showNewPassword ? (<EyeOff size={18} />) : (<Eye size={18} />)}</button>
                </div>
              </div>
              {/* CONFIRM PASSWORD */}
              <div className={HM.formGroup}>
                <label>Confirm new password</label>
                <div className={HM.passwordInputWrapper}>
                  <input type={showConfirmPassword ? "text" : "password"} name="confirm_password" value={passwordData.confirm_password} onChange={handlePasswordChange} placeholder="Confirm your new password" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={HM.passwordToggle}> {showConfirmPassword ? (<EyeOff size={18} />) : (<Eye size={18} />)} </button>
                </div>
              </div>
              <div className={HM.passwordModalActions}>
                <button type="button" onClick={() => setShowPasswordModal(false)} className={HM.cancelPasswordButton} > Cancel</button>
                <button type="button" onClick={handleChangePassword} disabled={isActive}  className={HM.changePasswordButton} >{isActive?(<><LoaderCircle  size={17}  className={HM.spinner} />Saving...</>):(<>change Password</>)}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default Settings;

