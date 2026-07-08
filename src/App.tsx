import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";

export default function App() {
  return (
    <TooltipProvider>
      <AppLayout />
    </TooltipProvider>
  );
}
