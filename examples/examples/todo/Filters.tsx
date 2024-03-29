import { useSnapshot } from 'reactish-state';
import { visibilityFilterState, VisibilityFilter } from './store';
import styles from './styles.module.css';

const filterList: VisibilityFilter[] = ['ALL', 'ACTIVE', 'COMPLETED'];

const Filters = () => {
  const visibilityFilter = useSnapshot(visibilityFilterState);

  return (
    <div className={styles.filters}>
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
