//@ts-nocheck
import { motion, AnimateSharedLayout } from 'framer-motion';
import GoalDetailsCard from '@/components/milestone/milestone-details/goal-details-card';
import { ExportIcon } from '@/components/icons/export-icon';
// static data
import { getVotesByStatus } from '@/data/static/goal-data';
import AchievementDetailsCard from './milestone-details/achievement-details-card';

export default function AchievementList({ milestones }) {
  return (
    <AnimateSharedLayout>
      <motion.div layout initial={{ borderRadius: 16 }} className="rounded-2xl">
        {milestones.map((milestone: any) => (
          <AchievementDetailsCard key={milestone.goalid} milestone={milestone} />
        ))}
      </motion.div>
    </AnimateSharedLayout>
  );
}
