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
import { createSub } from "@/services/api";
import { useState } from "react";

export default function SubOfficeFormDialog({
  open,
  onOpenChange,
  mapData,
  setSub,
  setAllSub,
  resetSubForm,
  newSub,
  setNewSub,
}) {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!newSub.name?.trim()) newErrors.name = "Name is required";
    if (!newSub.address?.trim()) newErrors.address = "Address is required";
    if (!newSub.latitude || isNaN(parseFloat(newSub.latitude)))
      newErrors.latitude = "Invalid latitude";
    if (!newSub.longitude || isNaN(parseFloat(newSub.longitude)))
      newErrors.longitude = "Invalid longitude";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        name: newSub.name.trim(),
        address: newSub.address.trim(),
        latitude: parseFloat(newSub.latitude),
        logitude: parseFloat(newSub.longitude),
        office: mapData.id,
        created_by: 1, // Replace with logged-in user ID if available
      };

      console.log("Submitting SubOffice Payload:", payload);

      const created = await createSub(payload);
      toast.success("Sub-Office added successfully");

      if (created.office === mapData.id) {
        setSub((prev) => [...prev, created]);
      }
      setAllSub((prev) => [...prev, created]);

      onOpenChange(false);
      resetSubForm();
      setErrors({});
    } catch (err) {
      console.error("Failed to add sub-office:", err.response?.data || err);
      toast.error("Failed to add sub-office");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) {
          resetSubForm();
          setErrors({});
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Sub-Office</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={newSub.name}
              onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <Label>Address</Label>
            <Input
              value={newSub.address}
              onChange={(e) =>
                setNewSub({ ...newSub, address: e.target.value })
              }
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="text-sm text-red-500 mt-1">{errors.address}</p>
            )}
          </div>
          <div>
            <Label>Latitude</Label>
            <Input
              value={newSub.latitude}
              readOnly
              className={`bg-gray-100 cursor-not-allowed ${
                errors.latitude ? "border-red-500" : ""
              }`}
            />
            {errors.latitude && (
              <p className="text-sm text-red-500 mt-1">{errors.latitude}</p>
            )}
          </div>
          <div>
            <Label>Longitude</Label>
            <Input
              value={newSub.longitude}
              readOnly
              className={`bg-gray-100 cursor-not-allowed ${
                errors.longitude ? "border-red-500" : ""
              }`}
            />
            {errors.longitude && (
              <p className="text-sm text-red-500 mt-1">{errors.longitude}</p>
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
