import { DocsProvider } from "./components/DocsProvider";
import Sidebar from "./components/Sidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocsProvider>
      <div className="flex flex-1 h-full">
        <Sidebar />
        {children}
      </div>
    </DocsProvider>
  );
}
