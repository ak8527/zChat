import { getDate } from '../../../../utils/dateTime';
import styles from './DateMessage.module.css';

const DateMessage = ({ date }) => {
  const NOW = Date.now();
  const ONE_DAY = 86400000;
  const TODAY = getDate();
  const YESTERDAY = getDate(NOW - ONE_DAY);
  const MESSAGE_DATE = getDate(date);

  const messageDate =
    MESSAGE_DATE === TODAY
      ? 'Today'
      : MESSAGE_DATE === YESTERDAY
      ? 'Yesterday'
      : `${getDate(date, { day: 'numeric', month: 'short' })}, ${getDate(date, {
          year: 'numeric',
        })}`;

  return <div className={styles.date}>{messageDate}</div>;
};
export default DateMessage;
