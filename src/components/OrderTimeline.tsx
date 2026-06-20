import React from 'react';
import { CheckCircle, Circle, CircleDot } from 'lucide-react';
import type { OrderStatus } from '../types';

/** Linear step flow visible in the timeline (rejected/cancelled = terminal, no timeline) */
const STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'pending', label: 'Ajukan' },
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
    <span className="text-[9px] font-semibold text-slate-400 mt-0.5">
      {fmtDate(date)}
    </span>
  );
}

/** Dot icon per state */
function StepDot({ state }: { state: StepState }) {
  if (state === 'done') {
    return (
      <CheckCircle
        className="w-4 h-4 text-emerald-500 shrink-0"
        strokeWidth={2.5}
        aria-label="selesai"
      />
    );
  }
  if (state === 'active') {
    return (
      <span className="relative flex w-4 h-4 shrink-0">
        <CircleDot
          className="w-4 h-4 text-blue-500 shrink-0"
          strokeWidth={2.5}
          aria-label="sedang"
        />
      </span>
    );
  }
  return (
    <Circle
      className="w-4 h-4 text-slate-300 shrink-0"
      strokeWidth={2}
      aria-label="belum"
    />
  );
}

/** Connector line antar step */
function Connector({ state }: { state: StepState }) {
  return (
    <div
      className={`flex-1 h-0.5 rounded-full mx-1 ${
        state === 'done' ? 'bg-emerald-400' : 'bg-slate-200'
      }`}
    />
  );
}

/**
 * OrderTimeline — horizontal stepper for order progress.
 *
 * Shows linear flow: Ajukan → Bayar → Konfirmasi → Aktif
 * Terminal states (rejected/cancelled/completed) → no timeline (parent hides this component).
 *
 * Props match RentalOrder fields so parent can pass order directly.
 */
export const OrderTimeline: React.FC<{
  status: OrderStatus;
  createdAt: string;
  paidAt?: string | null;
}> = ({ status, createdAt, paidAt }) => {
  const currentIndex = getStepIndex(status);

  return (
    <div
      className="flex items-center w-full overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory"
      role="list"
      aria-label="Progress pesanan"
    >
      {STEPS.map((step, i) => {
        const state = getStepState(i, currentIndex, status);
        return (
          <React.Fragment key={step.key}>
            {/* Step */}
            <div className="flex flex-col items-center gap-1 shrink-0 snap-center">
              <StepDot state={state} />
              <span
                className={`text-[10px] font-bold whitespace-nowrap ${
                  state === 'done'
                    ? 'text-emerald-600'
                    : state === 'active'
                    ? 'text-blue-600'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
              <StepDate
                state={state}
                stepKey={step.key}
                createdAt={createdAt}
                paidAt={paidAt}
              />
            </div>

            {/* Connector (except after last step) */}
            {i < STEPS.length - 1 && (
              <Connector state={state} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
