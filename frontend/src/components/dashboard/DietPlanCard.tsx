import React from 'react';
import { DietPlan } from '../../types';
import { C } from '../../data/seedData';
import { Card } from '../common/Card';

interface DietPlanCardProps {
  diet: DietPlan;
}

export const DietPlanCard: React.FC<DietPlanCardProps> = ({ diet }) => {
  const mealKeys: (keyof Pick<DietPlan, 'breakfast' | 'lunch' | 'dinner' | 'snack'>)[] = [
    'breakfast',
    'lunch',
    'dinner',
    'snack'
  ];

  return (
    <Card style={{ background: C.lGreen, marginBottom: 10 }}>
      <div style={{ fontWeight: 700, color: C.green, fontSize: 13, marginBottom: 6 }}>
        🥗 Indian Diet Plan · {diet.total} kcal/day
      </div>

      {mealKeys
        .filter((k) => diet[k])
        .map((k) => {
          const item = diet[k];
          if (!item) return null;
          return (
            <div
              key={k}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 3,
                gap: 6
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.green,
                  textTransform: 'capitalize',
                  minWidth: 68
                }}
              >
                {k}:
              </span>
              <span style={{ fontSize: 12, color: C.text, flex: 1 }}>
                {item.meal}
              </span>
              {item.cal && (
                <span style={{ fontSize: 10, color: C.muted, whiteSpace: 'nowrap' }}>
                  {item.cal} cal
                </span>
              )}
            </div>
          );
        })}

      {diet.avoid && diet.avoid.length > 0 && (
        <div style={{ fontSize: 11, color: C.red, marginTop: 6 }}>
          ⛔ <b>Avoid:</b> {diet.avoid.join(', ')}
        </div>
      )}

      {diet.tip && (
        <div
          style={{
            fontSize: 11,
            color: C.green,
            marginTop: 6,
            background: 'rgba(5,122,85,0.08)',
            borderRadius: 7,
            padding: '6px 8px'
          }}
        >
          💡 {diet.tip}
        </div>
      )}
    </Card>
  );
};
