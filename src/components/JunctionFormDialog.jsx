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
import { createJunction } from "@/services/api";
import { useState } from "react";

export default function JunctionFormDialog({
  open,
  onOpenChange,
  mapData,
  setJunctions,
  setAllJunctions,
  resetJunctionForm,
  newJunction,
  setNewJunction,
}) {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!newJunction.name?.trim()) newErrors.name = "Junction name is required";
    if (!newJunction.post_code?.trim()) newErrors.post_code = "Post code is required";
    if (!newJunction.junction_type?.trim())
      newErrors.junction_type = "Junction type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        name: newJunction.name,
        post_code: newJunction.post_code,
        junction_type: newJunction.junction_type,
        latitude: parseFloat(newJunction.latitude),
        longitude: parseFloat(newJunction.longitude),
        office: mapData.id,
        staff: 1,
      };

      console.log("Submitting Junction Payload:", payload);
      const created = await createJunction(payload);
      toast.success("Junction added successfully");

      const newJunctionObj = { ...payload, ...created };
      setJunctions((prev) => (Array.isArray(prev) ? [...prev, newJunctionObj] : [newJunctionObj]));
      setAllJunctions((prev) => (Array.isArray(prev) ? [...prev, newJunctionObj] : [newJunctionObj]));

      onOpenChange(false);
      resetJunctionForm();
      setErrors({});
    } catch (err) {
      console.error("Failed to add junction:", err.response?.data || err);
      if (err.response?.data) {
        const serverErrors = {};
        Object.keys(err.response.data).forEach((key) => {
          serverErrors[key] = Array.isArray(err.response.data[key])
            ? err.response.data[key][0]
            : err.response.data[key];
        });
        setErrors(serverErrors);
      } else {
        toast.error("Failed to add junction");
      }
    }
  };

  const errorClass = (field) => (errors[field] ? "border-red-500" : "");

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) {
          resetJunctionForm();
          setErrors({});
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Junction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Name */}
          <div>
            <Label>Name</Label>
            <Input
              value={newJunction.name}
              onChange={(e) =>
                setNewJunction({ ...newJunction, name: e.target.value })
              }
              className={errorClass("name")}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Post Code */}
          <div>
            <Label>Post Code</Label>
            <Input
              value={newJunction.post_code}
              onChange={(e) =>
                setNewJunction({ ...newJunction, post_code: e.target.value })
              }
              className={errorClass("post_code")}
            />
            {errors.post_code && <p className="text-sm text-red-500">{errors.post_code}</p>}
          </div>

          {/* Junction Type */}
          <div>
            <Label>Junction Type</Label>
            <Input
              value={newJunction.junction_type}
              onChange={(e) =>
                setNewJunction({
                  ...newJunction,
                  junction_type: e.target.value,
                })
              }
              className={errorClass("junction_type")}
            />
            {errors.junction_type && (
              <p className="text-sm text-red-500">{errors.junction_type}</p>
            )}
          </div>

          {/* Latitude */}
          <div>
            <Label>Latitude</Label>
            <Input
              value={newJunction.latitude}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Longitude */}
          <div>
            <Label>Longitude</Label>
            <Input
              value={newJunction.longitude}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
