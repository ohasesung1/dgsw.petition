import React, { useState } from 'react';
import SignUpTemplate from 'components/Sign/SignUpTemplate/SignUpTemplate';
import { inject, observer } from 'mobx-react';
import GroupingState from 'lib/HookState/GroupingState';
import sha512 from 'js-sha512';

const SignUpContainer = ({ store, setIsSignUp, setIsLogin }) => {
  const { handleSignUp, sendValidateEmail, validateEmailCode } = store.sign;
  const { modal } = store.dialog;

  const [grade, setGrade] = useState(1);
  const [number, setNumber] = useState(0);
  const [studentClass, setStudentClass] = useState(1);

  const [name ,setName] = useState('');
  const [id ,setId] = useState('');
  const [pw, setPw] = useState('');
  const [checkPw, setCheckPw] = useState('');
  const [isSendEmail, setIsSendEmail] = useState(false);
  const [emailCode, setEmailCode] = useState('');
  const [isEmailValidate, setIsEmailValidate] = useState(false);

  const handleSignUpFunc = async () => {
    if (number === 0) {
      await modal({
        title: 'Warning!',
        stateType: 'warning',
        contents: '번호를 입력해주세요.'
      });

      return;
    }

    if (id.length === 0 || pw.length === 0) {
      await modal({
        title: 'Warning!',
        stateType: 'warning',
        contents: 'ID 혹은 PW를 입력하세요.'
      });

      return;
    }

    if (name.length === 0) {
      await modal({
        title: 'Warning!',
        stateType: 'warning',
        contents: '이름을 입력하세요.'
      });

      return;
    }

    if (!isEmailValidate) {
      await modal({
        title: 'Warning!',
        stateType: 'warning',
        contents: '이메일 체크를 해주세요.'
      });

      return;
    }
    if (pw.length === 0 || checkPw.length === 0) {
      await modal({
        title: 'Error!',
        stateType: 'error',
        contents: '빈칸을 채워주세요.'
      });

      return;
    } else if (pw !== checkPw) {
      await modal({
        title: 'Error!',
        stateType: 'error',
        contents: '비밀번호가 다릅니다.'
      });

      return;
    }  else if (!(/^[a-zA-Z0-9!@#$%^*+=-]{7,20}$/).test(pw)) {
      await modal({
        title: 'Error!',
        stateType: 'error',
        contents: '비밀번호 형식을 지키세요!!'
      });

      return;
    }
    let data = {
      id: id + '@dgsw.hs.kr',
      pw: sha512(pw),
      name,
      grade,
      number,
      studentClass,
      certification: isEmailValidate,
    };

    await handleSignUp(data)
      .then((response) => {
        modal({
          title: 'Success!',
          stateType: 'success',
          contents: '회원가입 완료.'
        });
        
        setIsSignUp(false);
        setIsLogin(true);
      })
      .catch((error) => {
        const { status } = error.response;
        if (status === 403) {
          modal({
            title: 'Warning!',
            stateType: 'warning',
            contents: '이미 가입된 회원.'
          });
    
          return;
        } else  if (status === 400) {
          modal({
            title: 'Warning!',
            stateType: 'warning',
            contents: '양식이 맞지 않습니다.'
          });
    
          return;
        }  else if (status === 500) {
          modal({
            title: 'Error!',
            stateType: 'error',
            contents: '서버 에러!'
          });
    
          return;
        }
      });
  };

  const checkNewPwForm = async () => {
    if (pw.length === 0 || checkPw.length === 0) {
      await modal({
        title: 'Error!',
        stateType: 'error',
        contents: '빈칸을 채워주세요.'
      });

      return;
    } else if (pw !== checkPw) {
      await modal({
        title: 'Error!',
        stateType: 'error',
        contents: '비밀번호가 다릅니다.'
      });

      return;
    }  else if (!(/^[a-zA-Z0-9!@#$%^*+=-]{7,20}$/).test(pw)) {
      await modal({
        title: 'Error!',
        stateType: 'error',
        contents: '비밀번호 형식을 지키세요!!'
      });

      return;
    }
    let data = {
      id,
      pw: sha512(pw),
      name,
      grade,
      number,
      studentClass
    };

    await handleSignUp(data)
      .then((response) => {
        modal({
          title: 'Success!',
          stateType: 'success',
          contents: '회원가입 완료.'
        });
        
        setIsSignUp(false);
        setIsLogin(true);
      })
      .catch((error) => {
        const { status } = error.response;
        if (status === 403) {
          modal({
            title: 'Warning!',
            stateType: 'warning',
            contents: '이미 가입된 회원.'
          });
    
          return;
        } else  if (status === 400) {
          modal({
            title: 'Warning!',
            stateType: 'warning',
            contents: '양식이 맞지 않습니다.'
          });
    
          return;
        }  else if (status === 500) {
          modal({
            title: 'Error!',
            stateType: 'error',
            contents: '서버 에러!'
          });
    
          return;
        }
      });
  };

  const sendEmailCode = async () => {
    if (id.length === 0) {
      await modal({
        title: 'Warning!',
        stateType: 'warning',
        contents: 'ID를 입력하세요.'
      });

      return;
    }

    const data = {
      email: id + '@dgsw.hs.kr',
    };

    await sendValidateEmail(data).
      then(async (response) => {
        await modal({
          title: 'Success',
          stateType: 'success',
          contents: '이메일을 보냈습니다.'
        });

        setIsSendEmail(true);
      })
      .catch(async (error) => {
        const { status } = error.response;

        if (status === 400) {
          await modal({
            title: 'Warning!',
            stateType: 'warning',
            contents: '양식을 맞춰주세요'
          });

          return;
        } else if (status === 403) {
          await modal({
            title: 'Warning!',
            stateType: 'warning',
            contents: '이미 가입된 ID입니다.'
          });
    
          return;
        } else if (status === 500) {
          await modal({
            title: 'Error!',
            stateType: 'error',
            contents: '서버 에러!'
          });
    
          return;
        }
      });
  };

  const checkEmailCode = async () => {

    let data = {
      email: id + '@dgsw.hs.kr',
      code: emailCode,
    };

    await validateEmailCode(data).
      then(async (response) => {
        await modal({
          title: 'Success',
          stateType: 'success',
          contents: '이메일을 검증 성공!'
        });

        setIsEmailValidate(true);
      })
      .catch(async (error) => {
        const { status } = error.response;

        if (status === 403) {
          await modal({
            title: 'Warning!',
            stateType: 'warning',
            contents: '검증 실패!.'
          });
    
          return;
        } else if (status === 500) {
          await modal({
            title: 'Error!',
            stateType: 'error',
            contents: '서버 에러!'
          });
    
          return;
        }
      });
  };

  return (
    <SignUpTemplate
      idObj={GroupingState('id', id, setId)}
      pwObj={GroupingState('pw', pw, setPw)}
      checkPwObj={GroupingState('checkPw', checkPw, setCheckPw)}
      gradeObj={GroupingState('grade', grade, setGrade)}
      numberObj={GroupingState('number', number, setNumber)}
      studentClassObj={GroupingState('studentClass', studentClass, setStudentClass)}
      nameObj={GroupingState('name', name, setName)}
      emailCodeObj={GroupingState('emailCode', emailCode, setEmailCode)}
      checkEmailCode={checkEmailCode}
      isEmailValidate={isEmailValidate}
      isSendEmail={isSendEmail}
      sendEmailCode={sendEmailCode}
      handleSignUpFunc={handleSignUpFunc}
      setIsSignUp={setIsSignUp}
      setIsLogin={setIsLogin}
    />
  );
};

export default inject('store')(observer(SignUpContainer));

