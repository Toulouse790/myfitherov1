import React from 'react';
import { Card } from "@/components/ui/card";

interface TableRelation {
  from: string;
  to: string;
  type: 'one-to-many' | 'many-to-one' | 'many-to-many';
}

const databaseRelations: TableRelation[] = [
  { from: 'profiles', to: 'questionnaire_responses', type: 'one-to-many' },
  { from: 'profiles', to: 'user_nutrition_preferences', type: 'one-to-many' },
  { from: 'profiles', to: 'workout_templates', type: 'one-to-many' },
  { from: 'profiles', to: 'workout_sessions', type: 'one-to-many' },
  { from: 'profiles', to: 'food_journal_entries', type: 'one-to-many' },
  { from: 'profiles', to: 'user_daily_calories', type: 'one-to-many' },
  { from: 'profiles', to: 'muscle_measurements', type: 'one-to-many' },
  { from: 'profiles', to: 'training_stats', type: 'one-to-many' },
  { from: 'profiles', to: 'user_preferences', type: 'one-to-many' },
  { from: 'profiles', to: 'user_suggested_foods', type: 'one-to-many' },
  { from: 'workout_sessions', to: 'exercise_sets', type: 'one-to-many' },
  { from: 'workout_sessions', to: 'training_stats', type: 'one-to-many' },
];

export const SchemaVisualizer = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Schéma de la Base de Données</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {databaseRelations.map((relation, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">{relation.from}</div>
              <div className="text-sm text-muted-foreground">
                {relation.type === 'one-to-many' ? '1:N' : 
                 relation.type === 'many-to-one' ? 'N:1' : 'N:N'}
              </div>
              <div className="font-medium">{relation.to}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};