
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useSleepTracking } from "@/hooks/use-sleep-tracking";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const SleepHistory = () => {
  const { sleepSessions, isLoading } = useSleepTracking();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 flex justify-center">
          <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full" />
        </CardContent>
      </Card>
    );
  }

  if (!sleepSessions || sleepSessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historique du sommeil</CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Aucune donnée de sommeil enregistrée</p>
        </CardContent>
      </Card>
    );
  }

  const totalPages = Math.ceil(sleepSessions.length / itemsPerPage);
  const paginatedSessions = sleepSessions.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy", { locale: fr });
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "HH:mm");
  };

  const getSleepQualityColor = (score?: number) => {
    if (!score) return "bg-gray-200";
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Historique du sommeil
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Horaires</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Qualité</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">
                    {formatDate(session.start_time)}
                  </TableCell>
                  <TableCell>
                    {formatTime(session.start_time)} - {formatTime(session.end_time)}
                  </TableCell>
                  <TableCell>{formatDuration(session.total_duration_minutes)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className={`h-3 w-3 rounded-full ${getSleepQualityColor(session.sleep_score)}`}
                      />
                      <span>{session.sleep_score || "N/A"}</span>
                    </div>
                  </TableCell>
                  <TableCell>{session.is_nap ? "Sieste" : "Nuit"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              Page {currentPage + 1} sur {totalPages}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
