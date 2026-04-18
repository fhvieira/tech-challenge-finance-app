import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        
        <Header />

        {/* Page content */}
        <main className="p-6 overflow-auto">
          {children}
        </main>

      </div>
    </div>
  );
}