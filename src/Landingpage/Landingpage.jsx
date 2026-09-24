import { useEffect, useState } from "react";
import {Stethoscope,Menu, X, LayoutDashboard,Users, FileText,BarChart3,Bell,Settings,UserPlus,  ClipboardCheck,ShieldCheck,  Lock,Cloud, KeyRound,BellRing,Smartphone,HeartHandshake,FolderKanban, Repeat,EyeOff,MessageSquareOff,RotateCcw,UserCog,Wifi,Database,Clock,Check,Plus,} from "lucide-react";
import HM from "./landingpage.module.css";
import { useNavigate } from "react-router-dom";


const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Solutions", href: "#solutions" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Security", href: "#security" },
];

const SIDE_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Patients", icon: Users },
  { label: "Medical Records", icon: FileText },
  { label: "Reports", icon: BarChart3 },
  { label: "Notifications", icon: Bell },
  { label: "Settings", icon: Settings },
];

const STATS = [
  { label: "Total Patients", value: "3,482" },
  { label: "Active Patients", value: "1,206" },
  { label: "Today's Visits", value: "94" },
  { label: "Waiting Patients", value: "12" },
];

const RECENT_PATIENTS = [
  { name: "A. Mensah", meta: "Registered 12m ago" },
  { name: "K. Owusu", meta: "Registered 41m ago" },
  { name: "N. Boateng", meta: "Registered 1h ago" },
];

const RECENT_RECORDS = [
  { name: "Record #4021 updated", meta: "Cardiology" },
  { name: "Record #4018 updated", meta: "Pediatrics" },
  { name: "Record #4012 updated", meta: "Radiology" },
];

const TRUST_ITEMS = [
  { label: "Secure", icon: Lock },
  { label: "Cloud-ready", icon: Cloud },
  { label: "Role-based access", icon: KeyRound },
  { label: "Real-time notifications", icon: BellRing },
  { label: "Responsive", icon: Smartphone },
  { label: "Designed for healthcare teams", icon: HeartHandshake },
];

const PROBLEMS = [
  {
    icon: FolderKanban,
    title: "Scattered information",
    text: "Patient information is often spread across different systems and files.",
  },
  {
    icon: Repeat,
    title: "Manual processes",
    text: "Repetitive administrative work wastes valuable staff time.",
  },
  {
    icon: EyeOff,
    title: "Limited visibility",
    text: "Hospital administrators need a clear view of daily operations.",
  },
  {
    icon: MessageSquareOff,
    title: "Communication gaps",
    text: "Important updates can easily be missed between teams.",
  },
];

const SOLUTION_FEATURES = [
  {
    icon: Users,
    title: "Patient management",
    text: "Register and manage every patient in one place.",
  },
  {
    icon: FileText,
    title: "Medical records",
    text: "Keep histories organized and easy to find.",
  },
  {
    icon: BarChart3,
    title: "Hospital reports",
    text: "See activity and trends at a glance.",
  },
  {
    icon: Bell,
    title: "Notifications",
    text: "Know the moment something needs attention.",
  },
  {
    icon: Settings,
    title: "Staff & user management",
    text: "Control who can access what, and why.",
  },
  {
    icon: KeyRound,
    title: "Secure authentication",
    text: "Sign-in built for sensitive healthcare data.",
  },
  {
    icon: ShieldCheck,
    title: "Hospital settings",
    text: "Configure your hospital's structure and rules.",
  },
  {
    icon: RotateCcw,
    title: "Recycle bin & data recovery",
    text: "Undo mistakes before they become permanent.",
  },
];

const FEATURES = [
  {
    icon: Users,
    title: "Patient management",
    text: "Register, update, search, filter, and manage patients efficiently.",
  },
  {
    icon: FileText,
    title: "Medical records",
    text: "Keep patient medical information organized and accessible.",
  },
  {
    icon: BellRing,
    title: "Smart notifications",
    text: "Stay informed when important hospital activities occur.",
  },
  {
    icon: BarChart3,
    title: "Reports & analytics",
    text: "Understand hospital activity through clear reports and insights.",
  },
  {
    icon: ShieldCheck,
    title: "Secure access",
    text: "Protect hospital information with authentication and role-based access.",
  },
  {
    icon: LayoutDashboard,
    title: "Hospital dashboard",
    text: "Get an instant overview of what's happening across your hospital.",
  },
  {
    icon: RotateCcw,
    title: "Recycle bin",
    text: "Safely recover deleted patient information when needed.",
  },
  {
    icon: Smartphone,
    title: "Responsive design",
    text: "Access your system across desktop, tablet, and mobile devices.",
  },
];

const SCREENS = [
  {
    icon: LayoutDashboard,
    label: "Hospital dashboard",
    rows: [
      ["Total patients", "3,482"],
      ["Today's visits", "94"],
    ],
  },
  {
    icon: Users,
    label: "Patient management",
    rows: [
      ["Active patients", "1,206"],
      ["New this week", "38"],
    ],
  },
  {
    icon: FileText,
    label: "Medical records",
    rows: [
      ["Records updated", "212"],
      ["Pending review", "9"],
    ],
  },
  {
    icon: BarChart3,
    label: "Reports",
    rows: [
      ["Admissions", "128"],
      ["Discharges", "96"],
    ],
  },
  {
    icon: Bell,
    label: "Notifications",
    rows: [
      ["Unread", "5"],
      ["Today", "17"],
    ],
  },
];

const STEPS = [
  {
    num: "01",
    title: "Set up",
    text: "Configure your hospital and create your administrative account.",
  },
  {
    num: "02",
    title: "Manage",
    text: "Manage patients, records, reports, and daily hospital operations.",
  },
  {
    num: "03",
    title: "Grow",
    text: "Use insights and organized workflows to improve operational efficiency.",
  },
];

const SECURITY_ITEMS = [
  { icon: KeyRound, label: "Secure authentication" },
  { icon: Database, label: "Protected patient information" },
  { icon: UserCog, label: "Role-based access" },
  { icon: Wifi, label: "Secure API communication" },
  { icon: ShieldCheck, label: "Data protection" },
  { icon: Clock, label: "Session management" },
];

const PLANS = [
  {
    name: "Essential",
    price: "GH₵120",
    period: "/month",
    desc: "For smaller healthcare teams.",
    features: [
      "Patient management",
      "Basic medical records",
      "Up to 5 staff accounts",
      "Standard reports",
      "Email support",
    ],
    cta: "Get Started",
  },
  {
    name: "Professional",
    price: "GH₵250",
    period: "/month",
    desc: "For growing hospitals and clinics.",
    features: [
      "Everything in Essential",
      "Advanced medical records",
      "Up to 30 staff accounts",
      "Real-time notifications",
      "Priority support",
    ],
    cta: "Start Free",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "GH₵1,000",
    period: "/year",
    desc: "For larger healthcare organizations.",
    features: [
      "Everything in Professional",
      "Unlimited staff accounts",
      "Advanced role-based access",
      "Multi-facility support",
      "Dedicated onboarding",
    ],
    cta: "Contact Us",
  },
];

const TESTIMONIAL_PLACEHOLDERS = [
  {
    quote:
      "Placeholder testimonial — replace with a quote from a real healthcare team once available.",
    name: "Placeholder name",
    role: "Placeholder role, hospital",
  },
  {
    quote:
      "Placeholder testimonial — replace with a quote from a real healthcare team once available.",
    name: "Placeholder name",
    role: "Placeholder role, clinic",
  },
  {
    quote:
      "Placeholder testimonial — replace with a quote from a real healthcare team once available.",
    name: "Placeholder name",
    role: "Placeholder role, hospital",
  },
];

const FAQS = [
  {
    q: "What is MedFlow?",
    a: "MedFlow is a hospital management platform that brings patients, medical records, reports, and daily operations into one place.",
  },
  {
    q: "Who can use MedFlow?",
    a: "MedFlow is built for hospitals, clinics, doctors, and healthcare administrators managing day-to-day operations.",
  },
  {
    q: "Can multiple staff members use the system?",
    a: "Yes. MedFlow supports multiple staff accounts with role-based access, so each team member sees what's relevant to them.",
  },
  {
    q: "How does patient management work?",
    a: "You can register, search, filter, update, and manage patient information from a single, organized view.",
  },
  {
    q: "Can medical records be managed?",
    a: "Yes. Medical records can be created, updated, and kept organized alongside each patient's profile.",
  },
  {
    q: "Is my hospital data protected?",
    a: "MedFlow is built with secure authentication, role-based access, and protected data handling as core design principles.",
  },
  {
    q: "Can I access MedFlow on mobile?",
    a: "Yes. MedFlow is fully responsive and works across desktop, tablet, and mobile devices.",
  },
  {
    q: "Can I upgrade my plan later?",
    a: "Yes. You can move between Essential, Professional, and Enterprise plans as your hospital grows.",
  },
];

/* ---------- COMPONENT ---------- */

export default function Landingpage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
const navigate=useNavigate() 

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(HM.visible);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className={HM.page}>

      {/* ================= NAVBAR ================= */}

      <header
        className={`${HM.navWrap} ${
          scrolled ? HM.navScrolled : ""
        }`}
      >
        <nav className={HM.navBar} aria-label="Primary">

          <a href="#top" className={HM.navBrand}>
            <span className={HM.navBrandIcon}>
              <Stethoscope size={18} strokeWidth={2.2} />
            </span>

            <span>MedFlow</span>
          </a>

          <ul className={HM.navLinks}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>

          <div className={HM.navActions}>
            <button className={HM.navLogin}  onClick={()=>navigate("./login")} >Log In</button>

            <button className={HM.navCta}   onClick={()=>navigate("./login")} >    Get Started   </button>
          </div>

          <button
            className={HM.navBurger}
            aria-label={
              menuOpen ? "Close menu" : "Open menu"
            }
            aria-expanded={menuOpen}
            onClick={() =>
              setMenuOpen((value) => !value)
            }
          >
            {menuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </nav>

        {menuOpen && (
          <div className={HM.navMobilePanel}>
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}

            <div className={HM.navMobileActions}>
              <button className={HM.navLogin}   onClick={()=>navigate("./login")}  >   Log In  </button>

              <button className={HM.navCta}    onClick={()=>navigate("./login")}  >  Get Started</button>
            </div>
          </div>
        )}
      </header>

      {/* ================= HERO ================= */}

      <section className={HM.heroSection} id="top">
        <div className={HM.heroInner}>

          <span
            className={`${HM.heroBadge} ${HM.fadeUp}`}
          >
            <span />
            Trusted technology for modern healthcare teams
          </span>

          <h1
            className={`${HM.heroHeadline} ${HM.fadeUp} ${HM.delay1}`}
          >
            The smarter way to manage your hospital
          </h1>

          <p
            className={`${HM.heroSub} ${HM.fadeUp} ${HM.delay2}`}
          >
            Manage patients, medical records, appointments,
            reports, and hospital operations from one secure,
            intelligent platform.
          </p>

          <div
            className={`${HM.heroCtaRow} ${HM.fadeUp} ${HM.delay3}`}
          >
            <button className={HM.heroPrimary}    onClick={()=>navigate("./login")}  >   Get Started</button>

            <button className={HM.heroSecondary}>
              Explore Features
            </button>
          </div>

          <div
            className={`${HM.heroStage} ${HM.fadeUp} ${HM.delay4}`}
          >

            <div className={HM.heroFrame}>

              <div className={HM.heroFrameTop}>
                <span />
                <span />
                <span />
              </div>

              <div className={HM.heroDashboard}>

                <aside className={HM.heroSide}>
                  {SIDE_ITEMS.map(
                    ({ label, icon: Icon, active }) => (
                      <div
                        key={label}
                        className={`${HM.heroSideItem} ${
                          active
                            ? HM.heroSideItemActive
                            : ""
                        }`}
                      >
                        <Icon size={16} />
                        {label}
                      </div>
                    )
                  )}
                </aside>

                <div className={HM.heroMain}>

                  <div className={HM.heroMainHead}>
                    <div>
                      <h3>Hospital overview</h3>
                      <p>Wednesday, 23 September</p>
                    </div>
                  </div>

                  <div className={HM.heroStatGrid}>
                    {STATS.map((stat) => (
                      <div
                        className={HM.heroStat}
                        key={stat.label}
                      >
                        <p>{stat.label}</p>
                        <strong>{stat.value}</strong>
                      </div>
                    ))}
                  </div>

                  <div className={HM.heroLowerGrid}>

                    <div className={HM.heroPanel}>
                      <h4>Recent patients</h4>

                      {RECENT_PATIENTS.map((patient) => (
                        <div
                          className={HM.heroRow}
                          key={patient.name}
                        >
                          <div>
                            <div
                              className={HM.heroRowName}
                            >
                              {patient.name}
                            </div>

                            <div
                              className={HM.heroRowMeta}
                            >
                              {patient.meta}
                            </div>
                          </div>

                          <span className={HM.heroTag}>
                            New
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className={HM.heroPanel}>
                      <h4>Recent medical records</h4>

                      {RECENT_RECORDS.map((record) => (
                        <div
                          className={HM.heroRow}
                          key={record.name}
                        >
                          <div>
                            <div
                              className={HM.heroRowName}
                            >
                              {record.name}
                            </div>

                            <div
                              className={HM.heroRowMeta}
                            >
                              {record.meta}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </div>
            </div>

            <div
              className={`${HM.heroFloatCard} ${HM.heroCardOne}`}
            >
              <span className={HM.heroFloatIcon}>
                <UserPlus size={15} />
              </span>

              <div>
                <strong>Patient registered</strong>
                <p>New patient successfully added</p>
              </div>
            </div>

            <div
              className={`${HM.heroFloatCard} ${HM.heroCardTwo}`}
            >
              <span className={HM.heroFloatIcon}>
                <ClipboardCheck size={15} />
              </span>

              <div>
                <strong>Medical record updated</strong>
                <p>Patient medical record updated</p>
              </div>
            </div>

            <div
              className={`${HM.heroFloatCard} ${HM.heroCardThree}`}
            >
              <span className={HM.heroFloatIcon}>
                <ShieldCheck size={15} />
              </span>

              <div>
                <strong>System status</strong>
                <p>All systems operational</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= TRUST ================= */}

      <section className={HM.trustSection}>
        <div
          className={HM.trustInner}
          data-reveal
        >
          <h2 className={HM.trustHeading}>
            Everything your healthcare team needs.
            <span> One platform.</span>
          </h2>

          <div className={HM.trustRow}>
            {TRUST_ITEMS.map(
              ({ label, icon: Icon }) => (
                <span
                  className={HM.trustPill}
                  key={label}
                >
                  <Icon size={15} />
                  {label}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ================= PROBLEM ================= */}

      <section className={HM.problemSection}>
        <div
          className={HM.problemInner}
          data-reveal
        >
          <div className={HM.sectionEyebrow}>
            THE PROBLEM
          </div>

          <h2 className={HM.problemHeading}>
            Healthcare management shouldn't feel
            <span> complicated.</span>
          </h2>

          <div className={HM.problemGrid}>
            {PROBLEMS.map(
              ({ icon: Icon, title, text }) => (
                <div
                  className={HM.problemCard}
                  key={title}
                >
                  <span className={HM.problemIcon}>
                    <Icon size={19} />
                  </span>

                  <h3>{title}</h3>

                  <p>{text}</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ================= SOLUTION ================= */}

      <section
        className={HM.solutionSection}
        id="solutions"
      >
        <div
          className={HM.solutionInner}
          data-reveal
        >

          <div className={HM.solutionVisual}>

            <div className={HM.solutionGlow} />

            <div className={HM.solutionVisualHead}>
              <span>Hospital reports</span>
              <span>This week</span>
            </div>

            <div className={HM.solutionVisualStats}>

              <div className={HM.solutionVisualStat}>
                <p>Admissions</p>
                <strong>128</strong>
              </div>

              <div className={HM.solutionVisualStat}>
                <p>Discharges</p>
                <strong>96</strong>
              </div>

            </div>

            <div className={HM.solutionVisualBars}>
              {[40, 65, 50, 80, 55, 70, 45].map(
                (height, index) => (
                  <div
                    key={index}
                    className={`${HM.solutionBar} ${
                      index === 3
                        ? HM.solutionBarActive
                        : ""
                    }`}
                    style={{
                      height: `${height}%`,
                    }}
                  />
                )
              )}
            </div>
          </div>

          <div>

            <p className={HM.solutionEyebrow}>
              ONE PLATFORM
            </p>

            <h2 className={HM.solutionHeading}>
              Your entire hospital operation,
              <span> in one place.</span>
            </h2>

            <p className={HM.solutionLead}>
              MedFlow brings the systems your team
              already juggles into a single,
              centralized platform — built for how
              hospitals actually run.
            </p>

            <div className={HM.solutionList}>
              {SOLUTION_FEATURES.map(
                ({ icon: Icon, title, text }) => (
                  <div
                    className={HM.solutionItem}
                    key={title}
                  >
                    <span
                      className={HM.solutionItemIcon}
                    >
                      <Icon size={16} />
                    </span>

                    <div
                      className={HM.solutionItemBody}
                    >
                      <strong>{title}</strong>
                      <p>{text}</p>
                    </div>
                  </div>
                )
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}

      <section
        className={HM.featuresSection}
        id="features"
      >
        <div
          className={HM.featuresInner}
          data-reveal
        >

          <div className={HM.featuresHead}>
            <div className={HM.sectionEyebrow}>
              POWERFUL FEATURES
            </div>

            <h2 className={HM.featuresHeading}>
              Everything you need to run a
              <span> modern hospital.</span>
            </h2>
          </div>

          <div className={HM.featuresGrid}>
            {FEATURES.map(
              ({ icon: Icon, title, text }) => (
                <div
                  className={HM.featuresCard}
                  key={title}
                >
                  <span className={HM.featuresIcon}>
                    <Icon size={19} />
                  </span>

                  <h3>{title}</h3>

                  <p>{text}</p>
                </div>
              )
            )}
          </div>

        </div>
      </section>

      {/* ================= SHOWCASE ================= */}

      <section className={HM.showcaseSection}>
        <div
          className={HM.showcaseInner}
          data-reveal
        >

          <div className={HM.showcaseHead}>
            <div className={HM.sectionEyebrow}>
              THE PLATFORM
            </div>

            <h2 className={HM.showcaseHeading}>
              A complete hospital
              <span> command center.</span>
            </h2>
          </div>

          <div className={HM.showcaseRail}>
            {SCREENS.map(
              ({ icon: Icon, label, rows }) => (
                <div
                  className={HM.showcaseCard}
                  key={label}
                >

                  <div className={HM.showcaseCardTop}>
                    <span />
                    <span />
                    <span />
                  </div>

                  <div
                    className={HM.showcaseCardLabel}
                  >
                    <Icon size={16} />
                    {label}
                  </div>

                  <div
                    className={HM.showcaseCardBody}
                  >
                    {rows.map(([key, value]) => (
                      <div
                        className={HM.showcaseMiniStat}
                        key={key}
                      >
                        <span>{key}</span>
                        <strong>{value}</strong>
                      </div>
                    ))}
                  </div>

                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section
        className={HM.howSection}
        id="how-it-works"
      >
        <div
          className={HM.howInner}
          data-reveal
        >

          <div className={HM.sectionEyebrow}>
            HOW IT WORKS
          </div>

          <h2 className={HM.howHeading}>
            Up and running in
            <span> three steps.</span>
          </h2>

          <div className={HM.howSteps}>
            {STEPS.map((step) => (
              <div
                className={HM.howStep}
                key={step.num}
              >
                <p className={HM.howNum}>
                  {step.num}
                </p>

                <h3>{step.title}</h3>

                <p>{step.text}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= SECURITY ================= */}

      <section
        className={HM.securitySection}
        id="security"
      >
        <div
          className={HM.securityInner}
          data-reveal
        >

          <div className={HM.securityVisual}>

            <div className={HM.securityShield}>
              <div className={HM.securityShieldGlow} />

              <div
                className={HM.securityShieldInner}
              >
                <ShieldCheck
                  size={48}
                  strokeWidth={1.6}
                />
              </div>
            </div>

          </div>

          <div>

            <p className={HM.securityEyebrow}>
              SECURITY
            </p>

            <h2 className={HM.securityHeading}>
              Built with
              <span> security in mind.</span>
            </h2>

            <p className={HM.securityLead}>
              Healthcare data requires serious
              protection. MedFlow is built around
              practical safeguards that keep hospital
              information under control.
            </p>

            <div className={HM.securityGrid}>
              {SECURITY_ITEMS.map(
                ({ icon: Icon, label }) => (
                  <div
                    className={HM.securityItem}
                    key={label}
                  >
                    <span>
                      <Icon size={17} />
                    </span>

                    {label}
                  </div>
                )
              )}
            </div>

          </div>

        </div>
      </section>

      {/* ================= PRICING ================= */}

      <section
        className={HM.pricingSection}
        id="pricing"
      >
        <div
          className={HM.pricingInner}
          data-reveal
        >

          <div className={HM.sectionEyebrow}>
            PRICING
          </div>

          <h2 className={HM.pricingHeading}>
            Simple pricing for growing
            <span> healthcare teams.</span>
          </h2>

          <div className={HM.pricingGrid}>

            {PLANS.map((plan) => (
              <div
                className={`${HM.pricingCard} ${
                  plan.featured
                    ? HM.pricingFeatured
                    : ""
                }`}
                key={plan.name}
              >

                {plan.featured && (
                  <span className={HM.pricingBadge}>
                    Most popular
                  </span>
                )}

                <p className={HM.pricingPlan}>
                  {plan.name}
                </p>

                <div>
                  <span className={HM.pricingPrice}>
                    {plan.price}
                  </span>

                  <span className={HM.pricingPeriod}>
                    {plan.period}
                  </span>
                </div>

                <p className={HM.pricingDesc}>
                  {plan.desc}
                </p>

                <ul className={HM.pricingList}>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={
                    plan.featured
                      ? `${HM.pricingBtn} ${HM.pricingBtnPrimary}`
                      : HM.pricingBtn
                  }
                >
                  {plan.cta}
                </button>

              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}

      <section className={HM.testimonialSection}>
        <div
          className={HM.testimonialInner}
          data-reveal
        >

          <div className={HM.testimonialHead}>

            <div>
              <div className={HM.sectionEyebrow}>
                TRUSTED EXPERIENCE
              </div>

              <h2 className={HM.testimonialHeading}>
                What healthcare teams
                <span> will say.</span>
              </h2>
            </div>

            <p className={HM.testimonialNote}>
              Placeholder space — real
              testimonials to be added.
            </p>

          </div>

          <div className={HM.testimonialGrid}>

            {TESTIMONIAL_PLACEHOLDERS.map(
              (testimonial, index) => (
                <div
                  className={HM.testimonialCard}
                  key={index}
                >

                  <div className={HM.testimonialQuoteIcon}>
                    "
                  </div>

                  <p
                    className={HM.testimonialQuote}
                  >
                    {testimonial.quote}
                  </p>

                  <div
                    className={HM.testimonialPerson}
                  >
                    <span
                      className={HM.testimonialAvatar}
                    />

                    <div>
                      <div
                        className={
                          HM.testimonialName
                        }
                      >
                        {testimonial.name}
                      </div>

                      <div
                        className={
                          HM.testimonialRole
                        }
                      >
                        {testimonial.role}
                      </div>
                    </div>
                  </div>

                </div>
              )
            )}

          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}

      <section className={HM.faqSection}>
        <div
          className={HM.faqInner}
          data-reveal
        >

          <div className={HM.sectionEyebrow}>
            FAQ
          </div>

          <h2 className={HM.faqHeading}>
            Frequently asked
            <span> questions.</span>
          </h2>

          <div>
            {FAQS.map((item, index) => {

              const isOpen = openFaq === index;

              return (
                <div
                  className={HM.faqItem}
                  key={item.q}
                >

                  <button
                    className={`${HM.faqQuestion} ${
                      isOpen
                        ? HM.faqOpen
                        : ""
                    }`}
                    onClick={() =>
                      setOpenFaq(
                        isOpen ? -1 : index
                      )
                    }
                    aria-expanded={isOpen}
                  >
                    {item.q}

                    <span
                      className={HM.faqIcon}
                    >
                      <Plus size={18} />
                    </span>
                  </button>

                  <div
                    className={`${HM.faqAnswerWrap} ${
                      isOpen
                        ? HM.faqAnswerWrapOpen
                        : ""
                    }`}
                  >
                    <div
                      className={
                        HM.faqAnswerInner
                      }
                    >
                      <p
                        className={HM.faqAnswer}
                      >
                        {item.a}
                      </p>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= CTA ================= */}

      <section className={HM.ctaSection}>
        <div
          className={HM.ctaInner}
          data-reveal
        >

          <div className={HM.ctaGlow} />
          <div className={HM.ctaGlowTwo} />

          <div className={HM.ctaContent}>

            <div className={HM.ctaSmall}>
              MEDFLOW
            </div>

            <h2 className={HM.ctaHeading}>
              Ready to modernize
              <span> your hospital?</span>
            </h2>

            <p className={HM.ctaText}>
              Bring your patients, records, reports,
              and hospital operations together in one
              powerful platform.
            </p>

            <div className={HM.ctaRow}>

              <button className={HM.ctaPrimary}     onClick={()=>navigate("./login")}  > Get Started</button>

              <button className={HM.ctaSecondary}>
                Explore the Platform
              </button>

            </div>

          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className={HM.footerFooter}>

        <div className={HM.footerGlow} />

        <div className={HM.footerInner}>

          <div className={HM.footerTop}>

            <div className={HM.footerMain}>

              <div className={HM.footerBrand}>
                <span className={HM.footerBrandIcon}>
                  <Stethoscope
                    size={16}
                    strokeWidth={2.2}
                  />
                </span>

                MedFlow
              </div>

              <p className={HM.footerTagline}>
                Hospital Management System for
                modern healthcare teams.
              </p>

              <div className={HM.footerStatus}>
                <span />
                All systems operational
              </div>

            </div>

            <div className={HM.footerCols}>

              <div className={HM.footerCol}>
                <h4>Product</h4>

                <ul>
                  <li>
                    <a href="#features">
                      Features
                    </a>
                  </li>

                  <li>
                    <a href="#solutions">
                      Solutions
                    </a>
                  </li>

                  <li>
                    <a href="#pricing">
                      Pricing
                    </a>
                  </li>

                  <li>
                    <a href="#security">
                      Security
                    </a>
                  </li>
                </ul>
              </div>

              <div className={HM.footerCol}>
                <h4>Company</h4>

                <ul>
                  <li>
                    <a href="#contact">
                      Contact
                    </a>
                  </li>

                  <li>
                    <a href="#login">
                      Login
                    </a>
                  </li>
                </ul>
              </div>

              <div className={HM.footerCol}>
                <h4>Legal</h4>

                <ul>
                  <li>
                    <a href="#privacy">
                      Privacy Policy
                    </a>
                  </li>

                  <li>
                    <a href="#terms">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          <div className={HM.footerBottom}>

            <span>
              © 2026 MedFlow Hospital Management
              System. All rights reserved.
            </span>

            <span className={HM.footerMade}>
              Built for modern healthcare
            </span>

          </div>

        </div>
      </footer>

    </div>
  );
}