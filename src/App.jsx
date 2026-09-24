import LandingPage from "./Landingpage/Landingpage";
import Login from "./Login/Login";
import Header from "./Header/Header";
import RecordDetails from "./MedicalRecords/RecordDetails";
import { Routes, Route } from "react-router-dom";
import {Helmet} from "react-helmet-async"
import  WebSocket from "./Services/WebSocket"


function App() { 
  return (
    <>
       <Helmet>
        <title>Hospital Management System</title>
        <link rel="icon" type="image/png" href="/hospital-logo.png" />
      </Helmet>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/record-details/:patients_id" element={<RecordDetails />} />
        <Route path="/hospital/*" element={<Header />} />
      </Routes>  


    </>
  )
}
export default App;
{/* <LandingPage/> */ }
{/* <Login/> */ }
{/* <Dashboard/> */ }
{/* <Header/> */ }
{/* <Patients/> */ }
{/* <MedicalRecords/> */ }
{/* <Reports/> */ }
{/* <Settings/> */ }
{/* <RecycleBin/> */ }