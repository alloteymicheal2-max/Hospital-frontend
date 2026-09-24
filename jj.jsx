
import React, { useState } from "react";
import {
  ArrowRight,
  Check,
  Users,
  FileText,
  CalendarDays,
  BarChart3,
  Stethoscope,
  ShieldCheck,
  Activity,
  Clock3,
  Menu,
  X,
  HeartPulse,
  Star,
  UserRound,
  ClipboardCheck,
  TrendingUp,
  Building2,
  BadgeCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import HM from "./LandingPage.module.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const [mobileMenu, setMobileMenu] = useState(false);

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className={HM.page}>

      {/* ========================= NAVBAR ========================= */}
      <nav className={HM.navbar}>
        <div className={HM.navContainer}>
          <div className={HM.logo} onClick={() => navigate("/")}  >
            <div className={HM.logoIcon}>
              <HeartPulse size={23} />
            </div>
            <div className={HM.logoText}>
              <strong>MedFlow</strong>
              <span>Hospital Management</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className={HM.desktopNav}>
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#solutions">Solutions</a>
            <a href="#pricing">Pricing</a>
            <a href="#about">About</a>
          </div>

          {/* Desktop Actions */}
          <div className={HM.navActions}>
            <button className={HM.loginButton} onClick={goToLogin}>Login</button>
            <button className={HM.navGetStarted} onClick={goToLogin}> Get Started<ArrowRight size={16} />    </button>
          </div>

          {/* Mobile Menu Button */}
          <button className={HM.menuButton} onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {/* Mobile Navigation */}
        {mobileMenu && (
          <div className={HM.mobileMenu}>
            <a href="#home" onClick={() => setMobileMenu(false)}> Home</a>
            <a href="#features" onClick={() => setMobileMenu(false)}>  Features </a>
            <a href="#solutions" onClick={() => setMobileMenu(false)}> Solutions  </a>
            <a href="#pricing" onClick={() => setMobileMenu(false)}> Pricing </a>
            <a href="#about" onClick={() => setMobileMenu(false)}> About </a>
            <button className={HM.mobileLogin} onClick={goToLogin}>  Login </button>
            <button className={HM.mobileGetStarted} onClick={goToLogin} >Get Started<ArrowRight size={17} /></button>
          </div>
        )}
      </nav>
      {/* ========================= HERO ========================= */}
      <section id="home" className={HM.hero}      >
        <div className={HM.heroContainer}>
          <div className={HM.heroContent}>
            <div className={HM.heroBadge}>
              <span className={HM.badgeDot}></span>
              Modern Healthcare Management
            </div>
            <h1>
              Better healthcare
              <br />
              starts with
              <span> better management.</span>
            </h1>
            <p>
              A modern hospital management system designed to
              simplify patient care, medical records, staff
              management and everyday hospital operations.
            </p>
            <div className={HM.heroButtons}>
              <button className={HM.primaryButton} onClick={goToLogin}>Get Started  <ArrowRight size={18} /> </button>
              <a href="#features" className={HM.secondaryButton}         >   Explore Features     </a>
            </div>
            {/* Trust */}
            <div className={HM.heroTrust}>
              <div className={HM.avatarGroup}>
                <div className={HM.avatar}>
                  <UserRound size={16} />
                </div>

                <div className={HM.avatar}>
                  <Stethoscope size={16} />
                </div>

                <div className={HM.avatar}>
                  <HeartPulse size={16} />
                </div>

                <div className={HM.avatar}>
                  <Users size={16} />
                </div>
              </div>

              <div className={HM.trustText}>
                <div className={HM.stars}>
                  <Star size={13} fill="currentColor" />
                  <Star size={13} fill="currentColor" />
                  <Star size={13} fill="currentColor" />
                  <Star size={13} fill="currentColor" />
                  <Star size={13} fill="currentColor" />
                </div>

                <span>
                  Built for modern healthcare teams
                </span>
              </div>

            </div>

          </div>


          {/* ========================= DASHBOARD MOCKUP ========================= */}
          <div className={HM.heroVisual}>

            <div className={HM.dashboardWindow}>

              {/* Dashboard Header */}
              <div className={HM.dashboardHeader}>

                <div className={HM.dashboardBrand}>
                  <div className={HM.dashboardBrandIcon}>
                    <HeartPulse size={17} />
                  </div>

                  <div>
                    <strong>Hospital</strong>
                    <span>MANAGEMENT SYSTEM</span>
                  </div>
                </div>

                <div className={HM.dashboardHeaderRight}>
                  <div className={HM.dashboardCircle}></div>
                  <div className={HM.dashboardUser}></div>
                </div>

              </div>


              {/* Dashboard Body */}
              <div className={HM.dashboardBody}>

                <div className={HM.dashboardWelcome}>
                  <span>Good morning, Admin</span>
                  <strong>Hospital Overview</strong>
                </div>


                {/* Dashboard Cards */}
                <div className={HM.dashboardStats}>

                  <div className={HM.dashboardStatCard}>
                    <div className={HM.statIcon}>
                      <Users size={18} />
                    </div>

                    <div>
                      <span>Total Patients</span>
                      <strong>1,248</strong>
                    </div>

                    <TrendingUp size={16} />
                  </div>


                  <div className={HM.dashboardStatCard}>
                    <div className={HM.statIcon}>
                      <CalendarDays size={18} />
                    </div>

                    <div>
                      <span>Appointments</span>
                      <strong>86</strong>
                    </div>

                    <TrendingUp size={16} />
                  </div>


                  <div className={HM.dashboardStatCard}>
                    <div className={HM.statIcon}>
                      <FileText size={18} />
                    </div>

                    <div>
                      <span>Medical Records</span>
                      <strong>3,642</strong>
                    </div>

                    <TrendingUp size={16} />
                  </div>

                </div>


                {/* Dashboard Content */}
                <div className={HM.dashboardContent}>

                  <div className={HM.dashboardChart}>

                    <div className={HM.chartTop}>
                      <div>
                        <span>Patient Activity</span>
                        <strong>Weekly Overview</strong>
                      </div>

                      <BarChart3 size={19} />
                    </div>

                    <div className={HM.chartLines}>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>

                    <div className={HM.chartBars}>
                      <i></i>
                      <i></i>
                      <i></i>
                      <i></i>
                      <i></i>
                      <i></i>
                      <i></i>
                    </div>

                  </div>


                  <div className={HM.dashboardActivity}>

                    <div className={HM.activityTitle}>
                      <span>Recent Activity</span>
                      <Clock3 size={16} />
                    </div>

                    <div className={HM.activityItem}>
                      <div className={HM.activityIcon}>
                        <UserRound size={14} />
                      </div>

                      <div>
                        <strong>New patient registered</strong>
                        <span>2 minutes ago</span>
                      </div>
                    </div>

                    <div className={HM.activityItem}>
                      <div className={HM.activityIcon}>
                        <FileText size={14} />
                      </div>

                      <div>
                        <strong>Medical record updated</strong>
                        <span>15 minutes ago</span>
                      </div>
                    </div>

                    <div className={HM.activityItem}>
                      <div className={HM.activityIcon}>
                        <CalendarDays size={14} />
                      </div>

                      <div>
                        <strong>Appointment scheduled</strong>
                        <span>32 minutes ago</span>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

            </div>


            {/* Floating Cards */}
            <div className={HM.floatingPatientCard}>

              <div className={HM.floatingIcon}>
                <UserRound size={18} />
              </div>

              <div>
                <span>Patient Status</span>
                <strong>Active</strong>
              </div>

              <div className={HM.activeDot}></div>

            </div>


            <div className={HM.floatingAppointmentCard}>

              <div className={HM.floatingIcon}>
                <CalendarDays size={18} />
              </div>

              <div>
                <span>Today's Appointments</span>
                <strong>24</strong>
              </div>

            </div>


            <div className={HM.floatingSecurityCard}>

              <ShieldCheck size={19} />

              <div>
                <strong>Data Protected</strong>
                <span>Secure system</span>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ========================= STATS ========================= */}
      <section className={HM.statsSection}>

        <div className={HM.statsContainer}>

          <div className={HM.statBox}>
            <strong>1,200+</strong>
            <span>Patients Managed</span>
          </div>

          <div className={HM.statDivider}></div>

          <div className={HM.statBox}>
            <strong>3,600+</strong>
            <span>Medical Records</span>
          </div>

          <div className={HM.statDivider}></div>

          <div className={HM.statBox}>
            <strong>98%</strong>
            <span>Operational Efficiency</span>
          </div>

          <div className={HM.statDivider}></div>

          <div className={HM.statBox}>
            <strong>24/7</strong>
            <span>System Availability</span>
          </div>

        </div>

      </section>


      {/* ========================= FEATURES ========================= */}
      <section
        id="features"
        className={HM.featuresSection}
      >

        <div className={HM.sectionHeading}>

          <span className={HM.sectionLabel}>
            POWERFUL FEATURES
          </span>

          <h2>
            Everything your hospital
            <br />
            needs in one system.
          </h2>

          <p>
            Manage your hospital from one organized workspace
            built to make healthcare administration easier,
            faster and more efficient.
          </p>

        </div>


        <div className={HM.featureGrid}>

          {/* 01 */}
          <div className={HM.featureCard}>

            <div className={HM.featureIcon}>
              <Users size={23} />
            </div>

            <span className={HM.featureNumber}>01</span>

            <h3>Patient Management</h3>

            <p>
              Manage patient profiles, personal information,
              emergency contacts and patient status from one
              organized workspace.
            </p>

            <button className={HM.featureLink}>
              Learn more
              <ArrowRight size={15} />
            </button>

          </div>


          {/* 02 */}
          <div className={HM.featureCard}>

            <div className={HM.featureIcon}>
              <FileText size={23} />
            </div>

            <span className={HM.featureNumber}>02</span>

            <h3>Medical Records</h3>

            <p>
              Store diagnoses, symptoms, treatments,
              medications, investigations and complete
              clinical records securely.
            </p>

            <button className={HM.featureLink}>
              Learn more
              <ArrowRight size={15} />
            </button>

          </div>


          {/* 03 */}
          <div className={HM.featureCard}>

            <div className={HM.featureIcon}>
              <CalendarDays size={23} />
            </div>

            <span className={HM.featureNumber}>03</span>

            <h3>Appointment Management</h3>

            <p>
              Organize appointments, schedules and patient
              visits while keeping your healthcare team
              coordinated.
            </p>

            <button className={HM.featureLink}>
              Learn more
              <ArrowRight size={15} />
            </button>

          </div>


          {/* 04 */}
          <div className={HM.featureCard}>

            <div className={HM.featureIcon}>
              <BarChart3 size={23} />
            </div>

            <span className={HM.featureNumber}>04</span>

            <h3>Reports & Analytics</h3>

            <p>
              Turn hospital activity into useful reports
              that help administrators understand
              performance and operations.
            </p>

            <button className={HM.featureLink}>
              Learn more
              <ArrowRight size={15} />
            </button>

          </div>


          {/* 05 */}
          <div className={HM.featureCard}>

            <div className={HM.featureIcon}>
              <Stethoscope size={23} />
            </div>

            <span className={HM.featureNumber}>05</span>

            <h3>Staff Management</h3>

            <p>
              Keep doctors, nurses and other healthcare
              staff organized with clear staff information
              and access.
            </p>

            <button className={HM.featureLink}>
              Learn more
              <ArrowRight size={15} />
            </button>

          </div>


          {/* 06 */}
          <div className={HM.featureCard}>

            <div className={HM.featureIcon}>
              <ShieldCheck size={23} />
            </div>

            <span className={HM.featureNumber}>06</span>

            <h3>Secure Healthcare Data</h3>

            <p>
              Protect sensitive hospital information with
              controlled access and security-focused
              management workflows.
            </p>

            <button className={HM.featureLink}>
              Learn more
              <ArrowRight size={15} />
            </button>

          </div>


          {/* 07 */}
          <div className={HM.featureCard}>

            <div className={HM.featureIcon}>
              <Activity size={23} />
            </div>

            <span className={HM.featureNumber}>07</span>

            <h3>Hospital Operations</h3>

            <p>
              Bring important hospital activities together
              so teams can work faster with less
              administrative complexity.
            </p>

            <button className={HM.featureLink}>
              Learn more
              <ArrowRight size={15} />
            </button>

          </div>


          {/* 08 */}
          <div className={HM.featureCard}>

            <div className={HM.featureIcon}>
              <Clock3 size={23} />
            </div>

            <span className={HM.featureNumber}>08</span>

            <h3>Real-Time Updates</h3>

            <p>
              Keep important information updated across
              the system so healthcare teams can work
              with current information.
            </p>

            <button className={HM.featureLink}>
              Learn more
              <ArrowRight size={15} />
            </button>

          </div>

        </div>

      </section>


      {/* ========================= SOLUTIONS ========================= */}
      <section
        id="solutions"
        className={HM.solutionsSection}
      >

        <div className={HM.solutionContainer}>

          <div className={HM.solutionContent}>

            <span className={HM.sectionLabel}>
              BUILT FOR HEALTHCARE
            </span>

            <h2>
              One system.
              <br />
              Every department.
            </h2>

            <p>
              MedFlow brings patients, doctors, staff,
              medical records and hospital operations
              together into one simple management platform.
            </p>


            <div className={HM.solutionList}>

              <div className={HM.solutionItem}>

                <div className={HM.solutionCheck}>
                  <Check size={15} />
                </div>

                <div>
                  <strong>Centralized Information</strong>
                  <span>
                    Access important hospital information
                    from one place.
                  </span>
                </div>

              </div>


              <div className={HM.solutionItem}>

                <div className={HM.solutionCheck}>
                  <Check size={15} />
                </div>

                <div>
                  <strong>Faster Workflows</strong>
                  <span>
                    Reduce repetitive administrative work
                    and save valuable time.
                  </span>
                </div>

              </div>


              <div className={HM.solutionItem}>

                <div className={HM.solutionCheck}>
                  <Check size={15} />
                </div>

                <div>
                  <strong>Better Organization</strong>
                  <span>
                    Keep your healthcare operations
                    structured and easy to manage.
                  </span>
                </div>

              </div>

            </div>

          </div>


          {/* Solution Visual */}
          <div className={HM.solutionVisual}>

            {/* Patient Card */}
            <div className={HM.patientSolutionCard}>

              <div className={HM.solutionCardTop}>

                <div className={HM.solutionPersonIcon}>
                  <UserRound size={21} />
                </div>

                <div>
                  <span>Patient</span>
                  <strong>Michael Anderson</strong>
                </div>

                <BadgeCheck size={20} />

              </div>

              <div className={HM.patientDetails}>

                <div>
                  <span>Status</span>
                  <strong>Active</strong>
                </div>

                <div>
                  <span>Patient ID</span>
                  <strong>PT-10248</strong>
                </div>

                <div>
                  <span>Last Visit</span>
                  <strong>Today</strong>
                </div>

              </div>

            </div>


            {/* Appointment Card */}
            <div className={HM.appointmentSolutionCard}>

              <div className={HM.appointmentIcon}>
                <CalendarDays size={21} />
              </div>

              <div>
                <span>Upcoming Appointment</span>
                <strong>Dr. Sarah Williams</strong>
                <small>Today • 10:30 AM</small>
              </div>

            </div>


            {/* Doctor Card */}
            <div className={HM.doctorSolutionCard}>

              <div className={HM.doctorIcon}>
                <Stethoscope size={20} />
              </div>

              <div>
                <span>Healthcare Staff</span>
                <strong>Dr. James Miller</strong>
              </div>

              <div className={HM.onlineStatus}>
                Online
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================= PRICING ========================= */}
      <section
        id="pricing"
        className={HM.pricingSection}
      >

        <div className={HM.sectionHeading}>

          <span className={HM.sectionLabel}>
            SIMPLE PRICING
          </span>

          <h2>
            Choose the plan that
            <br />
            fits your hospital.
          </h2>

          <p>
            Start with the essentials and upgrade when
            your healthcare organization grows.
          </p>

        </div>


        <div className={HM.pricingGrid}>

          {/* Essential */}
          <div className={HM.pricingCard}>

            <div className={HM.pricingTop}>

              <span className={HM.planName}>
                Essential
              </span>

              <p>
                For small clinics and healthcare teams.
              </p>

            </div>

            <div className={HM.price}>
              <span>GH₵</span>
              <strong>120</strong>
              <small>/month</small>
            </div>

            <button
              className={HM.pricingButton}
              onClick={goToLogin}
            >
              Get Started
              <ArrowRight size={16} />
            </button>


            <div className={HM.planFeatures}>

              <div>
                <Check size={15} />
                Patient Management
              </div>

              <div>
                <Check size={15} />
                Medical Records
              </div>

              <div>
                <Check size={15} />
                Appointment Management
              </div>

              <div>
                <Check size={15} />
                Basic Reports
              </div>

              <div>
                <Check size={15} />
                Staff Management
              </div>

            </div>

          </div>


          {/* Professional */}
          <div className={`${HM.pricingCard} ${HM.popularPricing}`}>

            <div className={HM.popularBadge}>
              MOST POPULAR
            </div>

            <div className={HM.pricingTop}>

              <span className={HM.planName}>
                Professional
              </span>

              <p>
                For growing hospitals and medical centers.
              </p>

            </div>

            <div className={HM.price}>
              <span>GH₵</span>
              <strong>250</strong>
              <small>/month</small>
            </div>

            <button
              className={HM.pricingButtonPrimary}
              onClick={goToLogin}
            >
              Get Started
              <ArrowRight size={16} />
            </button>


            <div className={HM.planFeatures}>

              <div>
                <Check size={15} />
                Everything in Essential
              </div>

              <div>
                <Check size={15} />
                Advanced Reports
              </div>

              <div>
                <Check size={15} />
                Staff Management
              </div>

              <div>
                <Check size={15} />
                Real-Time Updates
              </div>

              <div>
                <Check size={15} />
                Secure Data Management
              </div>

              <div>
                <Check size={15} />
                Priority Support
              </div>

            </div>

          </div>


          {/* Enterprise */}
          <div className={HM.pricingCard}>

            <div className={HM.pricingTop}>

              <span className={HM.planName}>
                Enterprise
              </span>

              <p>
                For hospitals requiring advanced solutions.
              </p>

            </div>

            <div className={HM.price}>
              <span>GH₵</span>
              <strong>1,000</strong>
              <small>/year</small>
            </div>

            <button
              className={HM.pricingButton}
              onClick={goToLogin}
            >
              Get Started
              <ArrowRight size={16} />
            </button>


            <div className={HM.planFeatures}>

              <div>
                <Check size={15} />
                Everything in Professional
              </div>

              <div>
                <Check size={15} />
                Custom Hospital Workflows
              </div>

              <div>
                <Check size={15} />
                Advanced Analytics
              </div>

              <div>
                <Check size={15} />
                Dedicated Support
              </div>

              <div>
                <Check size={15} />
                Custom Fields
              </div>

              <div>
                <Check size={15} />
                Enterprise Security
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================= ABOUT / CTA ========================= */}
      <section
        id="about"
        className={HM.ctaSection}
      >

        <div className={HM.ctaContainer}>

          <div className={HM.ctaIcon}>
            <Building2 size={27} />
          </div>

          <span className={HM.ctaLabel}>
            READY TO MODERNIZE YOUR HOSPITAL?
          </span>

          <h2>
            Make hospital management
            <br />
            simpler today.
          </h2>

          <p>
            Give your healthcare team the tools they need
            to manage patients, records and daily operations
            more efficiently.
          </p>

          <button
            className={HM.ctaButton}
            onClick={goToLogin}
          >
            Get Started
            <ArrowRight size={18} />
          </button>

        </div>

      </section>


      {/* ========================= FOOTER ========================= */}
      <footer className={HM.footer}>

        <div className={HM.footerContainer}>

          <div className={HM.footerBrand}>

            <div className={HM.logo}>

              <div className={HM.logoIcon}>
                <HeartPulse size={21} />
              </div>

              <div className={HM.logoText}>
                <strong>MedFlow</strong>
                <span>Hospital Management</span>
              </div>

            </div>

            <p>
              Modern hospital management made simple,
              organized and efficient.
            </p>

          </div>


          <div className={HM.footerColumn}>

            <h4>Product</h4>

            <a href="#features">Features</a>
            <a href="#solutions">Solutions</a>
            <a href="#pricing">Pricing</a>

          </div>


          <div className={HM.footerColumn}>

            <h4>Company</h4>

            <a href="#about">About</a>
            <a href="#home">Home</a>
            <a href="#features">Healthcare</a>

          </div>


          <div className={HM.footerColumn}>

            <h4>Account</h4>

            <button onClick={goToLogin}>
              Login
            </button>

            <button onClick={goToLogin}>
              Get Started
            </button>

          </div>

        </div>


        <div className={HM.footerBottom}>

          <span>
            © 2026 MedFlow Hospital Management System.
            All rights reserved.
          </span>

          <div>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Security</span>
          </div>

        </div>

      </footer>

    </div>
  );
};

export default LandingPage;

