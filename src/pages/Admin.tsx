import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Shield, Wallet, Activity, 
  CheckCircle2, XCircle, AlertTriangle, ChevronRight 
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function Admin() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: stats } = useQuery<any>({ queryKey: ["/api/admin/stats"] });
  const { data: users } = useQuery<any[]>({ queryKey: ["/api/admin/users"] });
  const { data: withdrawals } = useQuery<any[]>({ queryKey: ["/api/admin/withdrawals"] });
  const { data: audits } = useQuery<any[]>({ queryKey: ["/api/admin/audits"] });

  const processWithdrawal = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const res = await fetch(`/api/admin/withdrawals/${id}/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/withdrawals"] }),
  });

  if (user?.role !== 'admin') return <Redirect to="/" />;

  return (
    <div className="min-h-screen bg-black pb-32 px-6 pt-12 overflow-hidden relative">
      <div className="max-w-7xl mx-auto z-10 relative">
        <header className="mb-12">
          <h1 className="text-4xl font-display font-bold text-white tracking-tighter mb-2 italic">
            System <span className="text-primary italic">Oversight</span>
          </h1>
          <p className="text-muted-foreground uppercase tracking-[0.3em] text-[10px] font-bold">Admin Command Center</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Users", value: stats?.users, icon: Users, color: "text-blue-400" },
            { label: "Active Couples", value: stats?.couples, icon: Activity, color: "text-primary" },
            { label: "Economy Volume", value: `${stats?.economyVolume} CR`, icon: Wallet, color: "text-green-400" },
            { label: "System Status", value: stats?.systemHealth, icon: Shield, color: "text-purple-400" },
          ].map((s, i) => (
              <Card key={i} className="p-6 border-white/5 bg-white/5 rounded-3xl">
                <s.icon className={`w-6 h-6 ${s.color} mb-4`} />
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{s.label}</p>
                <p className="text-2xl font-display text-white">{s.value || '--'}</p>
              </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Management */}
          <div className="lg:col-span-2 space-y-10">
            {/* Users List */}
            <section>
              <h3 className="text-xl font-display font-bold text-white mb-6 italic">User Management</h3>
              <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
                {users?.slice(0, 5).map((u: any) => (
                  <div key={u.id} className="p-4 border-b border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-white">
                        {u.firstName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{u.firstName} {u.lastName}</p>
                        <p className="text-[10px] text-white/40 uppercase tracking-tighter">{u.email}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[10px]">
                      {u.role}
                    </Badge>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-xs text-white/40 py-4 font-bold border-t border-white/5">
                  View All Users <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </section>

            {/* Withdrawals */}
            <section>
              <h3 className="text-xl font-display font-bold text-white mb-6 italic">Financial Requests</h3>
              <div className="space-y-4">
                {withdrawals?.filter((w: any) => w.withdrawal_requests.status === 'pending').map((w: any) => (
                  <Card key={w.withdrawal_requests.id} className="p-6 border-white/5 bg-white/5 rounded-3xl flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">
                        {w.users.firstName} requested withdrawal
                      </p>
                      <p className="text-2xl font-display text-white">$ {w.withdrawal_requests.amount}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => processWithdrawal.mutate({ id: w.withdrawal_requests.id, status: 'approved' })}
                        className="bg-green-500 hover:bg-green-600 rounded-xl"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => processWithdrawal.mutate({ id: w.withdrawal_requests.id, status: 'rejected' })}
                        className="rounded-xl"
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Reject
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>

            {/* Relationship Disputes (Section P) */}
            <section>
              <h3 className="text-xl font-display font-bold text-white mb-6 italic">Relationship Disputes</h3>
              <Card className="p-8 border-white/5 bg-white/5 rounded-[32px] text-center space-y-4">
                <AlertTriangle className="w-10 h-10 text-yellow-400 mx-auto" />
                <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">No active disputes detected</p>
                <p className="text-xs text-white/20 italic max-w-xs mx-auto">
                  INTIMA AI is currently handling all conflict resolution via the Issue Solver module.
                </p>
              </Card>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-10">
            {/* System Status */}
            <section>
              <h3 className="text-xl font-display font-bold text-white mb-6 italic flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" />
                Live Node Status
              </h3>
              <div className="p-6 rounded-[32px] bg-green-500/10 border border-green-500/20">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Core Engine</span>
                  <Badge className="bg-green-500 text-white border-none">NOMINAL</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[8px] font-bold text-white/40 uppercase tracking-tighter">
                    <span>Database Latency</span>
                    <span>12ms</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[12%]" />
                  </div>
                </div>
              </div>
            </section>

            {/* Security Audits */}
            <section>
              <h3 className="text-xl font-display font-bold text-white mb-6 italic flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Security Logs
              </h3>
            <div className="space-y-3">
              {audits?.slice(0, 10).map((a: any) => (
                <div key={a.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 text-[10px]">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`font-bold uppercase tracking-widest ${
                      a.severity === 'high' ? 'text-red-400' : 'text-blue-400'
                    }`}>
                      {a.eventType}
                    </span>
                    <span className="text-white/20">{new Date(a.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-white/60 leading-relaxed font-medium">
                    {a.details}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
