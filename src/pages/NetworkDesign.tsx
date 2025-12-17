import { NetworkLayout } from "@/components/NetworkLayout";
import { useState, useEffect } from "react";
import { networkRepository, NetworkDesignModel } from "@/services/networkDesignService";
import { Calendar, Cable, Plus, Grid3x3, Loader2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const NetworkDesign = () => {
  const [designs, setDesigns] = useState<NetworkDesignModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadDesigns();
  }, []);

  const loadDesigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await networkRepository.getDesigns();
      setDesigns(data);
    } catch (err: any) {
      setError(err.message || "Failed to load designs");
      console.error("Error loading designs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, design: NetworkDesignModel) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    
    if (!design.id) return;

    const confirmed = window.confirm(`Are you sure you want to delete "${design.name}"?`);
    if (!confirmed) return;

    try {
      setDeleting(design.id);
      await networkRepository.deleteDesign(design.id);
      
      toast({
        title: "Success",
        description: "Design deleted successfully",
      });

      // Reload designs
      loadDesigns();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete design",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  const navigateToDesign = (design?: NetworkDesignModel) => {
    if (design) {
      navigate(`/network-design/${design.id}`);
    } else {
      navigate('/network-design/new');
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <NetworkLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Saved Network Designs
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your optical network design projects
          </p>
        </div>

        {/* Add New Design Card */}
        <div
          onClick={() => navigateToDesign()}
          className="group cursor-pointer w-full p-6 rounded-2xl bg-gradient-to-br from-primary to-primary-glow shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-primary-foreground">
                Create New Design
              </h2>
              <p className="text-primary-foreground/80 text-sm">
                Start a new optical network project
              </p>
            </div>
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Plus className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Your Designs Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Your Designs</h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading designs...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">{error}</p>
              <button
                onClick={loadDesigns}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
              >
                Retry
              </button>
            </div>
          ) : designs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Grid3x3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No designs saved yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {designs.map((design) => (
                <div
                  key={design.id}
                  onClick={() => navigateToDesign(design)}
                  className="group cursor-pointer bg-card border border-border rounded-2xl p-4 hover:shadow-lg transition-all duration-200 hover:border-primary/30"
                >
                  <div className="flex items-center gap-4">
                    {/* Left Icon */}
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Grid3x3 className="w-6 h-6 text-primary" />
                    </div>

                    {/* Center Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-card-foreground text-base mb-1.5 truncate">
                        {design.name}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(design.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Cable className="w-3 h-3" />
                          <span>{design.couplers.length} Couplers</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Delete Icon */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => handleDelete(e, design)}
                        disabled={deleting === design.id}
                        className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                        title="Delete design"
                      >
                        {deleting === design.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </NetworkLayout>
  );
};

export default NetworkDesign;
