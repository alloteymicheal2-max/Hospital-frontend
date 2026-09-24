import React from "react";
import { HeartPulse, ShieldCheck, Activity, Users, LockKeyhole, Mail, Eye, ArrowRight, CheckCircle2, Headphones, FastForward, Flashlight, EyeOff, } from "lucide-react";

import axios from "axios"
import HM from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const API = import.meta.env.VITE_HOSTING_API



function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showpassword, setShowPassword] = useState(false)
  const [showsucess, setShowSucess] = useState(false)
  const [sucessmessage, setSucessmessage] = useState("")
  const [messageType, setMessagetype] = useState("")
  const [active, setActive] = useState(false)

  async function Handlesubmit(e) {
    e.preventDefault();
    setActive(true)
    try {
      const response = await axios.post(`${API}/user/login`, { email, password })
      const result = response.data
      if (result.success === true) {

        localStorage.setItem("token", result.token);
        console.log("LOGGED IN USER:", result.user);
        localStorage.setItem("user", JSON.stringify(result.user));

        setMessagetype("success")
        setShowSucess(true)
        setActive(false)
        setSucessmessage(result.message)
        setTimeout(() => {
          navigate("/hospital/dashboard")
        }, 1500);

      }

    } catch (error) {
      console.log(error.response?.data?.message);

      setMessagetype("error")
      setShowSucess(true)
      setSucessmessage("Server error unable to connect")
      setActive(false)

      setTimeout(() => {
        setShowSucess(false)
      }, 3000)
    }
  }


  return (
    <div className={HM.page}>
      {showsucess && (
        <div className={HM.messageOverlay} >
          <div className={HM.messageCard}>
            <div className={messageType === "success" ? HM.successline : HM.errorline} >
              {messageType === "success" ? (<><CheckCircle2 size={32} strokeWidth={2.2} /></>) : (<><span>✕</span></>)}
            </div>
            <div className={HM.popupBrand}> <HeartPulse size={16} /><span>MedFlow</span></div>
            <h2>{messageType === "success" ? "Login Sucessful" : "Login Failed"}</h2>
            <p>{sucessmessage}</p>
            <div className={messageType === "success" ? HM.successStatus : HM.errorStatus}  ><span></span>
              {messageType === "success" ? "Secure authentication completed" : "Please check your credentials and try again"}
            </div>
            {/* Progress bar */}
            <div className={HM.progressContainer}>
              <div className={messageType === "success" ? HM.successProgress : HM.errorProgress} ></div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================
          LEFT — HOSPITAL INFORMATION
      ===================================== */}
      <section className={HM.welcomeSection}>

        {/* Background image */}
        <div className={HM.backgroundImage}></div>

        {/* Dark/green overlay */}
        <div className={HM.imageOverlay}></div>

        {/* Decorative glass circles */}
        <div className={HM.glassCircleOne}></div>
        <div className={HM.glassCircleTwo}></div>


        <div className={HM.welcomeContent}>

          {/* Logo */}
          <div className={HM.brand}>

            <div className={HM.logoIcon}>
              <HeartPulse size={24} strokeWidth={2.4} />
            </div>

            <div>
              <h2>MedFlow</h2>
              <span>Hospital Management</span>
            </div>

          </div>


          {/* Main welcome text */}
          <div className={HM.welcomeText}>

            <div className={HM.welcomeBadge}>
              <Activity size={13} />
              Smart healthcare management
            </div>

            <h1>
              Healthcare management,
              <span> made beautifully simple.</span>
            </h1>

            <p>
              Manage patients, medical records, reports and
              hospital operations from one secure and
              connected platform.
            </p>

          </div>


          {/* Features */}
          <div className={HM.welcomeFeatures}>

            <div className={HM.welcomeFeature}>

              <div className={HM.featureIcon}>
                <Users size={17} />
              </div>

              <div>
                <strong>Patient Management</strong>
                <span>Organize patient information with ease.</span>
              </div>

            </div>


            <div className={HM.welcomeFeature}>

              <div className={HM.featureIcon}>
                <ShieldCheck size={17} />
              </div>

              <div>
                <strong>Secure & Organized</strong>
                <span>Keep important healthcare information protected.</span>
              </div>

            </div>


            <div className={HM.welcomeFeature}>

              <div className={HM.featureIcon}>
                <Activity size={17} />
              </div>

              <div>
                <strong>Better Hospital Insights</strong>
                <span>Understand your hospital through useful reports.</span>
              </div>

            </div>

          </div>


          {/* Bottom trust card */}
          <div className={HM.trustCard}>

            <div className={HM.trustAvatars}>

              <div>DR</div>
              <div>AM</div>
              <div>JS</div>

            </div>

            <div className={HM.trustText}>
              <div className={HM.trustStars}>
                ★★★★★
              </div>

              <span>
                Trusted by healthcare teams
              </span>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          RIGHT — LOGIN
      ===================================== */}
      <section className={HM.loginSection}>
        <div className={HM.loginContainer}>
          {/* Mobile logo */}
          <div className={HM.mobileBrand}>
            <div className={HM.logoIcon}>
              <HeartPulse size={23} />
            </div>
            <div>
              <h2>MedFlow</h2>
              <span>Hospital Management</span>
            </div>
          </div>
          {/* Login heading */}
          <div className={HM.loginHeading}>

            <div className={HM.loginBadge}>
              <LockKeyhole size={13} />
              Secure access
            </div>

            <h1>
              Welcome back
            </h1>

            <p>
              Sign in to access your hospital management
              dashboard.
            </p>

          </div>


          {/* =====================================
              LOGIN FORM
          ===================================== */}
          <form className={HM.loginForm} onSubmit={Handlesubmit} >
            {/* Email */}
            <div className={HM.formGroup}>
              <label htmlFor="email">Email address    </label>
              <div className={HM.inputWrapper}>
                <Mail size={17} />
                <input id="email" required value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your email" />
              </div>
            </div>
            {/* Password */}
            <div className={HM.formGroup}>
              <div className={HM.passwordLabel}>
                <label htmlFor="password">
                  Password
                </label>
                <button type="button" className={HM.forgotButton}>  Forgot password?  </button>
              </div>
              <div className={HM.inputWrapper}>
                <LockKeyhole size={17} />
                <input id="password" required value={password} type={showpassword ? "text" : "password"} placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showpassword)} className={HM.passwordToggle} > {showpassword ? (<><EyeOff /></>) : (<><Eye size={17} /></>)}</button>
              </div>
            </div>
            {/* Remember me */}
            <div className={HM.formOptions}>
              <label className={HM.rememberMe}>
                <input type="checkbox" />
                <span>    Remember me    </span>
              </label>
              <div className={HM.securityStatus}>
                <ShieldCheck size={13} />
                Secure login
              </div>
            </div>
            {/* Login button */}
            {/* Add your login logic here later */}
            <button type="submit" disabled={active} className={HM.loginButton}>{active ? (<><span className={HM.spinner} ></span></>) : (<>Sign in to dashboard</>)}<ArrowRight size={18} /></button>
          </form>
          {/* Divider */}
          <div className={HM.divider}>
            <span></span>
            <p>Hospital Management System</p>
            <span></span>
          </div>
          {/* Support */}
          <div className={HM.supportCard}>

            <div className={HM.supportIcon}>
              <Headphones size={18} />
            </div>

            <div>
              <strong>Need help accessing your account?</strong>

              <span>
                Contact your hospital administrator for assistance.
              </span>
            </div>

          </div>


          {/* Footer */}
          <div className={HM.loginFooter}>

            <span>
              © 2026 MedFlow
            </span>

            <div>
              <a href="#privacy">Privacy</a>
              <a href="#terms">Terms</a>
              <a href="#security">Security</a>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Login;