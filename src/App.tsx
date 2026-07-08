import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthScreen } from "@/components/auth/AuthScreen";

export default function App() {
  return (
    <TooltipProvider>
      <SignedOut>
        <AuthScreen />
      </SignedOut>
      <SignedIn>
        <AppLayout />
      </SignedIn>
    </TooltipProvider>
  );
}
