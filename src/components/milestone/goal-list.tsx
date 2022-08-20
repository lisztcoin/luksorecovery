//@ts-nocheck
import { motion, AnimateSharedLayout } from 'framer-motion';
import GoalDetailsCard from '@/components/milestone/milestone-details/goal-details-card';
import { ExportIcon } from '@/components/icons/export-icon';
// static data
import { getVotesByStatus } from '@/data/static/goal-data';

export default function GoalList({ goals }) {
  return (
    <AnimateSharedLayout>
      <motion.div layout initial={{ borderRadius: 16 }} className="rounded-2xl">
        {goals.map((goal: any) => (
          <GoalDetailsCard key={`${goal.goalName}-key-${goal.id}`} goal={goal} />
        ))}
      </motion.div>
    </AnimateSharedLayout>
  );
}
