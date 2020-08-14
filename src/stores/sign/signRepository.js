import axios from 'axios';
import { SERVER } from 'config/config.json';

class signRepository {
  async handelSignIn (request) {
    try {
      const { data } = await axios.post(`${SERVER}/auth/login`, request);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async handelSignUp (request) {
    try {
      const { data } = await axios.post(`${SERVER}/auth/register`, request);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async sendValidateEmail (request) {
    try {
      const { data } = await axios.post(`${SERVER}/auth/email`, request);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async validateEmailCode (request) {
    try {
      const { data } = await axios.post(`${SERVER}/auth/email/code`, request);
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default new signRepository();
