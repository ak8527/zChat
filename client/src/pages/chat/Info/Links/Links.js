import { useLocation, useNavigate } from 'react-router-dom';

import Title from '../Title/Title';
import Link from './Link';
import styles from './Links.module.css';

const Links = ({ links }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const urls = links.toReversed().slice(0, 2);

  return (
    <div className={styles.links}>
      <Title
        title={'Links'}
        size={links.length}
        showAll={links.length > 2}
        onClick={() => navigate(`${location.pathname}/links`)}
      />
      <ul>
        {urls.map((link) => (
          <Link key={link._id} link={link.text} />
        ))}
      </ul>
    </div>
  );
};

export default Links;
