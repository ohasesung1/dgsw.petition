import SecureLS from 'secure-ls';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { SERVER } from 'config/config.json';
import TokenVerification from './TokenVerification';
import { useLocation } from 'react-router-dom';

// 토큰 만료시 재발급하는 로직입니다.
const RefreshToken = async (modal, tokenStatus, requestFunction) => {
  const current_time = new Date().getTime() / 1000;
  
  const refreshToken = TokenVerification() === 'localT' ? localStorage.getItem('petition-reToken') : sessionStorage.getItem('petition-reToken');

  const token = TokenVerification() === 'localT' ? localStorage.getItem('petition-token') : sessionStorage.getItem('petition-token');

  const decode = jwt.decode(token);

  const setToken = (response) => {
    const { token } = response.data.data;

    if (TokenVerification() === 'localT') {
      localStorage.setItem('petition-token', token);
    } else {
      sessionStorage.setItem('petition-token', token);
    }
  };

  const signOut = () => {
    const closeFunc = () => {
      localStorage.removeItem('petition-token');
      localStorage.removeItem('petition-reToken');
      sessionStorage.removeItem('petition-token');
      sessionStorage.removeItem('petition-reToken');
      
      const ls = new SecureLS({ encodingType: 'aes' });
    
      ls.removeAll();

      // eslint-disable-next-line react-hooks/rules-of-hooks
      let location = useLocation();
    
      location.href = `'/${location.pathname}`;
    };

    modal({
      title: 'Info!',
      stateType: 'info',
      contents: '세션이 만료되었습니다. 다시 로그인해주세요.',
      closeFunc
    });
  };

  if (tokenStatus === 410 && current_time > decode.exp) {
    await axios.post(`${SERVER}/token/refresh`, { refreshToken })
      .then(async response => {
        await setToken(response);
      })
      .catch(async error => {
        await signOut();

        return;
      })
      .then(() => {
        // always executed
      });
  }

  await requestFunction();

  return;
};

export default RefreshToken;