import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart, Share2, MessageCircle, Video, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface WorkoutExerciseDetailProps {
  onBack?: () => void;
}

export const WorkoutExerciseDetail: React.FC<WorkoutExerciseDetailProps> = ({ onBack }) => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/workouts');
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    toast({
      title: liked ? "Retiré des favoris" : "Ajouté aux favoris",
      description: liked ? "L'exercice a été retiré de vos favoris" : "L'exercice a été ajouté à vos favoris",
    });
  };

  const handleShare = () => {
    // Simuler le partage
    toast({
      title: "Partage",
      description: "Fonctionnalité de partage bientôt disponible !",
    });
  };

  const handleComment = () => {
    // Simuler les commentaires
    toast({
      title: "Commentaires",
      description: "Fonctionnalité de commentaires bientôt disponible !",
    });
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 space-y-6">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={handleBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>
      
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle>Détails de l'exercice</CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLike}
                className={liked ? "text-red-500" : ""}
              >
                <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleComment}>
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              <Trophy className="w-4 h-4 mr-1" />
              +10 XP
            </Badge>
            <Badge variant="secondary">Niveau 1</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            {showVideo ? (
              <video
                className="w-full h-full object-cover"
                controls
                poster="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
              >
                <source src="/placeholder-video.mp4" type="video/mp4" />
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="gap-2"
                  onClick={() => setShowVideo(true)}
                >
                  <Video className="h-5 w-5" />
                  Voir la vidéo
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Progression</h3>
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Séances</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold">150</p>
                <p className="text-sm text-muted-foreground">XP Gagnés</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Badges</p>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Commentaires récents</h3>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">
                Les commentaires seront bientôt disponibles...
              </p>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};