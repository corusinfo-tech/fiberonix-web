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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { createDevice } from "@/services/api";
import { useState } from "react";

export default function DeviceFormDialog({
  open,
  onOpenChange,
  mapData,
  setDevices,
  setAllDevices,
  resetDeviceForm,
  newDevice,
  setNewDevice,
}) {
  const [errors, setErrors] = useState({});
  if (!newDevice) return null;

  const deviceTypes = ["OLT", "ONT", "Splitter", "Coupler"];
  const ratios = ["1:2", "1:4", "1:8", "1:16", "1:32"];

  const validateForm = () => {
    const newErrors = {};
    if (!newDevice.device_type)
      newErrors.device_type = "Device type is required";
    if (!newDevice.model_name?.trim())
      newErrors.model_name = "Model name is required";
    if (!newDevice.description?.trim())
      newErrors.description = "Description is required";
    if (!newDevice.ratio) newErrors.ratio = "Ratio is required";
    if (!newDevice.max_speed) newErrors.max_speed = "Max speed is required";
    if (!newDevice.color_coding?.trim())
      newErrors.color_coding = "Color coding is required";
    if (!newDevice.port_count) newErrors.port_count = "Port count is required";
    if (!newDevice.insertion_loss)
      newErrors.insertion_loss = "Insertion loss is required";
    if (!newDevice.return_loss)
      newErrors.return_loss = "Return loss is required";
    if (!newDevice.supported_protocols?.trim())
      newErrors.supported_protocols = "Supported protocols are required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        device_type: newDevice.device_type,
        model_name: newDevice.model_name,
        description: newDevice.description,
        ratio: newDevice.ratio,
        max_speed: parseFloat(newDevice.max_speed),
        color_coding: newDevice.color_coding,
        insertion_loss: parseFloat(newDevice.insertion_loss),
        return_loss: parseFloat(newDevice.return_loss),
        port_count: parseInt(newDevice.port_count),
        supported_protocols: newDevice.supported_protocols,
        latitude: parseFloat(newDevice.latitude),
        longitude: parseFloat(newDevice.longitude),
        office: mapData.id,
        staff: 1,
      };

      console.log("Submitting Device Payload:", payload);
      const created = await createDevice(payload);
      toast.success("Device added successfully");

      if (created.office === mapData.id) {
        setDevices((prev) => [...prev, created]);
      }
      setAllDevices((prev) => [...prev, created]);

      onOpenChange(false);
      resetDeviceForm();
      setErrors({});
    } catch (err) {
      console.error("Failed to add device:", err.response?.data || err);
      if (err.response?.data) {
        // Map backend errors to our errors object
        const serverErrors = {};
        Object.keys(err.response.data).forEach((key) => {
          serverErrors[key] = Array.isArray(err.response.data[key])
            ? err.response.data[key][0]
            : err.response.data[key];
        });
        setErrors(serverErrors);
      } else {
        toast.error("Failed to add device");
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
          resetDeviceForm();
          setErrors({});
        }
      }}
    >
      <DialogContent className="w-full max-w-3xl flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Device</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[75vh] overflow-y-auto pr-2">
          {/* Device Type */}
          <div>
            <Label>Device Type</Label>
            <Select
              value={newDevice.device_type || ""}
              onValueChange={(value) =>
                setNewDevice({ ...newDevice, device_type: value })
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
              value={newDevice.model_name || ""}
              onChange={(e) =>
                setNewDevice({ ...newDevice, model_name: e.target.value })
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
              value={newDevice.description || ""}
              onChange={(e) =>
                setNewDevice({ ...newDevice, description: e.target.value })
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
              value={newDevice.ratio}
              onValueChange={(value) =>
                setNewDevice({ ...newDevice, ratio: value })
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
              value={newDevice.max_speed || ""}
              onChange={(e) =>
                setNewDevice({ ...newDevice, max_speed: e.target.value })
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
              value={newDevice.color_coding || ""}
              onChange={(e) =>
                setNewDevice({ ...newDevice, color_coding: e.target.value })
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
              value={newDevice.port_count || ""}
              onChange={(e) =>
                setNewDevice({ ...newDevice, port_count: e.target.value })
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
              value={newDevice.insertion_loss || ""}
              onChange={(e) =>
                setNewDevice({ ...newDevice, insertion_loss: e.target.value })
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
              value={newDevice.return_loss || ""}
              onChange={(e) =>
                setNewDevice({ ...newDevice, return_loss: e.target.value })
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
              value={newDevice.supported_protocols || ""}
              onChange={(e) =>
                setNewDevice({
                  ...newDevice,
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
              value={newDevice.latitude || ""}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Longitude */}
          <div>
            <Label>Longitude</Label>
            <Input
              value={newDevice.longitude || ""}
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
