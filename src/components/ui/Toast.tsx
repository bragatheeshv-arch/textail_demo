import { AnimatePresence, motion } from 'motion/react';
import { useUI } from '../../store/shopStore';

export default function Toast() {
  const msg = useUI((s) => s.toast);
  return (
    <div aria-live="polite" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] pointer-events-none">
      <AnimatePresence>
        {msg && (
          <motion.p initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }}
            className="bg-ink text-paper text-[13.5px] px-5 py-3 shadow-xl">{msg}</motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
