import { Route, Routes } from "react-router-dom"
import { Dashboard } from "../page/Dashboard"
import { EditProfile } from "../page/EditProfile"
import { Login } from "../page/Login"
import { Register } from "../page/Register"
import { Schedules } from "../page/Schedules"
import { PrivateRoute } from "./PrivateRoutes"

export const RouteApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/schedules" element={<PrivateRoute><Schedules /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
    </Routes>
  )
}