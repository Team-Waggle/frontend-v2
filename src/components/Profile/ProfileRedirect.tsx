import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUserMe } from '../../hooks/useUser';

const ProfileRedirect = () => {
  const navigate = useNavigate();
  const { data } = useGetUserMe();

  useEffect(() => {
    if (data?.id) {
      navigate(`/profile/${data.id}`, { replace: true });
    }
  }, [data, navigate]);

  return null;
};

export default ProfileRedirect;
