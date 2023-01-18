import { useSnapshot } from 'reactish-state';
import { statsSelector } from './store';

const Stats = () => {
  const { totalNum, completedNum, percentCompleted } = useSnapshot(statsSelector);

  return (
    <div>
      <div>Total: {totalNum}</div>
      <div>Completed: {completedNum}</div>
      <div>Percentage: {Math.round(percentCompleted)}%</div>
    </div>
  );
};

export { Stats };
