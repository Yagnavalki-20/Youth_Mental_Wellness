import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, MessageCircle, BookOpen, User, Home, Shield } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: Home,
    color: "text-teal-600",
  },
  {
    title: "AI Chat",
    url: createPageUrl("Chat"),
    icon: MessageCircle,
    color: "text-blue-600",
  },
  {
    title: "Wellness Tools",
    url: createPageUrl("Wellness"),
    icon: Heart,
    color: "text-pink-600",
  },
  {
    title: "Resources",
    url: createPageUrl("Resources"),
    icon: BookOpen,
    color: "text-purple-600",
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --primary: 215 25% 27%;
          --primary-foreground: 210 40% 98%;
          --secondary: 210 40% 96%;
          --secondary-foreground: 215 25% 27%;
          --accent: 210 40% 94%;
          --accent-foreground: 215 25% 27%;
          --background: 0 0% 100%;
          --foreground: 215 25% 27%;
          --card: 0 0% 100%;
          --card-foreground: 215 25% 27%;
          --border: 220 13% 91%;
          --ring: 215 25% 27%;
          --teal-50: 166 76% 97%;
          --teal-600: 175 84% 32%;
          --coral-400: 14 91% 60%;
        }
        
        .gradient-bg {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }
        
        .card-hover {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
      `}</style>
      
      <div className="min-h-screen flex w-full gradient-bg">
        <Sidebar className="border-r border-slate-200/60 bg-white/70 backdrop-blur-sm">
          <SidebarHeader className="border-b border-slate-200/60 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800 text-lg">MindSpace</h2>
                <p className="text-sm text-slate-500">Your Safe Haven</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`group hover:bg-teal-50 hover:text-teal-700 transition-all duration-200 rounded-xl mb-1 h-12 ${
                          location.pathname === item.url 
                            ? 'bg-teal-50 text-teal-700 shadow-sm' 
                            : 'text-slate-600'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-4 px-4 py-3">
                          <item.icon className={`w-5 h-5 ${location.pathname === item.url ? 'text-teal-600' : 'text-slate-400 group-hover:text-teal-600'}`} />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
                Quick Actions
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 space-y-3">
                  <Link to={createPageUrl("Chat")} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-200 group">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-blue-800 text-sm">Need to Talk?</p>
                      <p className="text-xs text-blue-600">AI Support Available</p>
                    </div>
                  </Link>
                  
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-green-100">
                    <Shield className="w-4 h-4 text-green-600" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-green-800 text-sm">100% Private</p>
                      <p className="text-xs text-green-600">Your data is secure</p>
                    </div>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200/60 p-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
              <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 text-sm truncate">Anonymous User</p>
                <p className="text-xs text-slate-500 truncate">Safe & Confidential</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/70 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-slate-800">MindSpace</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}