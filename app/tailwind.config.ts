import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        visit: {
          scheduled: '#3B82F6',
          completed: '#22C55E',
          cancelled: '#EF4444',
          rescheduled: '#EAB308',
          finalized: '#A855F7',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
