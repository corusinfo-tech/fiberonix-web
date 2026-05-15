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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import { X } from "lucide-react";

import {
  Plus,
  Search,
  MoreVertical,
  Cpu,
  Router,
  Activity,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  MdDeviceUnknown,
  MdCallSplit,
  MdMergeType,
  MdSync,
  MdDashboardCustomize,
} from "react-icons/md";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import {
  fetchDevices,
  fetchOffices,
  fetchCustomers,
  fetchJunctions,
  fetchSub,
  fetchRoutesByOffice,
} from "@/services/api";
import { deleteDevice } from "@/services/api";
import { updateDevice } from "@/services/api";
import toast, { Toaster } from "react-hot-toast";

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

const subOfficeIcon = L.divIcon({
  html: `<span class="material-icons" style="
    font-size: 30px;
    color: black;
    padding: 4px;
  ">apartment</span>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const DeviceIcon = ({ type, className = "w-5 h-5 text-primary" }) => {
  switch (type?.toLowerCase()) {
    case "splitter":
      return <MdCallSplit className={className} />;
    case "coupler":
      return <MdMergeType className={className} />;
    case "olt":
      return <MdSync className={className} />;
    case "ont":
      return <MdDashboardCustomize className={className} />;
    default:
      return <MdDeviceUnknown className={className} />;
  }
};

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [offices, setOffices] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapData, setMapData] = useState(null);
  const [officeLocation, setOfficeLocation] = useState(null);
  const [relatedDevices, setRelatedDevices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [junctions, setJunctions] = useState([]);
  const [subOffices, setSubOffices] = useState([]);

  const [routes, setRoutes] = useState([]);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [loading, setLoading] = useState(true);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const openViewModal = (device) => {
    setViewData(device);
    setIsViewOpen(true);
  };

  // Derived data
  const [filteredDevices, setFilteredDevices] = useState([]);

  const openEditModal = (device) => {
    setEditData({ ...device }); // Pre-fill data
    setIsEditOpen(true);
  };

  const openMapModal = async (device) => {
    setMapData(device);
    setIsMapOpen(true);

    // Find office details
    const office = offices.find((o) => o.id === device.office);
    if (office) {
      setOfficeLocation({
        id: office.id,
        name: office.name,
        latitude: office.latitude,
        longitude: office.longitude,
      });
    } else {
      setOfficeLocation(null);
    }

    // Other devices in same office (excluding the selected one)
    const officeDevices = devices.filter(
      (d) => d.office === device.office && d.id !== device.id
    );
    setRelatedDevices(officeDevices);

    // Fetch customers
    try {
      const customersData = await fetchCustomers(device.office);
      setCustomers(customersData || []);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      setCustomers([]);
    }

    // Fetch junctions
    try {
      const allJunctions = await fetchJunctions();
      const filteredJunctions = Array.isArray(allJunctions)
        ? allJunctions.filter((j) => j.office === device.office)
        : allJunctions.results?.filter((j) => j.office === device.office) || [];
      setJunctions(filteredJunctions);
    } catch (error) {
      console.error("Failed to fetch junctions:", error);
      setJunctions([]);
    }

    // Fetch routes
    try {
      const routesData = await fetchRoutesByOffice(device.office);
      setRoutes(routesData || []);
    } catch (error) {
      console.error("Failed to fetch routes:", error);
      setRoutes([]);
    }

    // **Fetch sub-offices**
    try {
      const subRes = await fetchSub();
      const filteredSub = (
        Array.isArray(subRes) ? subRes : subRes.results || []
      ).filter((s) => s.office === device.office);
      setSubOffices(filteredSub);
    } catch (error) {
      console.error("Failed to fetch sub-offices:", error);
      setSubOffices([]);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const [deviceRes, officeRes] = await Promise.all([
          fetchDevices(),
          fetchOffices(),
        ]);
        setDevices(deviceRes || []);
        setOffices(officeRes || []);
      } catch (error) {
        console.error("Error fetching data:", error.response || error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  // Filter when office changes
  useEffect(() => {
    let filtered = devices;

    // Filter by office
    if (selectedOffice !== "all") {
      filtered = filtered.filter((d) => d.office === parseInt(selectedOffice));
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.model_name?.toLowerCase().includes(term) ||
          d.device_type?.toLowerCase().includes(term) ||
          d.description?.toLowerCase().includes(term)
      );
    }

    setFilteredDevices(filtered);
    setPage(1); // Reset to first page on filter change
  }, [selectedOffice, searchTerm, devices]);

  // Slice for current page
  const paginatedDevices = filteredDevices.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(filteredDevices.length / pageSize);

  // const getDeviceIcon = (type: string) => {
  //   switch (type) {
  //     case "Splitter":
  //       return Cpu;
  //     case "Router":
  //     case "Media Converter":
  //       return Router;
  //     default:
  //       return Activity;
  //   }
  // };

  const getOfficeName = (officeId: number) => {
    const office = offices.find((o) => o.id === officeId);
    return office ? office.name : "Unknown Office";
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this device?")) return;
    try {
      await deleteDevice(id);
      setDevices((prev) => prev.filter((d) => d.id !== id));
      toast.success("Device deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete device");
    }
  };

  if (loading) {
    return (
      <NetworkLayout>
        <div className="flex items-center justify-center h-64">
          <p>Loading devices...</p>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Device Management
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Monitor and manage all network devices
            </p>
          </div>
          {/* <Button className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Device
          </Button> */}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="w-full sm:w-64">
            <Select
              onValueChange={(val) => setSelectedOffice(val)}
              defaultValue="all"
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Office" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All OLT's</SelectItem>
                {offices.map((office) => (
                  <SelectItem key={office.id} value={office.id.toString()}>
                    {office.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search devices..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Devices Table */}
        <Card className="shadow-elegant backdrop-blur-sm bg-card/95">
          <CardContent className="p-0">
            {/* Desktop Table View */}
            <div className="hidden sm:block w-full overflow-x-auto">
              <table className="min-w-[1100px] w-full text-sm text-left border-collapse">
                <thead className="sticky top-0 z-10 bg-background shadow-sm">
                  <tr className="text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 text-left">Device Type</th>
                    <th className="px-4 py-3 text-left">Model Name</th>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3 text-left">Ratio</th>
                    <th className="px-4 py-3 text-left">Max Speed</th>
                    <th className="px-4 py-3 text-left">Ports</th>
                    <th className="px-4 py-3 text-left">Color</th>
                    <th className="px-4 py-3 text-left">Protocols</th>
                    <th className="px-4 py-3 text-left">Insertion Loss</th>
                    <th className="px-4 py-3 text-left">Return Loss</th>
                    <th className="px-4 py-3 text-left">OLT</th>
                    <th className="px-4 py-3 text-left">Created</th>
                    <th className="px-4 py-3 w-[50px] text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDevices.map((device, idx) => {
                    // const DeviceIcon = getDeviceIcon(device.device_type);
                    return (
                      <tr
                        key={device.id}
                        className={`transition-colors hover:bg-muted/40 ${
                          idx % 2 === 0 ? "bg-muted/20" : "bg-background"
                        }`}
                      >
                        <td className="px-4 py-3 flex items-center gap-3 rounded-l-lg">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <DeviceIcon
                              type={device.device_type}
                              className="w-5 h-5 text-primary"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {device.device_type}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ID: {device.id}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">{device.model_name}</td>
                        <td className="px-4 py-3 max-w-[200px]">
                          <Popover>
                            <PopoverTrigger className=" cursor-pointer hover:underline">
                              {device.description?.length > 20
                                ? `${device.description.slice(0, 20)}...`
                                : device.description}
                            </PopoverTrigger>
                            <PopoverContent className="max-w-sm text-sm">
                              <p className="break-words">
                                {device.description || "No Description"}
                              </p>
                            </PopoverContent>
                          </Popover>
                        </td>

                        <td className="px-4 py-3">{device.ratio}</td>
                        <td className="px-4 py-3">{device.max_speed}</td>
                        <td className="px-4 py-3">{device.port_count}</td>
                        <td className="px-4 py-3">{device.color_coding}</td>
                        <td className="px-4 py-3 max-w-[200px]">
                          <Popover>
                            <PopoverTrigger className=" cursor-pointer hover:underline">
                              {device.supported_protocols?.length > 20
                                ? `${device.supported_protocols.slice(
                                    0,
                                    20
                                  )}...`
                                : device.supported_protocols}
                            </PopoverTrigger>
                            <PopoverContent className="max-w-sm text-sm">
                              <p className="break-words">
                                {device.supported_protocols || "No Description"}
                              </p>
                            </PopoverContent>
                          </Popover>
                        </td>
                        <td className="px-4 py-3">{device.insertion_loss}</td>
                        <td className="px-4 py-3">{device.return_loss}</td>
                        <td className="px-4 py-3">
                          {getOfficeName(device.office)}
                        </td>
                        <td className="px-4 py-3">
                          {new Date(device.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-center rounded-r-lg">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => openViewModal(device)}
                              >
                                View Details
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => openEditModal(device)}
                              >
                                Edit Device
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => openMapModal(device)}
                              >
                                Show on Map
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(device.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-4 p-4">
              {paginatedDevices.map((device) => {
                // const DeviceIcon = getDeviceIcon(device.device_type);
                return (
                  <Card key={device.id} className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <DeviceIcon
                            type={device.device_type}
                            className="w-5 h-5 text-primary"
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {device.model_name}
                          </CardTitle>
                          <CardDescription>
                            {device.device_type} •{" "}
                            {getOfficeName(device.office)}
                          </CardDescription>
                        </div>
                      </div>
                      {/* Actions Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openViewModal(device)}
                          >
                            View Details
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => openEditModal(device)}
                          >
                            Edit Device
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => openMapModal(device)}
                          >
                            Show on Map
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(device.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>

                    <CardContent className="space-y-1 text-sm">
                      <p className="break-all whitespace-normal">
                        <strong>Description:</strong>{" "}
                        {device.description || "N/A"}
                      </p>
                      <p className="break-all whitespace-normal">
                        <strong>Ratio:</strong> {device.ratio}
                      </p>
                      <p className="break-all whitespace-normal">
                        <strong>Max Speed:</strong> {device.max_speed}
                      </p>
                      <p className="break-all whitespace-normal">
                        <strong>Port Count:</strong> {device.port_count}
                      </p>
                      <p className="break-all whitespace-normal">
                        <strong>Color:</strong> {device.color_coding}
                      </p>
                      <p className="break-all whitespace-normal">
                        <strong>Protocols:</strong> {device.supported_protocols}
                      </p>
                      <p className="break-all whitespace-normal">
                        <strong>Insertion Loss:</strong> {device.insertion_loss}
                      </p>
                      <p className="break-all whitespace-normal">
                        <strong>Return Loss:</strong> {device.return_loss}
                      </p>
                      <p className="break-all whitespace-normal">
                        <strong>Created:</strong>{" "}
                        {new Date(device.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center p-4 border-t">
              {/* <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * pageSize + 1}–
                {Math.min(page * pageSize, filteredDevices.length)} of{" "}
                {filteredDevices.length}
              </p> */}
              <div className="flex items-center space-x-2">
                {/* First Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                >
                  ≪
                </Button>

                {/* Previous Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ‹
                </Button>

                {/* Page Info */}
                <span className="text-sm">
                  Page {page} of {totalPages}
                </span>

                {/* Next Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  ›
                </Button>

                {/* Last Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                >
                  ≫
                </Button>

                {/* Page Size Selector */}
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
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg w-[95%] sm:w-full sm:max-w-2xl mx-auto rounded-xl">
          <DialogHeader>
            <DialogTitle>Edit Device</DialogTitle>
          </DialogHeader>
          {editData && (
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
              {/* <div>
                <Label>Device Type</Label>
                <Input
                  value={editData.device_type}
                  onChange={(e) =>
                    setEditData({ ...editData, device_type: e.target.value })
                  }
                />
              </div> */}
              <div>
                <Label>Model Name</Label>
                <Input
                  value={editData.model_name}
                  onChange={(e) =>
                    setEditData({ ...editData, model_name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Ratio</Label>
                <Input
                  value={editData.ratio}
                  onChange={(e) =>
                    setEditData({ ...editData, ratio: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Max Speed</Label>
                <Input
                  value={editData.max_speed}
                  onChange={(e) =>
                    setEditData({ ...editData, max_speed: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Port Count</Label>
                <Input
                  value={editData.port_count}
                  onChange={(e) =>
                    setEditData({ ...editData, port_count: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Color Coding</Label>
                <Input
                  value={editData.color_coding}
                  onChange={(e) =>
                    setEditData({ ...editData, color_coding: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Supported Protocols</Label>
                <Input
                  value={editData.supported_protocols}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      supported_protocols: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Insertion Loss</Label>
                <Input
                  value={editData.insertion_loss}
                  onChange={(e) =>
                    setEditData({ ...editData, insertion_loss: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Return Loss</Label>
                <Input
                  value={editData.return_loss}
                  onChange={(e) =>
                    setEditData({ ...editData, return_loss: e.target.value })
                  }
                />
              </div>
              {/* OLT field intentionally excluded */}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                try {
                  await updateDevice(editData.id, editData);
                  setDevices((prev) =>
                    prev.map((d) => (d.id === editData.id ? editData : d))
                  );
                  toast.success("Device updated successfully");
                  setIsEditOpen(false);
                } catch (error) {
                  console.error(error);
                  toast.error("Failed to update device");
                }
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg w-[95%] sm:w-full sm:max-w-2xl mx-auto rounded-xl">
          <DialogHeader>
            <DialogTitle>Device Details</DialogTitle>
          </DialogHeader>
          {viewData && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Device Type:</strong>
                <p>{viewData.device_type}</p>
              </div>
              <div>
                <strong>Model Name:</strong>
                <p>{viewData.model_name}</p>
              </div>
              <div className="sm:col-span-2">
                <strong>Description:</strong>
                <p>{viewData.description || "N/A"}</p>
              </div>
              <div>
                <strong>Ratio:</strong>
                <p>{viewData.ratio}</p>
              </div>
              <div>
                <strong>Max Speed:</strong>
                <p>{viewData.max_speed}</p>
              </div>
              <div>
                <strong>Port Count:</strong>
                <p>{viewData.port_count}</p>
              </div>
              <div>
                <strong>Color Coding:</strong>
                <p>{viewData.color_coding}</p>
              </div>
              <div className="sm:col-span-2">
                <strong>Supported Protocols:</strong>
                <p>{viewData.supported_protocols}</p>
              </div>
              <div>
                <strong>Insertion Loss:</strong>
                <p>{viewData.insertion_loss}</p>
              </div>
              <div>
                <strong>Return Loss:</strong>
                <p>{viewData.return_loss}</p>
              </div>
              <div>
                <strong>OLT:</strong>
                <p>{getOfficeName(viewData.office)}</p>
              </div>
              <div>
                <strong>Created At:</strong>
                <p>{new Date(viewData.created_at).toLocaleString()}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Close</Button>
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
                center={[
                  mapData?.latitude ?? officeLocation?.latitude ?? 0,
                  mapData?.logitutde ?? officeLocation?.longitude ?? 0,
                ]}
                zoom={14}
                style={{ width: "100%", height: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />

                {/* Selected Device Marker */}
                {mapData?.latitude && mapData?.logitutde && (
                  <Marker
                    position={[mapData.latitude, mapData.logitutde]}
                    icon={getDeviceIcon(mapData.device_type)}
                  >
                    <Popup>
                      <b>
                        {mapData.device_type} - {mapData.model_name}
                      </b>
                      <br />
                      {mapData.description || "No description"}
                    </Popup>
                  </Marker>
                )}

                {/* Office Marker */}
                {officeLocation?.latitude && officeLocation?.longitude && (
                  <Marker
                    position={[
                      officeLocation.latitude,
                      officeLocation.longitude,
                    ]}
                    icon={oltIcon}
                  >
                    <Popup>
                      <b>OLT: {officeLocation.name}</b>
                    </Popup>
                  </Marker>
                )}

                {/* Other Devices in Same Office */}
                {relatedDevices.map(
                  (dev) =>
                    dev.latitude &&
                    dev.logitutde && (
                      <Marker
                        key={dev.id}
                        position={[dev.latitude, dev.logitutde]}
                        icon={getDeviceIcon(dev.device_type)}
                      >
                        <Popup>
                          <b>
                            {dev.device_type} - {dev.model_name}
                          </b>
                          <br />
                          {dev.description || "No description"}
                        </Popup>
                      </Marker>
                    )
                )}

                {/* Customers Markers */}
                {customers.map(
                  (cust) =>
                    cust.latitude &&
                    cust.longitude && (
                      <Marker
                        key={cust.id}
                        position={[cust.latitude, cust.longitude]}
                        icon={customerIcon}
                      >
                        <Popup>
                          <b>{cust.name}</b> <br />
                          {cust.address || "No address"}
                        </Popup>
                      </Marker>
                    )
                )}

                {/* Sub-Offices */}
                {subOffices.map(
                  (sub) =>
                    sub.latitude &&
                    sub.logitude && (
                      <Marker
                        key={sub.id}
                        position={[sub.latitude, sub.logitude]}
                        icon={subOfficeIcon}
                      >
                        <Popup>
                          <b>{sub.name}</b>
                          <br />
                          {sub.address || "No address"}
                        </Popup>
                      </Marker>
                    )
                )}

                {/* Junctions Markers */}
                {junctions.map(
                  (junction) =>
                    junction.latitude &&
                    junction.longitude && (
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
                    )
                )}

                {/* Routes Polylines */}
                {routes.map((route) => {
                  const validPoints = route.path.filter(
                    (p) => p.latitude && p.longitude
                  );
                  return (
                    validPoints.length > 1 && (
                      <Polyline
                        key={route.id}
                        positions={validPoints.map((p) => [
                          p.latitude,
                          p.longitude,
                        ])}
                        pathOptions={{ color: "black", weight: 4 }}
                      />
                    )
                  );
                })}
              </MapContainer>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </NetworkLayout>
  );
}
