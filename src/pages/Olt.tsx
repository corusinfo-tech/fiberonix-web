import { useEffect, useState } from "react";
import { NetworkLayout } from "@/components/NetworkLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from "react-hot-toast";
import { fetchOffices } from "@/services/api";
import {
  fetchRoutesByOffice,
  fetchCustomers,
  fetchDevices,
  fetchJunctions,
  updateOffice,
  deleteOffice,
} from "@/services/api";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon issue (for webpack/Next.js)
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Default icon (just in case)
const defaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Custom icons
const customerIcon = L.divIcon({
  html: `<span class="material-icons" style="
    font-size: 32px;
    color: black;
    padding: 4px;
  ">person_pin_circle</span>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const junctionIcon = L.icon({
  iconUrl: "/icons/junction.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const getDeviceIcon = (type) => {
  let iconName = "device_unknown";

  switch (type?.toLowerCase()) {
    case "splitter":
      iconName = "call_split";
      break;
    case "coupler":
      iconName = "merge_type";
      break;
    case "olt":
      iconName = "sync";
      break;
    case "ont":
      iconName = "dashboard_customize";
      break;
  }

  return L.divIcon({
    html: `<span class="material-icons" style="
      font-size: 28px;
      color: black;
      
      
      padding: 4px;
      
    ">${iconName}</span>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

const oltIcon = L.icon({
  iconUrl: "/icons/olt.png",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

export default function Offices() {
  const [offices, setOffices] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [allDevices, setAllDevices] = useState([]);
  const [devices, setDevices] = useState([]);

  const [allJunctions, setAllJunctions] = useState([]);
  const [junctions, setJunctions] = useState([]);

  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Modals
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapData, setMapData] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const openMapModal = async (office) => {
    setLoading(true);
    setMapData(office);

    try {
      // Routes
      try {
        const routesData = await fetchRoutesByOffice(office.id);
        setRoutes(Array.isArray(routesData) ? routesData : []);
      } catch (err) {
        setRoutes([]); // fallback
        toast.error("Failed to load routes for this office");
      }

      // Customers
      try {
        const customersData = await fetchCustomers(office.id);
        setCustomers(Array.isArray(customersData) ? customersData : []);
      } catch (err) {
        setCustomers([]);
        toast.error("Failed to load customers for this office");
      }

      // Devices
      const devicesForOffice = allDevices.filter((d) => d.office === office.id);
      setDevices(Array.isArray(devicesForOffice) ? devicesForOffice : []);

      // Junctions
      const junctionsForOffice = allJunctions.filter(
        (j) => j.office === office.id
      );
      setJunctions(Array.isArray(junctionsForOffice) ? junctionsForOffice : []);

      setIsMapOpen(true);
    } catch (err) {
      toast.error("Error loading map data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const res = await fetchOffices();
        setOffices(res || []);
      } catch (error) {
        console.error("Error fetching olt:", error);
        toast.error("Failed to load olt");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const res = await fetchDevices();
        setAllDevices(res.results || []);
      } catch (e) {
        toast.error("Failed to load devices");
      }
    };
    loadDevices();
  }, []);

  useEffect(() => {
    const loadJunctions = async () => {
      try {
        const res = await fetchJunctions();
        setAllJunctions(res.results || res); // depends on your API structure
      } catch (e) {
        toast.error("Failed to load junctions");
      }
    };
    loadJunctions();
  }, []);

  // Filter by search
  const filteredOffices = offices.filter((o) => {
    const term = searchTerm.toLowerCase();
    return (
      o.name?.toLowerCase().includes(term) ||
      o.address?.toLowerCase().includes(term) ||
      //   o.latitude?.toString().toLowerCase().includes(term) ||
      //   o.longitude?.toString().toLowerCase().includes(term) ||
      new Date(o.created_at).toLocaleString().toLowerCase().includes(term)
    );
  });

  // Paginate
  const paginatedOffices = filteredOffices.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(filteredOffices.length / pageSize);

  const openViewModal = (office) => {
    setViewData(office);
    setIsViewOpen(true);
  };

  const openEditModal = (office) => {
    setEditData({ ...office });
    setIsEditOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this office?")) return;
    try {
      await deleteOffice(id);
      setOffices((prev) => prev.filter((o) => o.id !== id));
      toast.success("Office deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete office");
    }
  };

  if (loading) {
    return (
      <NetworkLayout>
        <div className="flex items-center justify-center h-64">
          <p>Loading olt's...</p>
        </div>
      </NetworkLayout>
    );
  }

  return (
    <NetworkLayout>
      <Toaster position="top-right" reverseOrder={false} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">OLT Management</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage your network OLTs
            </p>
          </div>
          <Button className="bg-gradient-primary hover:opacity-90 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" /> Add OLT
          </Button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search OLT's..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Offices Table */}
        <Card className="shadow-elegant">
          <CardContent className="p-0">
            {/* Desktop Table */}
            <div className="hidden sm:block w-full overflow-x-auto">
              <table className="min-w-[900px] w-full text-sm border-collapse">
                <thead className="sticky top-0 z-10 bg-background shadow-sm">
                  <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Address</th>
                    {/* <th className="px-4 py-3 text-left">Latitude</th> */}
                    {/* <th className="px-4 py-3 text-left">Longitude</th> */}
                    <th className="px-4 py-3 text-left">Created At</th>
                    <th className="px-4 py-3 text-center w-[50px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOffices.map((office, idx) => (
                    <tr
                      key={office.id}
                      className={`transition-colors hover:bg-muted/40 ${
                        idx % 2 === 0 ? "bg-muted/20" : "bg-background"
                      }`}
                    >
                      <td className="px-4 py-3 font-medium">{office.name}</td>
                      <td className="px-4 py-3">{office.address}</td>
                      {/* <td className="px-4 py-3">{office.latitude}</td> */}
                      {/* <td className="px-4 py-3">{office.longitude}</td> */}
                      <td className="px-4 py-3">
                        {new Date(office.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openViewModal(office)}
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openEditModal(office)}
                            >
                              Edit OLT
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openMapModal(office)}
                            >
                              Show on Map
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(office.id)} // <-- use office.id here
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="block sm:hidden space-y-4 p-4">
              {paginatedOffices.map((office) => (
                <Card key={office.id} className="shadow-md">
                  <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                      <CardTitle>{office.name}</CardTitle>
                      <CardDescription>{office.address}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openViewModal(office)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(office)}>
                          Edit OLT
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openMapModal(office)}>
                          Show on Map
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(office.id)} // <-- use office.id here
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    {/* <p><strong>Lat:</strong> {office.latitude}</p> */}
                    {/* <p><strong>Lng:</strong> {office.longitude}</p> */}
                    <p>
                      <strong>Created:</strong>{" "}
                      {new Date(office.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center p-4 border-t">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                >
                  ≪
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ‹
                </Button>
                <span className="text-sm">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  ›
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                >
                  ≫
                </Button>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(val) => {
                    setPageSize(Number(val));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg w-[95%] rounded-xl">
          <DialogHeader>
            <DialogTitle>OLT Details</DialogTitle>
          </DialogHeader>
          {viewData && (
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div>
                <strong>Name:</strong> {viewData.name}
              </div>
              <div>
                <strong>Address:</strong> {viewData.address}
              </div>
              {/* <div><strong>Latitude:</strong> {viewData.latitude}</div> */}
              {/* <div><strong>Longitude:</strong> {viewData.longitude}</div> */}
              <div>
                <strong>Created At:</strong>{" "}
                {new Date(viewData.created_at).toLocaleDateString()}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg w-[95%] rounded-xl">
          <DialogHeader>
            <DialogTitle>Edit OLT</DialogTitle>
          </DialogHeader>
          {editData && (
            <div className="space-y-3">
              <div>
                <Label>Name</Label>
                <Input
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  value={editData.address}
                  onChange={(e) =>
                    setEditData({ ...editData, address: e.target.value })
                  }
                />
              </div>
              {/* <div>
                <Label>Latitude</Label>
                <Input value={editData.latitude} onChange={(e) => setEditData({ ...editData, latitude: e.target.value })} />
              </div> */}
              {/* <div>
                <Label>Longitude</Label>
                <Input value={editData.longitude} onChange={(e) => setEditData({ ...editData, longitude: e.target.value })} />
              </div> */}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                try {
                  const updatedOffice = await updateOffice(
                    editData.id,
                    editData
                  );

                  // Update offices state instead of devices
                  setOffices((prev) =>
                    prev.map((office) =>
                      office.id === updatedOffice.id ? updatedOffice : office
                    )
                  );

                  toast.success("Office updated successfully");
                  setIsEditOpen(false);
                } catch (error) {
                  console.error(error);
                  toast.error("Failed to update office");
                }
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent
          className="max-w-4xl w-[95%] h-[80vh] p-0 relative rounded-xl overflow-hidden flex flex-col"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            position: "fixed",
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsMapOpen(false)}
            className="absolute top-3 right-3 z-[1000] bg-white rounded-full shadow p-2 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>

          {/* Map fills entire modal */}
          {mapData && (
            <div className="flex-1">
              <MapContainer
                center={[mapData.latitude, mapData.longitude]}
                zoom={13}
                style={{ width: "100%", height: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <Marker
                  position={[mapData.latitude, mapData.longitude]}
                  icon={oltIcon}
                >
                  <Popup>
                    <b>{mapData.name}</b> <br /> {mapData.address}
                  </Popup>
                </Marker>

                {/* Routes */}
                {Array.isArray(routes) &&
                  routes.map((route) => (
                    <Polyline
                      key={route.id}
                      positions={route.path.map((p) => [
                        p.latitude,
                        p.longitude,
                      ])}
                      pathOptions={{ color: "black", weight: 4 }}
                    />
                  ))}

                {/* Customers */}
                {Array.isArray(customers) &&
                  customers.map((cust) => (
                    <Marker
                      key={cust.id}
                      position={[cust.latitude, cust.longitude]}
                      icon={customerIcon}
                    >
                      <Popup>
                        <b>{cust.name}</b> <br /> {cust.address}
                      </Popup>
                    </Marker>
                  ))}

                {/* Junctions */}
                {Array.isArray(junctions) &&
                  junctions.map((junction) => (
                    <Marker
                      key={junction.id}
                      position={[junction.latitude, junction.longitude]}
                      icon={junctionIcon}
                    >
                      <Popup>
                        <b>{junction.name}</b> <br />
                        {junction.description || "No description"}
                      </Popup>
                    </Marker>
                  ))}

                {/* Devices */}
                {Array.isArray(devices) &&
                  devices.map((device) => (
                    <Marker
                      key={device.id}
                      position={[device.latitude, device.logitutde]}
                      icon={getDeviceIcon(device.device_type)}
                    >
                      <Popup>
                        <b>
                          {device.device_type} - {device.model_name}
                        </b>
                        <br />
                        {device.description || "No description"}
                      </Popup>
                    </Marker>
                  ))}
              </MapContainer>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </NetworkLayout>
  );
}
