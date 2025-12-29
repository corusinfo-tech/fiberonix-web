import { useEffect, useRef, useState } from "react";
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
  Map,
  MapPin,
  Router,
  Users,
  Zap,
  Share2,
  Building2,
  Trash,
  Trash2,
  MousePointer2,
  PencilLine,
  LineChart,
  Check,
  RotateCcw,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
  useMap,
  useMapEvents,
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
  fetchSub,
  updateOffice,
  deleteOffice,
  createOffice,
  deleteDevice,
  deleteCustomer,
  deleteJunction,
  deleteSub,
  updateDevice,
  updateSub,
} from "@/services/api";

import JunctionFormDialog from "@/components/JunctionFormDialog";
import DeviceFormDialog from "@/components/DeviceFormDialog";
import SubOfficeFormDialog from "@/components/SubOfficeFormDialog";
import CustomerFormDialog from "@/components/CustomerFormDialog";
import RouteFormDialog from "@/components/RouteFormDialog";

import DeviceEditDialog from "@/components/DeviceEditDialog";
import SubOfficeEditDialog from "@/components/SubOfficeEditDialog";
import EditJunctionModal from "@/components/EditJunctionModal";
import EditCustomerModal from "@/components/EditCustomerModal";

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

// Customer icons
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

// suboffice icons
const subOfficeIcon = L.divIcon({
  html: `<span class="material-icons" style="
    font-size: 30px;
    color: black; /* Blue for sub-offices */
    padding: 4px;
  ">apartment</span>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Junction icons
const junctionIcon = L.icon({
  iconUrl: "/icons/junction.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

// Device icons
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

// OLT icons
const oltIcon = L.icon({
  iconUrl: "/icons/olt.png",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

export default function Add() {
  const [offices, setOffices] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [allDevices, setAllDevices] = useState([]);

  const [isEditSubOpen, setIsEditSubOpen] = useState(false);
  const [editSubData, setEditSubData] = useState(null);

  const [isEditJunctionOpen, setIsEditJunctionOpen] = useState(false);
  const [editJunctionData, setEditJunctionData] = useState(null);

  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
  const [editCustomerData, setEditCustomerData] = useState(null);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null); // "device" | "customer" | "junction" | "sub"

  const [devices, setDevices] = useState([]);

  const [allJunctions, setAllJunctions] = useState([]);
  const [junctions, setJunctions] = useState([]);

  const [allSub, setAllSub] = useState([]);
  const [sub, setSub] = useState([]);

  const [customers, setCustomers] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Modals
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapData, setMapData] = useState(null);

  // For Add OLT Map Modal
  const [isAddMapOpen, setIsAddMapOpen] = useState(false);
  const [clickedLatLng, setClickedLatLng] = useState(null);

  // For OLT Form Modal
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newOffice, setNewOffice] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [userLocation, setUserLocation] = useState([10.0, 76.0]); // default Kochi

  // For junction form
  const [isPlacingJunction, setIsPlacingJunction] = useState(false);
  const [isAddJunctionFormOpen, setIsAddJunctionFormOpen] = useState(false);
  const [clickedJunctionLatLng, setClickedJunctionLatLng] = useState(null);

  const [newJunction, setNewJunction] = useState({
    name: "",
    post_code: "",
    junction_type: "Child", // Default
    latitude: "",
    longitude: "",
  });

  const resetJunctionForm = () => {
    setNewJunction({
      name: "",
      post_code: "",
      junction_type: "Child",
      latitude: "",
      longitude: "",
    });
    setClickedJunctionLatLng(null);
  };

  // for route form

  const [isPlacingRoute, setIsPlacingRoute] = useState(false);
  const [routePoints, setRoutePoints] = useState([]);
  const [isAddRouteModalOpen, setIsAddRouteModalOpen] = useState(false);
  const [newRoute, setNewRoute] = useState({ name: "", description: "" });

  const resetDrawing = () => {
    setIsPlacingRoute(false);
    setIsPlacingJunction(false);
    setIsPlacingCustomer(false);
    setIsPlacingSub(false);
    setIsPlacingDevice(false);
    setIsFreeDrawing(false);
    setRoutePoints([]);
    setFreeDrawPoints([]);

    // Remove freehand polylines from map
    strokeLayers.forEach((layer) => {
      if (layer && layer.remove) layer.remove();
    });
    setStrokeLayers([]);
    setFreeDrawStrokes([]);

    // Re-enable map drag
    const mapEl = document.querySelector(".leaflet-container")?._leaflet_map;
    if (mapEl && mapEl.dragging) mapEl.dragging.enable();
  };

  // free draw route
  const [isFreeDrawing, setIsFreeDrawing] = useState(false);
  const [freeDrawPoints, setFreeDrawPoints] = useState([]);
  const [freeDrawStrokes, setFreeDrawStrokes] = useState([]); // Each stroke is an array of points
  const [strokeLayers, setStrokeLayers] = useState([]); // To track Leaflet polylines

  function FreeDrawHandler({ isDrawing, setStrokes, setStrokeLayers }) {
    const isDrawingRef = useRef(false);
    const polylineRef = useRef(null);
    const currentStrokeRef = useRef([]);
    const map = useMapEvents({
      mousedown(e) {
        if (!isDrawing) return;
        isDrawingRef.current = true;
        currentStrokeRef.current = [[e.latlng.lat, e.latlng.lng]];

        polylineRef.current = L.polyline(currentStrokeRef.current, {
          color: "red",
          weight: 3,
        }).addTo(map);

        map.dragging.disable();
      },
      mousemove(e) {
        if (!isDrawingRef.current) return;
        currentStrokeRef.current.push([e.latlng.lat, e.latlng.lng]);
        if (polylineRef.current) {
          polylineRef.current.setLatLngs(currentStrokeRef.current);
        }
      },
      mouseup() {
        if (!isDrawingRef.current) return;
        isDrawingRef.current = false;
        map.dragging.enable();

        // Save stroke points & track layer for removal
        setStrokes((prev) => [...prev, currentStrokeRef.current]);
        setStrokeLayers((prev) => [...prev, polylineRef.current]);
      },
      mouseout() {
        if (isDrawingRef.current) {
          isDrawingRef.current = false;
          map.dragging.enable();
          setStrokes((prev) => [...prev, currentStrokeRef.current]);
          setStrokeLayers((prev) => [...prev, polylineRef.current]);
        }
      },
    });

    useEffect(() => {
      if (!isDrawing) map.dragging.enable();
    }, [isDrawing, map]);

    return null;
  }

  // For junction form
  // Customer form state
  const [isPlacingCustomer, setIsPlacingCustomer] = useState(false);
  const [isAddCustomerFormOpen, setIsAddCustomerFormOpen] = useState(false);
  const [clickedCustomerLatLng, setClickedCustomerLatLng] = useState(null);

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const resetCustomerForm = () => {
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
      latitude: "",
      longitude: "",
    });
    setClickedCustomerLatLng(null);
  };

  // For sub office form
  const [isPlacingSub, setIsPlacingSub] = useState(false);
  const [isAddSubFormOpen, setIsAddSubFormOpen] = useState(false);
  const [clickedSubLatLng, setClickedSubLatLng] = useState(null);

  // State for Sub Office form
  const [newSub, setNewSub] = useState({
    name: "",
    address: "",
    latitude: "",
    logitude: "",
  });

  // Reset function for Sub Office form
  const resetSubForm = () => {
    setNewSub({
      name: "",
      address: "",
      latitude: "",
      logitude: "",
    });
    setClickedSubLatLng(null); // if you're tracking map clicks
  };

  // For device form
  const [isPlacingDevice, setIsPlacingDevice] = useState(false);
  const [isAddDeviceFormOpen, setIsAddDeviceFormOpen] = useState(false);
  const [clickedDeviceLatLng, setClickedDeviceLatLng] = useState(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  const [newDevice, setNewDevice] = useState({
    device_type: "",
    model_name: "",
    description: "",
    ratio: "",
    max_speed: "",
    color_coding: "",
    insertion_loss: "",
    return_loss: "",
    port_count: "",
    supported_protocols: "",
    latitude: "",
    logitutde: "",
  });

  const resetDeviceForm = () => {
    setNewDevice({
      device_type: "",
      model_name: "",
      description: "",
      ratio: "",
      max_speed: "",
      color_coding: "",
      insertion_loss: "",
      return_loss: "",
      port_count: "",
      supported_protocols: "",
      latitude: "",
      logitutde: "",
    });
    setClickedDeviceLatLng(null);
  };

  function CursorHandler({ mode }) {
    const map = useMap();

    useEffect(() => {
      const container = map.getContainer();

      if (mode === "draw") {
        container.style.cursor =
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'><path fill='black' d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83l3.75 3.75 1.83-1.83z'/></svg>\") 0 24, crosshair";
      } else if (mode === "free") {
        container.style.cursor =
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'><path fill='black' d='M3 21v-3.75l11.06-11.06l3.75 3.75L6.75 21H3zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83l3.75 3.75l1.83-1.83z'/></svg>\") 0 24, crosshair";
      } else if (mode === "add") {
        container.style.cursor =
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'><path fill='black' d='M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z'/></svg>\") 12 12, pointer";
      } else {
        container.style.cursor = "grab";
      }

      return () => {
        container.style.cursor = "grab";
      };
    }, [mode, map]);

    return null;
  }

  // Click handler
  function MapClickHandler({ onMapClick }) {
    useMapEvents({
      click(e) {
        onMapClick(e.latlng);
        setSelectedItem(null);
        setSelectedType(null);
      },
    });
    return null;
  }

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
        setRoutes([]);
      }

      // Customers
      try {
        const customersData = await fetchCustomers(office.id);
        setCustomers(Array.isArray(customersData) ? customersData : []);
      } catch (err) {
        setCustomers([]);
      }

      // Devices
      const devicesForOffice = allDevices.filter((d) => d.office === office.id);
      setDevices(Array.isArray(devicesForOffice) ? devicesForOffice : []);

      // Junctions
      const junctionsForOffice = allJunctions.filter(
        (j) => j.office === office.id
      );
      setJunctions(Array.isArray(junctionsForOffice) ? junctionsForOffice : []);

      // **Sub-offices**
      try {
        const subRes = await fetchSub();
        const subForOffice = (
          Array.isArray(subRes) ? subRes : subRes.results || []
        ).filter((s) => s.office === office.id);
        setSub(subForOffice);
      } catch (err) {
        setSub([]);
      }

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
        console.error("Error fetching Fiber Route:", error);
        toast.error("Failed to load Fiber Route");
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
        setAllDevices(res.results || []); // <-- Use .results here
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

  // Sort offices by created_at (newest first)
  const sortedOffices = [...offices].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });

  // Filter by search
  const filteredOffices = sortedOffices.filter((o) => {
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
          <p>Loading Fiber Route's...</p>
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
            <h1 className="text-2xl sm:text-3xl font-bold">Fiber Route Management</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage your Fiber Routes
            </p>
          </div>
          <Button
            className="bg-gradient-primary hover:opacity-90 w-full sm:w-auto"
            onClick={() => {
              // Get user's current location
              navigator.geolocation.getCurrentPosition(
                (pos) =>
                  setUserLocation([pos.coords.latitude, pos.coords.longitude]),
                () => toast.error("Unable to get current location")
              );
              setIsAddMapOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Fiber Route
          </Button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Fiber Routes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Offices Table */}
        <Card className="shadow-elegant">
          <CardContent className="p-0">
            {/* Desktop Table */}
            {/* OLT Cards with Map */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {paginatedOffices.map((office) => (
                <Card key={office.id} className="shadow-lg overflow-hidden">
                  {/* Mini Map */}
                  <div
                    className="h-40 w-full relative z-0"
                    onClick={() => openMapModal(office)}
                  >
                    <MapContainer
                      center={[office.latitude, office.longitude]}
                      zoom={14}
                      style={{ height: "100%", width: "100%" }}
                      className="z-0"
                      scrollWheelZoom={false}
                      dragging={false}
                      doubleClickZoom={false}
                      zoomControl={false}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                      />
                      <Marker position={[office.latitude, office.longitude]} />
                    </MapContainer>
                  </div>

                  {/* Card Content */}
                  <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{office.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {office.address}
                      </CardDescription>
                      <p className="text-xs text-muted-foreground">
                        Created:{" "}
                        {new Date(office.created_at).toLocaleDateString()}
                      </p>
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
                          Edit Fiber Route
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openMapModal(office)}>
                          Show on Map
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(office.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
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
            <DialogTitle>Fiber Route Details</DialogTitle>
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
            <DialogTitle>Edit Fiber Route</DialogTitle>
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

      {/* show and add Modal */}
      <Dialog
        open={isMapOpen}
        onOpenChange={(open) => {
          if (!open) {
            resetDrawing();
            setSelectedItem(null);
            setSelectedType(null);
          }
          setIsMapOpen(open);
        }}
      >
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
            onClick={() => {
              resetDrawing();
              setIsMapOpen(false);
              setSelectedItem(null);
              setSelectedType(null);
            }}
            className="absolute top-3 right-3 z-[1000] bg-white rounded-full shadow p-2 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>

          {/* Map fills entire modal */}
          {mapData && (
            <div className="flex-1 relative">
              <MapContainer
                center={[mapData.latitude, mapData.longitude]}
                zoom={13}
                style={{ width: "100%", height: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />

                <CursorHandler
                  mode={
                    isPlacingRoute
                      ? "draw"
                      : isPlacingJunction ||
                        isPlacingCustomer ||
                        isPlacingSub ||
                        isPlacingDevice
                      ? "add"
                      : "default"
                  }
                />

                <CursorHandler
                  mode={
                    isFreeDrawing
                      ? "free"
                      : isPlacingRoute
                      ? "draw"
                      : isPlacingJunction ||
                        isPlacingCustomer ||
                        isPlacingSub ||
                        isPlacingDevice
                      ? "add"
                      : "default"
                  }
                />

                <MapClickHandler
                  onMapClick={(latlng) => {
                    // Route placement
                    if (isPlacingRoute) {
                      setRoutePoints((prev) => [
                        ...prev,
                        [latlng.lat, latlng.lng],
                      ]);
                    }

                    // Junction placement
                    if (isPlacingJunction) {
                      setClickedJunctionLatLng(latlng);
                      setNewJunction({
                        ...newJunction,
                        latitude: latlng.lat,
                        longitude: latlng.lng,
                        office: mapData.id, // attach current office automatically
                      });
                      setIsAddJunctionFormOpen(true);
                      setIsPlacingJunction(false);
                    }
                    if (isPlacingCustomer) {
                      setClickedCustomerLatLng(latlng);
                      setNewCustomer({
                        ...newCustomer,
                        latitude: latlng.lat,
                        longitude: latlng.lng,
                        office: mapData.id,
                      });
                      setIsAddCustomerFormOpen(true);
                      setIsPlacingCustomer(false);
                    }

                    if (isPlacingSub) {
                      setClickedSubLatLng(latlng);
                      setNewSub({
                        ...newSub,
                        latitude: latlng.lat,
                        logitude: latlng.lng, // <-- changed to match backend field
                        office: mapData.id, // attach current office automatically
                      });
                      setIsAddSubFormOpen(true);
                      setIsPlacingSub(false);
                    }

                    if (isPlacingDevice) {
                      // Device placement
                      setClickedDeviceLatLng(latlng);
                      setNewDevice({
                        ...newDevice,
                        latitude: latlng.lat,
                        logitutde: latlng.lng,
                        office: mapData.id,
                      });
                      setIsAddDeviceFormOpen(true);
                      setIsPlacingDevice(false);
                    }
                  }}
                />
                <Marker
                  position={[mapData.latitude, mapData.longitude]}
                  icon={oltIcon}
                >
                  <Popup>
                    <b>{mapData.name}</b> <br /> {mapData.address}
                  </Popup>
                </Marker>

                {/* Temporary new route being drawn */}
                {routePoints.length > 1 && (
                  <Polyline
                    positions={routePoints}
                    pathOptions={{ color: "blue", weight: 4, dashArray: "5,5" }}
                  />
                )}

                {isPlacingRoute &&
                  routePoints.map((point, idx) => (
                    <CircleMarker
                      key={idx}
                      center={point}
                      radius={5}
                      pathOptions={{
                        color: "blue",
                        fillColor: "white",
                        fillOpacity: 1,
                      }}
                    />
                  ))}

                {/* Free-draw handler and live polyline */}
                <FreeDrawHandler
                  isDrawing={isFreeDrawing}
                  setStrokes={setFreeDrawStrokes}
                  setStrokeLayers={setStrokeLayers}
                />

                {freeDrawStrokes.map((stroke, idx) => (
                  <Polyline
                    key={idx}
                    positions={stroke}
                    pathOptions={{ color: "red", weight: 3 }}
                  />
                ))}

                {/* {freeDrawPoints.length > 1 && (
  <Polyline positions={freeDrawPoints} pathOptions={{ color: "red", weight: 3 }} />
)} */}

                {/* Routes */}
                {Array.isArray(routes) &&
                  routes.map((route) => {
                    const validPoints = (route.path || []).filter(
                      (p) =>
                        typeof p.latitude === "number" &&
                        typeof p.longitude === "number" &&
                        !isNaN(p.latitude) &&
                        !isNaN(p.longitude)
                    );

                    if (validPoints.length < 2) return null;

                    return (
                      <Polyline
                        key={route.id}
                        positions={validPoints.map((p) => [
                          p.latitude,
                          p.longitude,
                        ])}
                        pathOptions={{ color: "black", weight: 4 }}
                      />
                    );
                  })}

                {/* Customers */}
                {customers.map((cust) => (
                  <Marker
                    key={cust.id}
                    position={[cust.latitude, cust.longitude]}
                    icon={customerIcon}
                    eventHandlers={{
                      click: () => {
                        setSelectedItem(cust);
                        setSelectedType("customer");
                      },
                    }}
                  >
                    <Popup>
                      <b>{cust.name}</b> <br /> {cust.address}
                    </Popup>
                  </Marker>
                ))}

                {/* Junctions */}
                {junctions.map((junction) => (
                  <Marker
                    key={junction.id}
                    position={[junction.latitude, junction.longitude]}
                    icon={junctionIcon}
                    eventHandlers={{
                      click: () => {
                        setSelectedItem(junction);
                        setSelectedType("junction");
                      },
                    }}
                  >
                    <Popup>
                      <b>{junction.name}</b> <br />
                      {junction.description || "No description"}
                    </Popup>
                  </Marker>
                ))}

                {/* Sub-offices */}
                {sub.map(
                  (s) =>
                    s.latitude &&
                    s.logitude && (
                      <Marker
                        key={s.id}
                        position={[s.latitude, s.logitude]}
                        icon={subOfficeIcon}
                        eventHandlers={{
                          click: () => {
                            setSelectedItem(s);
                            setSelectedType("sub");
                          },
                        }}
                      >
                        <Popup>
                          <b>{s.name}</b>
                          <br />
                          {s.address || "No address"}
                        </Popup>
                      </Marker>
                    )
                )}

                {/* Devices */}
                {devices.map((device) => (
                  <Marker
                    key={device.id}
                    position={[device.latitude, device.logitutde]} // typo from API
                    icon={getDeviceIcon(device.device_type)}
                    eventHandlers={{
                      click: () => {
                        setSelectedItem(device);
                        setSelectedType("device");
                      },
                    }}
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

              {/* TOOLBAR AT BOTTOM */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-md p-2 flex gap-2 z-[1000]">
                <Button
                  className="p-2 h-10 w-10"
                  variant="outline"
                  title="Normal Mode"
                  onClick={() => {
                    resetDrawing(); // <-- This makes it return to default mode
                    toast("Switched to normal mode");
                  }}
                >
                  <MousePointer2 className="w-5 h-5" />
                </Button>

                <Button
                  className={`p-2 h-10 w-10 ${
                    isPlacingRoute ? "bg-blue-100" : ""
                  }`}
                  variant="outline"
                  title="Draw Point-to-Point"
                  onClick={() => {
                    resetDrawing(); // <-- Reset other modes first
                    setRoutePoints([]);
                    setIsPlacingRoute(true);
                    toast(
                      "Click on the map to draw the route. Click 'Finish Route' when done."
                    );
                  }}
                >
                  <LineChart className="w-5 h-5" />
                </Button>

                <Button
                  className={`p-2 h-10 w-10 ${
                    isFreeDrawing ? "bg-blue-100" : ""
                  }`}
                  variant="outline"
                  title="Free Draw"
                  onClick={() => {
                    resetDrawing();
                    setIsFreeDrawing(true);
                    setFreeDrawPoints([]);
                    toast("Click and hold to draw freely on the map");
                  }}
                >
                  <PencilLine className="w-5 h-5" />
                </Button>

                <Button
                  className="p-2 h-10 w-10"
                  variant="outline"
                  title="Add Sub Office"
                  onClick={() => {
                    resetDrawing();
                    setIsPlacingSub(true);
                    toast("Click on the map to place the sub office");
                  }}
                >
                  <Building2 className="w-5 h-5" />
                </Button>
                <Button
                  className="p-2 h-10 w-10"
                  variant="outline"
                  title="Add Junction"
                  onClick={() => {
                    resetDrawing(); // <-- Reset other modes first
                    setIsPlacingJunction(true);
                    toast("Click on the map to place the junction");
                  }}
                >
                  <MapPin className="w-5 h-5" />
                </Button>

                <Button
                  className="p-2 h-10 w-10"
                  variant="outline"
                  title="Add Network Device"
                  onClick={() => {
                    resetDrawing();
                    setIsPlacingDevice(true);
                    toast("Click on the map to place the device");
                  }}
                >
                  <Router className="w-5 h-5" />
                </Button>
                <Button
                  className="p-2 h-10 w-10"
                  variant="outline"
                  title="Add Customer"
                  onClick={() => {
                    resetDrawing();
                    setIsPlacingCustomer(true);
                    toast("Click on the map to place the customer");
                  }}
                >
                  <Users className="w-5 h-5" />
                </Button>

                {isPlacingRoute && routePoints.length > 0 && (
                  <>
                    {/* Undo last point */}
                    <Button
                      className="p-2 h-10 w-10 bg-yellow-500 hover:bg-yellow-600 text-white"
                      variant="default"
                      title="Undo Last Point"
                      onClick={() => {
                        setRoutePoints((prev) => prev.slice(0, -1)); // <-- FIXED: now removes last point
                      }}
                    >
                      <RotateCcw className="w-5 h-5" />
                    </Button>

                    {/* Finish route */}
                    {routePoints.length > 1 && (
                      <Button
                        className="p-2 h-10 w-10 bg-green-500 hover:bg-green-600 text-white"
                        variant="default"
                        title="Finish Route"
                        onClick={() => {
                          setIsAddRouteModalOpen(true);
                          setIsPlacingRoute(false);
                        }}
                      >
                        <Check className="w-5 h-5" />
                      </Button>
                    )}
                  </>
                )}

                {isFreeDrawing && freeDrawStrokes.length > 0 && (
                  <>
                    <Button
                      className="p-2 h-10 w-10 bg-yellow-500 hover:bg-yellow-600 text-white"
                      variant="default"
                      title="Undo Last Stroke"
                      onClick={() => {
                        setFreeDrawStrokes((prev) => prev.slice(0, -1));
                        setStrokeLayers((prev) => {
                          const newLayers = [...prev];
                          const last = newLayers.pop();
                          if (last) last.remove(); // Remove from map
                          return newLayers;
                        });
                      }}
                    >
                      <RotateCcw className="w-5 h-5" />
                    </Button>

                    <Button
                      className="p-2 h-10 w-10 bg-green-500 hover:bg-green-600 text-white"
                      variant="default"
                      title="Finish Free Draw"
                      onClick={() => {
                        // Merge all strokes into one array for backend
                        const merged = freeDrawStrokes.flat();
                        setRoutePoints(merged);
                        setIsAddRouteModalOpen(true);
                        setIsFreeDrawing(false);
                      }}
                    >
                      <Check className="w-5 h-5" />
                    </Button>
                  </>
                )}

                {selectedItem && (
                  <Button
                    className="p-2 h-10 w-10 bg-red-500 hover:bg-red-600 text-white"
                    variant="default"
                    title={`Delete ${selectedType}`}
                    onClick={async () => {
                      if (
                        !confirm(
                          `Are you sure you want to delete this ${selectedType}?`
                        )
                      )
                        return;

                      try {
                        if (selectedType === "device") {
                          await deleteDevice(selectedItem.id);
                          setDevices((prev) =>
                            prev.filter((d) => d.id !== selectedItem.id)
                          );
                          setAllDevices((prev) =>
                            prev.filter((d) => d.id !== selectedItem.id)
                          );
                        } else if (selectedType === "customer") {
                          await deleteCustomer(selectedItem.id);
                          setCustomers((prev) =>
                            prev.filter((c) => c.id !== selectedItem.id)
                          );
                        } else if (selectedType === "junction") {
                          await deleteJunction(selectedItem.id);
                          setJunctions((prev) =>
                            prev.filter((j) => j.id !== selectedItem.id)
                          );
                          setAllJunctions((prev) =>
                            prev.filter((j) => j.id !== selectedItem.id)
                          );
                        } else if (selectedType === "sub") {
                          await deleteSub(selectedItem.id);
                          setSub((prev) =>
                            prev.filter((s) => s.id !== selectedItem.id)
                          );
                        }

                        setSelectedItem(null);
                        setSelectedType(null);
                        toast.success(`${selectedType} deleted successfully`);
                      } catch (err) {
                        toast.error(`Failed to delete ${selectedType}`);
                      }
                    }}
                  >
                    <Trash className="w-5 h-5" />
                  </Button>
                )}

                {selectedType === "device" && (
                  <Button
                    className="p-2 h-10 w-10 bg-blue-500 hover:bg-blue-600 text-white"
                    variant="default"
                    title="Edit Device"
                    onClick={() => {
                      setEditData(selectedItem);
                      setIsEditOpen(true);
                    }}
                  >
                    <PencilLine className="w-5 h-5" />
                  </Button>
                )}

                {selectedType === "sub" && (
                  <Button
                    className="p-2 h-10 w-10 bg-blue-500 hover:bg-blue-600 text-white"
                    variant="default"
                    title="Edit Sub Office"
                    onClick={() => {
                      setEditSubData(selectedItem); // populate sub office form
                      setIsEditSubOpen(true); // open the correct modal
                    }}
                  >
                    <PencilLine className="w-5 h-5" />
                  </Button>
                )}

                {selectedType === "junction" && (
                  <Button
                    className="p-2 h-10 w-10 bg-blue-500 hover:bg-blue-600 text-white"
                    variant="default"
                    title="Edit Junction"
                    onClick={() => {
                      setEditJunctionData(selectedItem);
                      setIsEditJunctionOpen(true);
                    }}
                  >
                    <PencilLine className="w-5 h-5" />
                  </Button>
                )}

                {selectedType === "customer" && (
                  <Button
                    className="p-2 h-10 w-10 bg-blue-500 hover:bg-blue-600 text-white"
                    variant="default"
                    title="Edit Customer"
                    onClick={() => {
                      setEditCustomerData(selectedItem);
                      setIsEditCustomerOpen(true);
                    }}
                  >
                    <PencilLine className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* add olt map Modal */}
      <Dialog
        open={isAddMapOpen}
        onOpenChange={(open) => {
          setIsAddMapOpen(open);
          if (!open) {
            // Clear clicked marker & reset form
            setClickedLatLng(null);
            setNewOffice({
              name: "",
              address: "",
              latitude: "",
              longitude: "",
            });
          }
        }}
      >
        <DialogContent
          className="max-w-4xl w-[95%] h-[80vh] p-0 relative rounded-xl overflow-hidden flex flex-col z-[9999]"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            position: "fixed",
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsAddMapOpen(false)}
            className="absolute top-3 right-3 z-[1000] bg-white rounded-full shadow p-2 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex-1">
            <MapContainer
              center={userLocation}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {/* Current user location */}
              <Marker position={userLocation} icon={defaultIcon}>
                <Popup>Your current location</Popup>
              </Marker>

              {/* Show clicked point if selected */}
              {clickedLatLng && (
                <Marker position={clickedLatLng} icon={oltIcon}>
                  <Popup>Selected Point</Popup>
                </Marker>
              )}

              <FreeDrawHandler
                isDrawing={isFreeDrawing}
                setStrokes={setFreeDrawStrokes}
              />

              {freeDrawPoints.length > 1 && (
                <Polyline
                  positions={freeDrawPoints}
                  pathOptions={{ color: "purple", weight: 3 }}
                />
              )}

              {/* Handle map clicks */}
              <MapClickHandler
                onMapClick={(latlng) => {
                  setClickedLatLng([latlng.lat, latlng.lng]);
                  setNewOffice((prev) => ({
                    ...prev,
                    latitude: latlng.lat,
                    longitude: latlng.lng,
                  }));
                  setIsAddMapOpen(false);
                  setIsAddFormOpen(true);
                }}
              />
            </MapContainer>
          </div>
        </DialogContent>
      </Dialog>

      {/* add olt form modal */}
      <Dialog
        open={isAddFormOpen}
        onOpenChange={(open) => {
          setIsAddFormOpen(open);
          if (!open) {
            // Clear everything if form modal is closed
            setClickedLatLng(null);
            setNewOffice({
              name: "",
              address: "",
              latitude: "",
              longitude: "",
            });
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New OLT</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={newOffice.name}
                onChange={(e) =>
                  setNewOffice({ ...newOffice, name: e.target.value })
                }
                placeholder="OLT Name"
              />
            </div>
            <div>
              <Label>Address</Label>
              <Input
                value={newOffice.address}
                onChange={(e) =>
                  setNewOffice({ ...newOffice, address: e.target.value })
                }
                placeholder="OLT Address"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Latitude</Label>
                <Input value={newOffice.latitude} readOnly />
              </div>
              <div>
                <Label>Longitude</Label>
                <Input value={newOffice.longitude} readOnly />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => {
                // Close the form modal
                setIsAddFormOpen(false);
                // Clear everything
                setClickedLatLng(null);
                setNewOffice({
                  name: "",
                  address: "",
                  latitude: "",
                  longitude: "",
                });
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={async () => {
                try {
                  setIsSaving(true);
                  const created = await createOffice({
                    ...newOffice,
                    latitude: parseFloat(newOffice.latitude),
                    longitude: parseFloat(newOffice.longitude),
                  });
                  console.log("API returned:", created);
                  setOffices((prev) => [created, ...prev]);
                  toast.success("OLT added successfully");
                  setIsAddFormOpen(false);
                  setIsAddMapOpen(false);
                  setNewOffice({
                    name: "",
                    address: "",
                    latitude: "",
                    longitude: "",
                  });
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to add OLT");
                } finally {
                  setIsSaving(false);
                }
              }}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* add junction form modal */}
      <JunctionFormDialog
        open={isAddJunctionFormOpen}
        onOpenChange={setIsAddJunctionFormOpen}
        mapData={mapData}
        setJunctions={setJunctions}
        setAllJunctions={setAllJunctions}
        resetJunctionForm={resetJunctionForm}
        newJunction={newJunction}
        setNewJunction={setNewJunction}
      />

      {/* Add Sub-Office form modal */}
      <SubOfficeFormDialog
        open={isAddSubFormOpen}
        onOpenChange={setIsAddSubFormOpen}
        mapData={mapData}
        setSub={setSub}
        setAllSub={setAllSub}
        resetSubForm={resetSubForm}
        newSub={newSub}
        setNewSub={setNewSub}
      />

      {/* add device form modal */}
      <DeviceFormDialog
        open={isAddDeviceFormOpen}
        onOpenChange={setIsAddDeviceFormOpen}
        mapData={mapData}
        setDevices={setDevices}
        setAllDevices={setAllDevices}
        resetDeviceForm={resetDeviceForm}
        newDevice={newDevice}
        setNewDevice={setNewDevice}
      />
      {/* add customer form modal */}
      <CustomerFormDialog
        open={isAddCustomerFormOpen}
        onOpenChange={setIsAddCustomerFormOpen}
        mapData={mapData}
        setCustomers={setCustomers}
        setAllCustomers={setAllCustomers}
        resetCustomerForm={resetCustomerForm}
        newCustomer={newCustomer}
        setNewCustomer={setNewCustomer}
      />

      {/* add route form modal */}
      <RouteFormDialog
        open={isAddRouteModalOpen}
        onOpenChange={setIsAddRouteModalOpen}
        mapData={mapData}
        routePoints={routePoints}
        setRoutes={setRoutes}
        resetForm={() => {
          setNewRoute({ name: "", description: "" });
          setRoutePoints([]);
        }}
        newRoute={newRoute}
        setNewRoute={setNewRoute}
      />

      <DeviceEditDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        editData={editData}
        setEditData={setEditData}
        onSave={async () => {
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
      />

      <SubOfficeEditDialog
        isOpen={isEditSubOpen}
        onClose={() => setIsEditSubOpen(false)}
        subData={editSubData}
        setSubData={setEditSubData}
        onUpdate={(updatedSub) => {
          setSub((prev) =>
            prev.map((s) => (s.id === updatedSub.id ? updatedSub : s))
          );
        }}
      />

      <EditJunctionModal
        isOpen={isEditJunctionOpen}
        onClose={() => setIsEditJunctionOpen(false)}
        junctionData={editJunctionData}
        setJunctionData={setEditJunctionData}
        onUpdate={(updatedJunction) => {
          setJunctions((prev) =>
            prev.map((j) => (j.id === updatedJunction.id ? updatedJunction : j))
          );
        }}
      />

      <EditCustomerModal
        isOpen={isEditCustomerOpen}
        onClose={() => setIsEditCustomerOpen(false)}
        customerData={editCustomerData}
        setCustomerData={setEditCustomerData}
        onUpdate={(updatedCustomer) => {
          setCustomers((prev) =>
            prev.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
          );
        }}
      />

      <style jsx global>{`
        /* Custom cursors for modes */
        .leaflet-container.cursor-draw {
          cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'><path fill='black' d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83l3.75 3.75 1.83-1.83z'/></svg>")
              0 24,
            crosshair !important;
        }

        .leaflet-container.cursor-add {
          cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'><path fill='black' d='M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z'/></svg>")
              12 12,
            pointer !important;
        }

        /* Override Leaflet's grab & dragging */
        .leaflet-container.cursor-draw.leaflet-grab,
        .leaflet-container.cursor-add.leaflet-grab,
        .leaflet-container.cursor-draw.leaflet-dragging,
        .leaflet-container.cursor-add.leaflet-dragging {
          cursor: inherit !important;
        }
      `}</style>
    </NetworkLayout>
  );
}
