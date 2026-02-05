import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, CreditCard, ArrowUpRight, History, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { WithdrawalModal } from "@/components/WithdrawalModal";

export default function WalletPage() {
  const { user } = useAuth();
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const creditPackages = [
    { id: "p1", amount: 100, price: "$9.99", bonus: "5%" },
    { id: "p2", amount: 500, price: "$44.99", bonus: "15%", popular: true },
    { id: "p3", amount: 2000, price: "$149.99", bonus: "30%" },
  ];

  return (
    <div className="min-h-screen bg-black pb-32 px-6 pt-12 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />

      <div className="max-w-4xl mx-auto z-10 relative">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-display font-bold text-white tracking-tighter mb-2 italic">
              Digital <span className="text-primary italic">Wallet</span>
            </h1>
            <p className="text-muted-foreground uppercase tracking-[0.3em] text-[10px] font-bold">Manage your credits & withdrawals</p>
          </div>
          <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-3">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-2xl font-display text-white">{user?.credits}</span>
          </div>
        </header>

        {/* Balance Card */}
        <Card className="p-8 border-white/5 bg-gradient-to-br from-primary/20 to-transparent backdrop-blur-3xl rounded-[40px] mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">Total Assets</p>
            <h2 className="text-5xl font-display font-bold text-white tracking-tighter mb-4">$ {(((user?.credits || 0) / 10).toFixed(2))} <span className="text-xl text-primary font-sans">EST.</span></h2>
            <div className="flex gap-4">
              <Button className="rounded-2xl h-12 gap-2 bg-white text-black hover:bg-white/90">
                <CreditCard className="w-4 h-4" /> Top Up
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsWithdrawOpen(true)}
                className="rounded-2xl h-12 gap-2 border-white/10 bg-white/5 text-white"
              >
                <ArrowUpRight className="w-4 h-4" /> Withdraw
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <ShieldCheck className="w-32 h-32 text-primary opacity-10" />
          </div>
        </Card>

        {/* Credit Packages */}
        <h3 className="text-xl font-display font-bold text-white mb-6 italic">Purchase Credits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {creditPackages.map((pkg) => (
            <Card key={pkg.id} className={`p-8 border-white/5 bg-white/5 rounded-[32px] hover:border-primary/50 transition-all relative ${pkg.popular ? 'border-primary/50 bg-primary/5' : ''}`}>
              {pkg.popular && (
                <Badge className="absolute top-4 right-4 bg-primary text-white text-[10px] tracking-widest uppercase">Popular</Badge>
              )}
              <h4 className="text-4xl font-display font-bold text-white mb-2">{pkg.amount}</h4>
              <p className="text-xs font-bold text-white/40 uppercase mb-6">Credits</p>
              <div className="text-2xl font-display text-primary mb-6">{pkg.price}</div>
              <Button className={`w-full h-12 rounded-xl font-bold ${pkg.popular ? 'bg-primary' : 'bg-white/5 hover:bg-white/10'}`}>
                Purchase
              </Button>
            </Card>
          ))}
        </div>

        {/* History */}
        <div className="space-y-6">
          <h3 className="text-xl font-display font-bold text-white mb-6 italic flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Transaction History
          </h3>
          <div className="space-y-3">
            {[
              { id: 1, type: "GIFT SENT", amount: "-100", label: "Eternal Heart", date: "Today" },
              { id: 2, type: "RECHARGE", amount: "+500", label: "Credit Pack B", date: "Yesterday" }
            ].map((tx) => (
              <div key={tx.id} className="p-5 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{tx.type}</p>
                  <p className="text-white font-medium">{tx.label}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-display ${tx.amount.startsWith('+') ? 'text-green-400' : 'text-primary'}`}>{tx.amount}</p>
                  <p className="text-[10px] text-white/40">{tx.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <WithdrawalModal 
        isOpen={isWithdrawOpen} 
        onClose={() => setIsWithdrawOpen(false)} 
        balance={user?.credits || 0} 
      />
    </div>
  );
}
