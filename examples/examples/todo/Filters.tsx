import { useSnapshot } from 'reactish-state';
import { visibilityFilterState, VisibilityFilter } from './todo';

const filterList: VisibilityFilter[] = ['ALL', 'IN_PROGRESS', 'COMPLETED'];

const Filters = () => {
  const visibilityFilter = useSnapshot(visibilityFilterState);

  return (
    <div>
      {filterList.map((filter) => (
        <label key={filter}>
          <input
            type="radio"
            name="filters"
            checked={filter === visibilityFilter}
            onChange={(e) => e.currentTarget.checked && visibilityFilterState.set(filter)}
          />
          {filter}
        </label>
      ))}
    </div>
  );
};

export { Filters };
