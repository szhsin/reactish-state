import { useState, useEffect } from 'react';
import { useSnapshot } from 'reactish-state';
import { user, topRepositories } from './store';
import styles from './styles.module.css';

const { fetch } = user.actions;

export default function AsyncExample() {
  const [userName, setUserName] = useState('szhsin');
  const { loading, data, error } = useSnapshot(user);
  const topRepos = useSnapshot(topRepositories);

  useEffect(() => {
    fetch('szhsin');
  }, []);

  const renderUser = () => {
    if (loading) return <h3>Loading...</h3>;
    if (error) return <h3>Oops! Something went wrong.</h3>;
    if (!data) return null;
    return (
      <>
        <h3>Hi {data.name},</h3>
        <div>Here are your top repositories:</div>
        <ul>
          {topRepos?.map(({ id, name, description }) => (
            <li key={id}>
              {name}
              <span className={styles.desc}> - {description}</span>
            </li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <div className={styles.wrapper}>
      <label>
        Type a github user or organization name:
        <input
          className={styles.userInput}
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </label>
      <button onClick={() => fetch(userName)} disabled={loading || !userName.length}>
        Fetch
      </button>
      {renderUser()}
    </div>
  );
}
