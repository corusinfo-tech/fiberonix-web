import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { createRoute } from "@/services/api";
import { useState } from "react";

export default function RouteFormDialog({
  open,
  onOpenChange,
  mapData,
  routePoints,
  setRoutes,
  resetForm,
  newRoute,
  setNewRoute,
}) {
  const [errors, setErrors] = useState({});

  const normalizePoints = (points) =>
    points.map((p) => ({
      lat: parseFloat(Array.isArray(p) ? p[0] : p.lat ?? p.latitude),
      lng: parseFloat(Array.isArray(p) ? p[1] : p.lng ?? p.longitude),
    }));

  const calculateTotalKm = (points) => {
    if (!Array.isArray(points) || points.length < 2) return 0;
    let distance = 0;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const lat1 = Array.isArray(prev) ? prev[0] : prev.lat ?? prev.latitude;
      const lon1 = Array.isArray(prev) ? prev[1] : prev.lng ?? prev.longitude;
      const lat2 = Array.isArray(curr) ? curr[0] : curr.lat ?? curr.latitude;
      const lon2 = Array.isArray(curr) ? curr[1] : curr.lng ?? curr.longitude;
      if (
        [lat1, lon1, lat2, lon2].some((v) => typeof v !== "number" || isNaN(v))
      )
        continue;
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      distance += R * c;
    }
    return distance;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newRoute.name?.trim()) newErrors.name = "Route name is required";
    if (!newRoute.description?.trim())
      newErrors.description = "Description is required";
    if ((routePoints || []).length < 2)
      newErrors.points = "Draw at least two points for the route";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const normalized = normalizePoints(routePoints || []);
      const totalKm = calculateTotalKm(normalized);

      const payload = {
        name: newRoute.name.trim(),
        description: newRoute.description.trim(),
        office: mapData.id,
        total_km: totalKm,
        length_km: totalKm.toFixed(2),
        path: normalized.map((p) => ({
          latitude: p.lat,
          longitude: p.lng,
          description: "",
        })),
        created_by: 1,
      };

      console.log("Submitting Route Payload:", payload);

      const created = await createRoute(payload);
      const newRouteObj = { ...created, path: payload.path };
      setRoutes((prev) => [...prev, newRouteObj]);
      toast.success("Route added successfully!");
      onOpenChange(false);
      resetForm();
      setErrors({});

      if (typeof window.setIsPlacingRoute === "function") {
        window.setIsPlacingRoute(false);
      }
    } catch (err) {
      console.error("Failed to add route:", err.response?.data || err);
      let serverErrorStr = "";
      const resData = err.response?.data;
      
      if (resData) {
        if (typeof resData === "string") serverErrorStr = resData;
        else if (resData.error) serverErrorStr = Array.isArray(resData.error) ? resData.error.join(", ") : resData.error;
        else if (resData.message) serverErrorStr = Array.isArray(resData.message) ? resData.message.join(", ") : resData.message;
        else if (resData.detail) serverErrorStr = Array.isArray(resData.detail) ? resData.detail.join(", ") : resData.detail;
        else serverErrorStr = JSON.stringify(resData);
      }

      if (serverErrorStr) {
        setErrors((prev) => ({
          ...prev,
          server: serverErrorStr,
        }));
      } else {
        toast.error("Failed to add route");
      }
    }
  };

  const isFiberLimitError =
    errors.server && errors.server.toLowerCase().includes("limit");

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) {
          resetForm();
          setErrors({});
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Route</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Show subscription prompt if fiber limit exceeded */}
          {isFiberLimitError && (
            <div className="p-4 border border-yellow-400 bg-yellow-50 rounded">
              <p className="text-yellow-700 font-semibold mb-2">
                {errors.server}
              </p>
              <Button
                className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white w-full font-semibold"
                onClick={() => {
                  // redirect to subscription page
                  window.location.href = "/plans";
                }}
              >
                Upgrade Plan
              </Button>
            </div>
          )}

          {/* Generic server error (if any) */}
          {!isFiberLimitError && errors.server && (
            <div className="p-2 text-red-600 bg-red-100 rounded">
              {errors.server}
            </div>
          )}

          <div>
            <Label>Route Name</Label>
            <Input
              value={newRoute.name}
              onChange={(e) =>
                setNewRoute({ ...newRoute, name: e.target.value })
              }
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={newRoute.description}
              onChange={(e) =>
                setNewRoute({ ...newRoute, description: e.target.value })
              }
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>
          <div>
            <Label>Total Distance</Label>
            <Input
              value={`${calculateTotalKm(normalizePoints(routePoints))} km`}
              readOnly
              className={`bg-gray-100 ${errors.points ? "border-red-500" : ""}`}
            />
            {errors.points && (
              <p className="text-sm text-red-500 mt-1">{errors.points}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
