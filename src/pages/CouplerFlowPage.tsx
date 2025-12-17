import { NetworkLayout } from "@/components/NetworkLayout";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  networkRepository,
  NetworkDesignModel,
  CouplerData,
  asymmetricCouplers,
  couplerLossMap,
} from "@/services/networkDesignService";
import {
  Save,
  Plus,
  Trash2,
  Router,
  Zap,
  Download,
  ArrowRight,
  Cable,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const CouplerFlowPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [designName, setDesignName] = useState("");
  const [inputPower, setInputPower] = useState("8");
  const [couplers, setCouplers] = useState<CouplerData[]>([]);
  const [currentDesignId, setCurrentDesignId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id && id !== "new") {
      loadExistingDesign(id);
    }
  }, [id]);

  const loadExistingDesign = async (designId: string) => {
    try {
      setLoading(true);
      const design = await networkRepository.getDesignById(designId);
      if (design) {
        setCurrentDesignId(design.id || null);
        setDesignName(design.name);
        setInputPower(design.initialInputPower.toString());
        setCouplers(design.couplers.map((c) => c.copy()));
      } else {
        toast({
          title: "Error",
          description: "Design not found",
          variant: "destructive",
        });
        navigate("/network-design");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load design",
        variant: "destructive",
      });
      navigate("/network-design");
    } finally {
      setLoading(false);
    }
  };

  const addCoupler = () => {
    setCouplers([...couplers, new CouplerData(0, "10/90", 0.2, 0, 0)]);

    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100);

    toast({
      title: "Coupler Added",
      description: "New coupler added to the design",
      duration: 2000,
    });
  };

  const removeCoupler = (index: number) => {
    setCouplers(couplers.filter((_, i) => i !== index));
    toast({
      title: "Coupler Removed",
      description: "Coupler removed from the design",
      variant: "destructive",
      duration: 2000,
    });
  };

  const updateCoupler = (index: number, updates: Partial<CouplerData>) => {
    const newCouplers = [...couplers];
    const current = newCouplers[index];
    newCouplers[index] = new CouplerData(
      updates.inputPower ?? current.inputPower,
      updates.couplerType ?? current.couplerType,
      updates.lossPerKm ?? current.lossPerKm,
      updates.distance1 ?? current.distance1,
      updates.distance2 ?? current.distance2,
      current.id // Preserve the existing id
    );
    setCouplers(newCouplers);
  };

  const saveDesign = async () => {
    if (designName.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a design name",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const design: NetworkDesignModel = {
        id: currentDesignId || undefined,
        name: designName.trim(),
        createdAt: new Date(),
        initialInputPower: parseFloat(inputPower) || 0,
        couplers: couplers.map((c) => c.copy()),
        status: "Active",
      };

      await networkRepository.saveDesign(design);

      toast({
        title: "Success",
        description: "Design saved successfully!",
      });

      // Navigate back to the list after a short delay
      setTimeout(() => {
        navigate("/network-design");
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save design",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  let currentPower = parseFloat(inputPower) || 0;

  return (
    <NetworkLayout>
      <div className="space-y-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Network Design Editor
            </h1>
            <p className="text-muted-foreground mt-2">
              Configure optical network couplers and calculate power distribution
            </p>
          </div>
          <Button onClick={saveDesign} className="gap-2" disabled={saving || loading}>
            {saving ? (
              <>
                <Zap className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Design
              </>
            )}
          </Button>
        </div>

        {/* Scrollable Content */}
        <div ref={scrollRef} className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          {/* Design Name Input */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Design Name
            </label>
            <Input
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              placeholder="e.g. Area 51 Expansion"
              className="text-base font-semibold"
            />
          </div>

          {/* OLT / Head End Input */}
          <div className="bg-card border border-primary/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Router className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-card-foreground">
                OLT / Head End
              </h2>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Input Power (dBm)
              </label>
              <div className="relative">
                <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                <Input
                  type="number"
                  step="0.1"
                  value={inputPower}
                  onChange={(e) => setInputPower(e.target.value)}
                  className="pl-11 text-lg font-bold text-primary"
                />
              </div>
            </div>
          </div>

          {/* Connector Line */}
          {couplers.length > 0 && (
            <div className="flex justify-center">
              <div className="w-0.5 h-8 bg-border"></div>
            </div>
          )}

          {/* Couplers */}
          {couplers.map((coupler, index) => {
            coupler.inputPower = currentPower;
            const selectedCoupler = couplerLossMap[coupler.couplerType];
            currentPower = coupler.outputPower2;

            return (
              <div key={index}>
                <CouplerCard
                  index={index}
                  coupler={coupler}
                  selectedCoupler={selectedCoupler}
                  onUpdate={(updates) => updateCoupler(index, updates)}
                  onRemove={() => removeCoupler(index)}
                  isNewDesign={id === "new"}
                />
                {index < couplers.length - 1 && (
                  <div className="flex justify-center">
                    <div className="w-0.5 h-8 bg-border"></div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Coupler Button - Only show when creating new design */}
          {id === "new" && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={addCoupler}
                size="lg"
                className="gap-2 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Add Coupler
              </Button>
            </div>
          )}

          {/* Save Button (Bottom) */}
          {couplers.length > 0 && (
            <div className="pt-6">
              <Button
                onClick={saveDesign}
                size="lg"
                className="w-full gap-2 text-base"
                disabled={saving || loading}
              >
                {saving ? (
                  <>
                    <Zap className="w-5 h-5 animate-spin" />
                    Saving Network Design...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Network Design
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </NetworkLayout>
  );
};

interface CouplerCardProps {
  index: number;
  coupler: CouplerData;
  selectedCoupler: any;
  onUpdate: (updates: Partial<CouplerData>) => void;
  onRemove: () => void;
  isNewDesign: boolean;
}

const CouplerCard = ({
  index,
  coupler,
  selectedCoupler,
  onUpdate,
  onRemove,
  isNewDesign,
}: CouplerCardProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg font-bold text-sm">
            #{index + 1}
          </div>
          <h3 className="text-lg font-semibold text-card-foreground">
            Optical Coupler
          </h3>
        </div>
        {isNewDesign && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        )}
      </div>

      <div className="h-px bg-border mb-4"></div>

      {/* Coupler Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Coupler Type
        </label>
        <select
          value={coupler.couplerType}
          onChange={(e) => onUpdate({ couplerType: e.target.value })}
          className="w-full px-4 py-3 bg-muted border border-border rounded-xl font-medium text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {asymmetricCouplers.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name} — Tap: {c.loss1}dB / Thru: {c.loss2}dB
            </option>
          ))}
        </select>
      </div>

      {/* Outputs Row */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Tap Output */}
        <OutputColumn
          title="Tap (Drop)"
          icon={<Download className="w-4 h-4" />}
          color="text-orange-600"
          bgColor="bg-orange-50"
          borderColor="border-orange-200"
          loss={selectedCoupler?.loss1 || 0}
          distance={coupler.distance1}
          outputPower={coupler.outputPower1}
          onDistanceChange={(val) => onUpdate({ distance1: val })}
        />

        {/* Through Output */}
        <OutputColumn
          title="Through (Next)"
          icon={<ArrowRight className="w-4 h-4" />}
          color="text-green-600"
          bgColor="bg-green-50"
          borderColor="border-green-200"
          loss={selectedCoupler?.loss2 || 0}
          distance={coupler.distance2}
          outputPower={coupler.outputPower2}
          onDistanceChange={(val) => onUpdate({ distance2: val })}
        />
      </div>

      {/* Input Power Display */}
      <div className="text-center text-xs text-muted-foreground italic">
        Input at this stage: {coupler.inputPower.toFixed(2)} dBm
      </div>
    </div>
  );
};

interface OutputColumnProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  loss: number;
  distance: number;
  outputPower: number;
  onDistanceChange: (val: number) => void;
}

const OutputColumn = ({
  title,
  icon,
  color,
  bgColor,
  borderColor,
  loss,
  distance,
  outputPower,
  onDistanceChange,
}: OutputColumnProps) => {
  return (
    <div className="space-y-3">
      {/* Title */}
      <div className="flex items-center justify-center gap-2">
        <span className={color}>{icon}</span>
        <span className={`${color} font-bold text-sm`}>{title}</span>
      </div>

      {/* Loss Badge */}
      <div className={`${bgColor} ${borderColor} border px-2 py-1 rounded text-center`}>
        <span className={`${color} text-xs font-semibold`}>
          Loss: -{loss}dB
        </span>
      </div>

      {/* Distance Input */}
      <div>
        <Input
          type="number"
          step="0.1"
          value={distance === 0 ? "" : distance}
          onChange={(e) => onDistanceChange(parseFloat(e.target.value) || 0)}
          placeholder="Dist (km)"
          className="text-center"
        />
      </div>

      {/* Output Power Display */}
      <div className={`${bgColor} ${borderColor} border rounded-xl p-3 text-center`}>
        <div className={`${color} text-2xl font-extrabold`}>
          {outputPower.toFixed(2)}
        </div>
        <div className="text-xs text-muted-foreground">dBm</div>
      </div>
    </div>
  );
};

export default CouplerFlowPage;
