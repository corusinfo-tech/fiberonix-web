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
import { updateSub } from "@/services/api";
import { toast } from "sonner";
import { useState } from "react";

export default function SubOfficeEditDialog({
  isOpen,
  onClose,
  subData,
  setSubData,
  onUpdate,
}) {
  const [errors, setErrors] = useState({});

  if (!subData) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!subData.name?.trim()) newErrors.name = "Name is required";
    if (!subData.address?.trim()) newErrors.address = "Address is required";
    if (!subData.latitude || isNaN(parseFloat(subData.latitude)))
      newErrors.latitude = "Invalid latitude";
    if (!subData.longitude || isNaN(parseFloat(subData.longitude)))
      newErrors.longitude = "Invalid longitude";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await updateSub(subData.id, {
        ...subData,
        name: subData.name.trim(),
        address: subData.address.trim(),
        latitude: parseFloat(subData.latitude),
        longitude: parseFloat(subData.longitude),
      });
      onUpdate(subData);
      toast.success("Sub Office updated successfully");
      setErrors({});
      onClose();
    } catch (err) {
      if (err.response?.data) {
        const serverErrors = {};
        Object.keys(err.response.data).forEach((key) => {
          serverErrors[key] = Array.isArray(err.response.data[key])
            ? err.response.data[key][0]
            : err.response.data[key];
        });
        setErrors(serverErrors);
      } else {
        toast.error("Failed to update Sub Office");
      }
    }
  };

  const handleClose = () => {
    setErrors({}); // clear errors on close
    onClose();
  };

  const errorClass = (field) => (errors[field] ? "border-red-500" : "");

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg w-[95%] sm:w-full sm:max-w-2xl mx-auto rounded-xl">
        <DialogHeader>
          <DialogTitle>Edit Sub Office</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
          {/* Name */}
          <div>
            <Label>Name</Label>
            <Input
              value={subData.name}
              onChange={(e) => setSubData({ ...subData, name: e.target.value })}
              className={errorClass("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <Label>Address</Label>
            <Input
              value={subData.address}
              onChange={(e) =>
                setSubData({ ...subData, address: e.target.value })
              }
              className={errorClass("address")}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          {/* Latitude */}
          <div>
            <Label>Latitude</Label>
            <Input
              type="number"
              value={subData.latitude}
              onChange={(e) =>
                setSubData({ ...subData, latitude: e.target.value })
              }
              className={errorClass("latitude")}
            />
            {errors.latitude && (
              <p className="text-sm text-red-500">{errors.latitude}</p>
            )}
          </div>

          {/* Longitude */}
          <div>
            <Label>Longitude</Label>
            <Input
              type="number"
              value={subData.longitude}
              onChange={(e) =>
                setSubData({ ...subData, longitude: e.target.value })
              }
              className={errorClass("longitude")}
            />
            {errors.longitude && (
              <p className="text-sm text-red-500">{errors.longitude}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
