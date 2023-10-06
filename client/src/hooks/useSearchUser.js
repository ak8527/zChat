import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getSearchUser } from '../store/user/userMiddleware';

const useSearchUser = () => {
  const dispatch = useDispatch();
  const [userList, setUserList] = useState([]);
  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (nameInput.length > 0)
        dispatch(getSearchUser(nameInput))
          .unwrap()
          .then((response) => setUserList([...response.data.users]))
          .catch((err) => console.log('Error:', err.message));
    }, 500);

    return () => clearTimeout(timer);
  }, [nameInput, dispatch]);

  return { userList, setNameInput };
};

export default useSearchUser;
