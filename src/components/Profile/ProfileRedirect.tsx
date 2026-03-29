import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUserMe } from '../../hooks/useUser';

const ProfileRedirect = () => {
  const navigate = useNavigate();
  const { data } = useGetUserMe();

  useEffect(() => {
    if (data?.userId) {
      navigate(`/profile/${data.userId}`, { replace: true });
    }
  }, [data, navigate]);

  return null;
};

export default ProfileRedirect;
