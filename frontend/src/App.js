import { BrowserRouter,Routes,Route } from "react-router-dom"

import Login from "./pages/Login"
import Register from "./pages/Register"
import StudentDashboard from "./pages/StudentDashboard"
import InstructorDashboard from "./pages/InstructorDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import InstructorSubmissions from "./pages/InstructorSubmissions"
import AdminUsers from "./pages/AdminUsers"
import AdminAssignments from "./pages/AdminAssignments"
import AdminSubmissions from "./pages/AdminSubmissions"
import ForgotPassword from "./pages/ForgotPassword"
import "./style.css"
import ChangePassword from "./pages/ChangePassword"
function App(){

return(

<BrowserRouter>

<Routes>

<Route path="/" element={<Login/>}/>
<Route path="/register" element={<Register/>}/>

<Route path="/student" element={<StudentDashboard/>}/>
<Route path="/instructor" element={<InstructorDashboard/>}/>
<Route path="/admin" element={<AdminDashboard/>}/>
<Route path="/admin/users" element={<AdminUsers/>}/>
<Route path="/admin/assignments" element={<AdminAssignments/>}/>
<Route path="/admin/submissions" element={<AdminSubmissions/>}/>
{/* <Route path="/admin/overview" element={<AdminOverview/>}/> */}
<Route path="/instructor/submissions/:id" element={<InstructorSubmissions/>}/>
<Route path="/forgot" element={<ForgotPassword />} />
<Route path="/change-password" element={<ChangePassword />} />

</Routes>

</BrowserRouter>

)

}

export default App