import {useEffect,useState} from "react"
import API from "../services/api"

export default function AdminUsers(){

 const [page,setPage] = useState(1)
 const perPage = 7

 const [users,setUsers] = useState([])
 const [editUser,setEditUser] = useState(null)
 const [showInactive,setShowInactive] = useState(false)
 const [search,setSearch] = useState("")
 const [roleFilter,setRoleFilter] = useState("all")

 const showStudentId = roleFilter === "student"

 useEffect(()=>{
  fetchUsers()
 },[showInactive])

 const fetchUsers = async ()=>{
  const res = await API.get(
   showInactive ? "/admin/users/inactive" : "/admin/users"
  )
  setUsers(res.data)
 }

 const deleteUser = async(id)=>{
  await API.delete(`/admin/users/${id}`)
  fetchUsers()
 }

 const restoreUser = async(id)=>{
  await API.put(`/admin/users/restore/${id}`)
  fetchUsers()
 }

 const updateUser = async ()=>{
  await API.put(`/admin/users/${editUser._id}`, editUser)
  setEditUser(null)
  fetchUsers()
 }

 const filteredUsers = users.filter(u=>{
  return (
   (roleFilter === "all" || u.role === roleFilter) &&
   (
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
   )
  )
 })

 const totalPages = Math.ceil(filteredUsers.length / perPage)

 const paginatedUsers = filteredUsers.slice(
  (page-1)*perPage,
  page*perPage
 )

 return(

 <div className="users-page">

 <h2>Users</h2>

 <div className="filters">

  <input
   placeholder="Search by name or email..."
   value={search}
   onChange={(e)=>{
    setSearch(e.target.value)
    setPage(1)   
   }}
  />

  <select onChange={(e)=>setRoleFilter(e.target.value)}>
   <option value="all">All</option>
   <option value="student">Student</option>
   <option value="instructor">Instructor</option>
   <option value="admin">Admin</option>
  </select>

 </div>

 <div className="toggle">
  <button 
   className={!showInactive ? "active-tab" : ""}
   onClick={()=>setShowInactive(false)}
  >
   Active
  </button>

  <button 
   className={showInactive ? "active-tab" : ""}
   onClick={()=>setShowInactive(true)}
  >
   Inactive
  </button>
 </div>

 {editUser && (
  <div className="edit-user">

   <h3>Edit User</h3>

   <input
    value={editUser.name}
    onChange={(e)=>setEditUser({...editUser,name:e.target.value})}
   />

   <input
    value={editUser.email}
    onChange={(e)=>setEditUser({...editUser,email:e.target.value})}
   />

   <select
    value={editUser.role}
    onChange={(e)=>setEditUser({...editUser,role:e.target.value})}
   >
    <option value="student">Student</option>
    <option value="instructor">Instructor</option>
    <option value="admin">Admin</option>
   </select>

   <button onClick={updateUser}>Save</button>

  </div>
 )}

 {/* 🔥 TABLE */}
 <table border="1" cellPadding="10">

 <thead>
 <tr>
  {showStudentId && <th>Student ID</th>}
  <th>Name</th>
  <th>Email</th>
  <th>Role</th>
  <th>Action</th>
 </tr>
 </thead>

 <tbody>

 {paginatedUsers.map(u=>(
  <tr key={u._id}>

   {showStudentId && (
    <td>
     <span className="id-badge">
      {u.studentId || "-"}
     </span>
    </td>
   )}

   <td>{u.name}</td>
   <td>{u.email}</td>
   <td>{u.role}</td>

   <td>
    <div className="action-buttons">

     <button onClick={()=>setEditUser(u)}>
      Edit
     </button>

     {showInactive ? (
      <button onClick={()=>restoreUser(u._id)}>
       Restore
      </button>
     ) : (
      <button onClick={()=>deleteUser(u._id)}>
       Deactivate
      </button>
     )}

    </div>
   </td>
 
  </tr>
 ))}

 </tbody>

 </table>

 <div className="pagination-admin">

  <button 
   disabled={page === 1}
   onClick={()=>setPage(page-1)}
  >
   Prev
  </button>

  
   Page {page} of {totalPages}

  <button 
   disabled={page === totalPages}
   onClick={()=>setPage(page+1)}
  >
   Next
  </button>

 </div>

 </div>

 )
}