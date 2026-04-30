// src/components/DeviceEditDialog.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const deviceTypes = ["Splitter", "Coupler", "OLT", "ONT"];
const ratios = ["1:2", "1:4", "1:8", "1:16", "1:32", "1:64"];

export default function DeviceEditDialog({
  open,
  onOpenChange,
  editData,
  setEditData,
  onSave,
}) {
  const [errors, setErrors] = useState({});

  if (!editData) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!editData.device_type)
      newErrors.device_type = "Device type is required";
    if (!editData.model_name?.trim())
      newErrors.model_name = "Model name is required";
    if (!editData.description?.trim())
      newErrors.description = "Description is required";
    if (!editData.ratio) newErrors.ratio = "Ratio is required";
    if (!editData.max_speed) newErrors.max_speed = "Max speed is required";
    if (!editData.color_coding?.trim())
      newErrors.color_coding = "Color coding is required";
    if (!editData.port_count) newErrors.port_count = "Port count is required";
    if (!editData.insertion_loss)
      newErrors.insertion_loss = "Insertion loss is required";
    if (!editData.return_loss)
      newErrors.return_loss = "Return loss is required";
    if (!editData.supported_protocols?.trim())
      newErrors.supported_protocols = "Supported protocols are required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await onSave();
      setErrors({});
    } catch (err) {
      console.error("Failed to save device:", err.response?.data || err);
      if (err.response?.data) {
        const serverErrors = {};
        Object.keys(err.response.data).forEach((key) => {
          serverErrors[key] = Array.isArray(err.response.data[key])
            ? err.response.data[key][0]
            : err.response.data[key];
        });
        setErrors(serverErrors);
      }
    }
  };

  const errorClass = (field) => (errors[field] ? "border-red-500" : "");

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setErrors({}); // <-- Clear errors when closing
      }}
    >
      <DialogContent className="w-full max-w-3xl flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Device</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[75vh] overflow-y-auto pr-2">
          {/* Device Type */}
          <div>
            <Label>Device Type</Label>
            <Select
              value={editData.device_type || ""}
              onValueChange={(value) =>
                setEditData({ ...editData, device_type: value })
              }
            >
              <SelectTrigger className={errorClass("device_type")}>
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent>
                {deviceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.device_type && (
              <p className="text-sm text-red-500">{errors.device_type}</p>
            )}
          </div>

          {/* Model Name */}
          <div>
            <Label>Model Name</Label>
            <Input
              value={editData.model_name || ""}
              onChange={(e) =>
                setEditData({ ...editData, model_name: e.target.value })
              }
              className={errorClass("model_name")}
            />
            {errors.model_name && (
              <p className="text-sm text-red-500">{errors.model_name}</p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <Label>Description</Label>
            <Input
              value={editData.description || ""}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              className={errorClass("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Ratio */}
          <div>
            <Label>Ratio</Label>
            <Select
              value={editData.ratio}
              onValueChange={(value) =>
                setEditData({ ...editData, ratio: value })
              }
            >
              <SelectTrigger className={errorClass("ratio")}>
                <SelectValue placeholder="Select ratio" />
              </SelectTrigger>
              <SelectContent>
                {ratios.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.ratio && (
              <p className="text-sm text-red-500">{errors.ratio}</p>
            )}
          </div>

          {/* Max Speed */}
          <div>
            <Label>Max Speed</Label>
            <Input
              type="number"
              value={editData.max_speed || ""}
              onChange={(e) =>
                setEditData({ ...editData, max_speed: e.target.value })
              }
              className={errorClass("max_speed")}
            />
            {errors.max_speed && (
              <p className="text-sm text-red-500">{errors.max_speed}</p>
            )}
          </div>

          {/* Color Coding */}
          <div>
            <Label>Color Coding</Label>
            <Input
              value={editData.color_coding || ""}
              onChange={(e) =>
                setEditData({ ...editData, color_coding: e.target.value })
              }
              className={errorClass("color_coding")}
            />
            {errors.color_coding && (
              <p className="text-sm text-red-500">{errors.color_coding}</p>
            )}
          </div>

          {/* Port Count */}
          <div>
            <Label>Port Count</Label>
            <Input
              type="number"
              value={editData.port_count || ""}
              onChange={(e) =>
                setEditData({ ...editData, port_count: e.target.value })
              }
              className={errorClass("port_count")}
            />
            {errors.port_count && (
              <p className="text-sm text-red-500">{errors.port_count}</p>
            )}
          </div>

          {/* Insertion Loss */}
          <div>
            <Label>Insertion Loss</Label>
            <Input
              type="number"
              value={editData.insertion_loss || ""}
              onChange={(e) =>
                setEditData({ ...editData, insertion_loss: e.target.value })
              }
              className={errorClass("insertion_loss")}
            />
            {errors.insertion_loss && (
              <p className="text-sm text-red-500">{errors.insertion_loss}</p>
            )}
          </div>

          {/* Return Loss */}
          <div>
            <Label>Return Loss</Label>
            <Input
              type="number"
              value={editData.return_loss || ""}
              onChange={(e) =>
                setEditData({ ...editData, return_loss: e.target.value })
              }
              className={errorClass("return_loss")}
            />
            {errors.return_loss && (
              <p className="text-sm text-red-500">{errors.return_loss}</p>
            )}
          </div>

          {/* Supported Protocols */}
          <div className="md:col-span-2">
            <Label>Supported Protocols</Label>
            <Input
              value={editData.supported_protocols || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  supported_protocols: e.target.value,
                })
              }
              className={errorClass("supported_protocols")}
            />
            {errors.supported_protocols && (
              <p className="text-sm text-red-500">
                {errors.supported_protocols}
              </p>
            )}
          </div>

          {/* Latitude */}
          <div>
            <Label>Latitude</Label>
            <Input
              value={editData.latitude || ""}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Longitude */}
          <div>
            <Label>Longitude</Label>
            <Input
              value={editData.longitude || ""}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setErrors({});
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
