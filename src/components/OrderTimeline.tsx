import React from 'react';
import { Check } from 'lucide-react';
import type { OrderStatus } from '../types';

/** Linear step flow visible in the timeline (rejected/cancelled = terminal, no timeline) */
const STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'pending', label: 'Diajukan' },
  { key: 'awaiting_payment', label: 'Bayar' },
  { key: 'awaiting_confirmation', label: 'Konfirmasi' },
  { key: 'active', label: 'Aktif' },
];

/** Map each step to a date source in RentalOrder */
const STEP_DATE_KEY: Record<OrderStatus, string | null> = {
  pending: 'createdAt',
  awaiting_payment: 'paidAt',
  awaiting_confirmation: 'paidAt',
  active: null,
  rejected: null,
  cancelled: null,
  completed: null,
};

/** Step visual states */
type StepState = 'done' | 'active' | 'pending';

function getStepState(stepIndex: number, currentIndex: number, status: OrderStatus): StepState {
  if (status === 'completed' && stepIndex <= 3) return 'done';
  if (status === 'active' && stepIndex <= 3) return stepIndex < 3 ? 'done' : 'active';
  if (status === 'awaiting_confirmation' && stepIndex <= 2) return stepIndex < 2 ? 'done' : 'active';
  if (status === 'awaiting_payment' && stepIndex <= 1) return stepIndex < 1 ? 'done' : 'active';
  if (status === 'pending' && stepIndex === 0) return 'active';
  if (stepIndex < currentIndex) return 'done';
  if (stepIndex === currentIndex) return 'active';
  return 'pending';
}

function getStepIndex(status: OrderStatus): number {
  return STEPS.findIndex((s) => s.key === status);
}

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

/** Format tanggal di bawah step */
function StepDate({ state, stepKey, createdAt, paidAt }: {
  state: StepState;
  stepKey: OrderStatus;
  createdAt: string;
  paidAt?: string | null;
}) {
  if (state === 'pending') return null;
  const dateKey = STEP_DATE_KEY[stepKey];
  if (!dateKey) return null;
  const date = dateKey === 'createdAt' ? createdAt : paidAt;
  if (!date) return null;
  return (
    <span className="text-[10px] text-outline font-medium mt-1">
      {fmtDate(date)}
    </span>
  );
}

/** Dot icon per state */
function StepDot({ state }: { state: StepState }) {
  if (state === 'done') {
    return (
      <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center ring-4 ring-surface-container-low shadow-sm">
        <Check className="w-3.5 h-3.5 font-bold" strokeWidth={3} />
      </div>
    );
  }
  if (state === 'active') {
    return (
      <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center ring-4 ring-surface-container-low shadow-sm animate-pulse">
        <div className="w-2 h-2 rounded-full bg-current" />
      </div>
    );
  }
  return (
    <div className="w-6 h-6 rounded-full bg-surface-container-lowest border-2 border-surface-container flex items-center justify-center">
      <div className="w-1.5 h-1.5 rounded-full bg-surface-container" />
    </div>
  );
}

/** Connector line antar step */
function Connector({ state }: { state: StepState }) {
  return (
    <div className={`flex-1 h-0.5 rounded-full mx-1 ${state === 'done' ? 'bg-primary' : 'bg-surface-container'}`} />
  );
}

/**
 * OrderTimeline — horizontal stepper for order progress.
 *
 * Shows linear flow: Diajukan → Bayar → Konfirmasi → Aktif
 * Terminal states (rejected/cancelled/completed) → no timeline (parent hides this component).
 */
export const OrderTimeline: React.FC<{
  status: OrderStatus;
  createdAt: string;
  paidAt?: string | null;
}> = ({ status, createdAt, paidAt }) => {
  const currentIndex = getStepIndex(status);

  return (
    <div className="relative max-w-3xl mx-auto px-4">
      {/* Track Background */}
      <div className="absolute top-3 left-4 right-4 h-0.5 bg-surface-container z-0" />

      <div className="relative z-10 flex justify-between items-start">
        {STEPS.map((step, i) => {
          const state = getStepState(i, currentIndex, status);
          const isDone = state === 'done';
          const isActive = state === 'active';

          return (
            <React.Fragment key={step.key}>
              {/* Step */}
              <div className="flex flex-col items-center w-20">
                <StepDot state={state} />
                <div className="mt-3 flex flex-col items-center">
                  <span className={`text-[11px] font-bold uppercase tracking-tight ${
                    isDone ? 'text-primary' : isActive ? 'text-primary' : 'text-outline'
                  }`}>
                    {step.label}
                  </span>
                  <StepDate
                    state={state}
                    stepKey={step.key}
                    createdAt={createdAt}
                    paidAt={paidAt}
                  />
                </div>
              </div>

              {/* Connector (except after last step) */}
              {i < STEPS.length - 1 && (
                <Connector state={state} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
