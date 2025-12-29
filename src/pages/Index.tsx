import { NetworkLayout } from "@/components/NetworkLayout";
import { DashboardStats } from "@/components/DashboardStats";
import { NetworkChart } from "@/components/NetworkChart";
import { RecentActivity } from "@/components/RecentActivity";

const Index = () => {
  return (
    <NetworkLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Optical fiber network management dashboard
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-lg border border-success/20">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">All Systems Operational</span>
          </div>
        </div>

        {/* Stats Grid */}
        <DashboardStats />

        {/* Charts and Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <NetworkChart />
          </div>
          <div>
            <RecentActivity />
          </div>
        </div>
      </div>
    </NetworkLayout>
  );
};

export default Index;
