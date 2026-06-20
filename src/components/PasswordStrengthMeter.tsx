import React from 'react';
import { checkPasswordStrength } from '../lib/passwordPolicy';

interface Props {
  password: string;
}

export const PasswordStrengthMeter: React.FC<Props> = ({ password }) => {
  if (!password) return null;
  const { score, label, color, feedback } = checkPasswordStrength(password);

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: i < score ? color : '#e5e7eb' }}
          />
        ))}
      </div>
      <p className="text-xs font-medium" style={{ color }}>
        {label}
      </p>
      {feedback.length > 0 && (
        <ul className="text-xs text-slate-500 space-y-0.5">
          {feedback.map((item) => (
            <li key={item} className="flex items-center gap-1">
              <span className="text-slate-300">·</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
