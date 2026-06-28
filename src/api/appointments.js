import client from "./client";

export const createAppointment  = (data) => client.post("/appointment", data);
export const getMyAppointments  = ()     => client.get("/appointment/my");
export const getAllAppointments  = ()     => client.get("/appointment");
export const updateStatus       = (id, data) => client.put(`/appointment/${id}/status`, data);
export const cancelAppointment  = (id)   => client.put(`/appointment/${id}/cancel`);