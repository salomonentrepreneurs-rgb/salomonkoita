// app/crm/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Users, TrendingUp, DollarSign, Target, Plus, Search,
  Phone, Mail, Star, ArrowUpRight, Activity
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip
} from "recharts";

type Lead = {
  id: number;
  company: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  status?: string;
  score?: number;
  estimated_value?: number;
};

export default function CrmPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/crm/leads?limit=20&sort_by=score&sort_order=desc")
      .then(r => r.json())
      .then(d => setLeads(d.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "leads", label: "Leads" },
    { id: "pipeline", label: "Pipeline" },
    { id: "analytics", label: "Analytics" },
  ];

  const stats = [
    { title: "Total Leads", value: leads.length, icon: Users, color: "text-indigo-500" },
    { title: "Pipeline Value", value: "$127,500", icon: DollarSign, color: "text-emerald-500" },
    { title: "Win Rate", value: "68%", icon: TrendingUp, color: "text-amber-500" },
    { title: "AI Score Avg", value: leads.length ? Math.round(leads.reduce((a, l) => a + (l.score || 0), 0) / leads.length) : 0, icon: Target, color: "text-purple-500" },
  ];

  const pipelineData = [
    { name: "Discovery", value: 45000 },
    { name: "Qualification", value: 38000 },
    { name: "Proposal", value: 28500 },
    { name: "Negotiation", value: 16000 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">CRM</h1>
            <p className="text-muted-foreground">AI-powered sales intelligence</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Lead
          </Button>
        </div>
        <div className="flex gap-1 mb-8 p-1 bg-muted rounded-lg w-fit">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}>{tab.label}</button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" /> +12% this week
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-indigo-500" /> Pipeline Value</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pipelineData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Star className="h-5 w-5 text-amber-500" /> AI Top Leads</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leads.slice(0, 5).map((lead, i) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        {(lead.company || "??")[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{lead.company}</p>
                        <p className="text-xs text-muted-foreground">{lead.contact_name || "No contact"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={(lead.score || 0) > 70 ? "default" : "secondary"}>{Math.round(lead.score || 0)}%</Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Phone className="h-3 w-3" /></Button>
                    </div>
                  </div>
                ))}
                {leads.length === 0 && !loading && <p className="text-center text-muted-foreground py-8">No leads yet.</p>}
                {loading && <div className="text-center py-8"><div className="animate-spin h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto" /></div>}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Leads</CardTitle>
              <div className="relative w-64"><Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." className="pl-8" /></div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead><TableHead>Contact</TableHead><TableHead>Email</TableHead>
                  <TableHead>Status</TableHead><TableHead>AI Score</TableHead><TableHead>Value</TableHead><TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map(lead => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.company}</TableCell>
                    <TableCell>{lead.contact_name || "-"}</TableCell>
                    <TableCell>{lead.email || "-"}</TableCell>
                    <TableCell><Badge variant={lead.status === "won" ? "default" : lead.status === "lost" ? "destructive" : "secondary"}>{lead.status || "new"}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500"
                            style={{ width: `${Math.min(100, lead.score || 0)}%` }} />
                        </div>
                        <span className="text-xs">{Math.round(lead.score || 0)}</span>
                      </div>
                    </TableCell>
                    <TableCell>${(lead.estimated_value || 0).toLocaleString()}</TableCell>
                    <TableCell><Button variant="ghost" size="icon" className="h-8 w-8"><Phone className="h-3 w-3" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
