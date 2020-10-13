import { useContext } from 'react';
import AuthContext from 'src/contexts/SwoopAuthContext';

const useAuth = () => useContext(AuthContext);

export default useAuth;
