// src/services/api.js
import axios from "axios";
import { recordActivity, getCurrentUserKey } from "./activityLog";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach interceptor to record mutating activities
api.interceptors.response.use(
  (response) => {
    try {
      const method = (response.config?.method || "").toLowerCase();
      if (method === "post" || method === "put" || method === "delete") {
        const url = String(response.config?.url || "");
        const action = method === "post" ? "created" : method === "put" ? "updated" : "deleted";

        const resource = inferResource(url);
        const title = `${capitalize(resource)} ${action}`;
        const description = `A ${resource} was ${action}.`;

        const userKey = getCurrentUserKey();
        const name = localStorage.getItem("authName") || "System";

        recordActivity(
          {
            type: resource,
            action,
            title,
            description,
            user: name,
          },
          userKey
        );
      }
    } catch {
      // non-blocking
    }
    return response;
  },
  (error) => Promise.reject(error)
);

function inferResource(url) {
  if (url.includes("/network-device/networkdevice")) return "device";
  if (url.includes("/customer/")) return "customer";
  if (url.includes("/junction/")) return "junction";
  if (url.includes("/office/branch")) return "sub office";
  if (url.includes("/office/")) return "OLT";
  if (url.includes("/route/")) return "route";
  if (url.includes("/opticalfiber/company/staffs")) return "staff";
  return "item";
}

function capitalize(s) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// REGISTER COMPANY + ADMIN
export const registerCompanyAdmin = async (payload) => {
  const { data } = await api.post("/opticalfiber/register/", payload);
  return data;
};

// LOGIN
export const loginUser = async (credentials) => {
  const { data } = await api.post("/opticalfiber/login/", credentials);
  return data; 
};

// CREATE NEW DEVICE
export const createDevice = async (payload) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.post("/network-device/networkdevice/", payload, {
    headers: { Authorization: `${token}` },
  });
  
  return data;
};


// FETCH NETWORK DEVICES
export const fetchDevices = async () => {
  const token = localStorage.getItem("authToken"); // if authentication is required
  const { data } = await api.get("/network-device/networkdevice/", {
    headers: { Authorization: `${token}` },
  });
  return data;
};

// DELETE DEVICE
export const deleteDevice = async (id) => {
  const token = localStorage.getItem("authToken");
  await api.delete(`/network-device/networkdevice/${id}/delete/`, {
    headers: { Authorization: `${token}` },
  });
};

// UPDATE DEVICE
export const updateDevice = async (id, payload) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.put(`/network-device/networkdevice/${id}/update/`, payload, {
    headers: { Authorization: `${token}` },
  });
  return data;
};



// Fetch offices
export const fetchOffices = async () => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.get("/office/add/", {
    headers: { Authorization: `${token}` },
  });
  return data;
};

// UPDATE offices
export const updateOffice = async (id, payload) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.put(`/office/management/${id}/`, payload, {
    headers: { Authorization: `${token}` },
  });
  return data;
};

// CREATE NEW OFFICE
export const createOffice = async (payload) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.post("/office/add/", payload, {
    headers: { Authorization: `${token}` },
  });
  
  return data;
};


// DELETE office
export const deleteOffice = async (id) => {
  const token = localStorage.getItem("authToken");
  await api.delete(`/office/management/${id}/`, {
    headers: { Authorization: `${token}` },
  });
};

// create customer
export const createCustomers = async (payload) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.post("/customer/add/", payload, {
    headers: { Authorization: `${token}` },
  });
  return data;
};

// Fetch customers by office
export const fetchCustomers = async (officeId) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.get(`/customer/list/${officeId}/`, {
    headers: { Authorization: `${token}` },
  });
  return data;
};

// Fetch customers for ALL offices
export const fetchAllCustomers = async () => {
  const token = localStorage.getItem("authToken");
  const offices = await fetchOffices(); // Get all offices
  const customerPromises = offices.map((office) =>
    api
      .get(`/customer/list/${office.id}/`, {
        headers: { Authorization: `${token}` },
      })
      .then((res) =>
        res.data.map((cust) => ({
          ...cust,
          officeName: office.name, // attach office name
        }))
      )
  );
  const allCustomers = await Promise.all(customerPromises);
  return allCustomers.flat();
};

// DELETE CUSTOMER
export const deleteCustomer = async (id) => {
  const token = localStorage.getItem("authToken");
  await api.delete(`/customer/management/${id}/`, {
    headers: { Authorization: `${token}` },
  });
};

// UPDATE CUSTOMER
export const updateCustomer = async (id, payload) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.put(`/customer/management/${id}/`, payload, {
    headers: { Authorization: `${token}` },
  });
  return data;
};

// CREATE JUNCTION
export const createJunction = async (payload) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.post("/junction/add/", payload, {
    headers: { Authorization: `${token}` },
  });
  return data;
};

// FETCH  JUNCTIONS
export const fetchJunctions = async () => {
  const token = localStorage.getItem("authToken"); // if authentication is required
  const { data } = await api.get("/junction/add/", {
    headers: { Authorization: `${token}` },
  });
  return data;
};

// DELETE JUNCTION
export const deleteJunction = async (id) => {
  const token = localStorage.getItem("authToken");
  await api.delete(`/junction/get/${id}/delete/`, {
    headers: { Authorization: `${token}` },
  });
};

// UPDATE JUNCTION
export const updateJunction = async (id, payload) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.put(`/junction/get/${id}/update/`, payload, {
    headers: { Authorization: `${token}` },
  });
  return data;
};

// FETCH ROUTES BY OFFICE
export const fetchRoutesByOffice = async (officeId) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.get(`/route/list/${officeId}/`, {
    headers: { Authorization: `${token}` },
  });
  return data;
};

// CREATE route
export const createRoute = async (payload) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.post("/route/add/", payload, {
    headers: { Authorization: `${token}` },
  });
  return data;
};



// CREATE suboffice
export const createSub = async (payload) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.post("/office/branch/add/", payload, {
    headers: { Authorization: `${token}` },
  });
  return data;
};

// Fetch sub office
export const fetchSub = async () => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.get("/office/branch/add/", {
    headers: { Authorization: `${token}` },
  });
  return data;
};

// DELETE suboffice
export const deleteSub = async (id) => {
  const token = localStorage.getItem("authToken");
  await api.delete(`/office/branch/management/${id}/`, {
    headers: { Authorization: `${token}` },
  });
};


// UPDATE suboffice
export const updateSub = async (id, payload) => {
  const token = localStorage.getItem("authToken");
  const { data } = await api.put(`/office/branch/management/${id}/`, payload, {
    headers: { Authorization: `${token}` },
  });
  return data;
};


// FETCH STAFFS UNDER COMPANY
export const fetchStaffs = async () => {
  const token = localStorage.getItem("authToken");
  const response = await api.get("/opticalfiber/company/staffs/", {
    headers: { Authorization: `${token}` },
  });

  return response.data.data.staffs; // Extract only the staff list
};

export const createStaff = async (payload) => {
  const token = localStorage.getItem("authToken"); 
  const { data } = await api.post("/opticalfiber/company/staffs/", payload, {
    headers: {
      Authorization: ` ${token}`,
    },
  });
  return data;
};



// FORGOT PASSWORD - Send OTP
export const forgotPassword = async (email) => {
  const { data } = await api.post(
    "/opticalfiber/forgot/password/",
    { email },
    { headers: { Accept: "application/json" } }
  );
  return data;
};

// VERIFY OTP
export const verifyOtp = async (email, otp) => {
  const { data } = await api.post(
    "/opticalfiber/verify/otp/",
    { email, otp: otp.toString() },
    { headers: { Accept: "application/json" } }
  );
  return data;
};

// RESET PASSWORD
export const resetPassword = async (email, newPassword) => {
  const { data } = await api.post(
    "/opticalfiber/reset/password/",
    { email, new_password: newPassword },
    { headers: { "Content-Type": "application/json" } }
  );
  return data;
};




export default api;
