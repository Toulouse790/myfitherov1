
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./ui/button";
import { AlertCircle } from "lucide-react";
import { Card } from "./ui/card";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error: error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="w-full max-w-md p-6">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <AlertCircle className="h-16 w-16 text-destructive" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">
                  Une erreur est survenue
                </h1>
                
                <p className="text-muted-foreground">
                  {this.state.error?.message || "Une erreur inattendue s'est produite"}
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => window.history.back()}
                  variant="outline"
                >
                  Retour
                </Button>
                <Button onClick={() => window.location.href = "/"}>
                  Accueil
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
