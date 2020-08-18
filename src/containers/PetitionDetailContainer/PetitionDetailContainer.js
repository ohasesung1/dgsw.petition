import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import usePending from 'lib/HookState/usePending';
import PetitionDetailTemplate from 'components/PetitionDetail/PetitionDetailTemplate';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import SecureLS from 'secure-ls';
import SideAllowedPetitionItem from 'components/PetitionDetail/SideAllowedPetitionItem/SideAllowedPetitionItem';
import GroupingState from 'lib/HookState/GroupingState';
import TokenVerification from 'lib/Token/TokenVerification';
import RefreshToken from 'lib/Token/RefreshToken';

const PetitionDetailContainer = ({ store, history }) => {
  const { getPetitionDetail, PetitionDetailData, deletePetition, answerToPetition, blindPetition, writePetitionComment, getPetitionFeed, allowedPetitions, updatePetitionAnswer} = store.petitionStore;

  const { modal } = store.dialog;
  const [detailData, setDetailData] = useState({});
  const [commentContents, setCommentContents] = useState('');
  const [answerContents, setAnswerContents] = useState('');
  const [sideAllowedPetition, setSideAllowedPetition] = useState([]);
  const [adminAuth, setAdminAuth] = useState(false);

  const idx = localStorage.getItem("petition-idx");

  
  const ls = new SecureLS({ encodingType: 'aes' });

  const userInfo = ls.get('user-info');


  const handleAnswerPetitionUpdate = async (idx) => {
    if (answerContents.length === 0) {
      await modal({
        title: 'Warning!',
        stateType: 'warning',
        contents: '글을 작성해 주세요.',
      });

      return;
    }

    const data = {
      petitionIdx: idx,
      contents: answerContents,
    };

    await modal({
      modalType: 'basic',
      title: 'Warning!',
      contents: '해당 청원 글의 답변을 수정하시겠습니까?',
      confirmFunc: async () => {
        await updatePetitionAnswer(data).
          then((response) => {
            modal({
              title: 'Success!',
              stateType: 'success',
              contents: '답변을 수정 하였습니다.',
            });
          })
          .catch((error) => {
            const { status } = error.response;

            if (status === 400) {
              modal({
                title: 'Error!',
                stateType: 'error',
                contents: '양식을 확인해 주세요.'
              });
    
              return;
            }

            if (status === 403) {
              modal({
                title: 'Error!',
                stateType: 'error',
                contents: '권한 없음!'
              });
    
              return;
            }

            if (status === 410) {
              RefreshToken(modal, status, () => {
                updatePetitionAnswer(data);
              });
            }
    
            if (status === 500) {
              modal({
                title: 'Error!',
                stateType: 'error',
                contents: '서버 에러! 조금만 기다려 주세요. (__)'
              });
    
              return;
            }
          });
      }
    });
  }

  const handleAnswerPetition = async (idx) => {

    if (answerContents.length === 0) {
      await modal({
        title: 'Warning!',
        stateType: 'warning',
        contents: '글을 작성해 주세요.',
      });

      return;
    }

    const data = {
      petitionIdx: idx,
      contents: answerContents,
    };

    await modal({
      modalType: 'basic',
      title: 'Warning!',
      contents: '해당 청원 글에 대해 답변 처리하시겠습니까?',
      confirmFunc: async () => {
        await answerToPetition(data).
          then((response) => {
            modal({
              title: 'Success!',
              stateType: 'success',
              contents: '답변을 작성 하였습니다.',
            });
          })
          .catch((error) => {
            const { status } = error.response;

            if (status === 400) {
              modal({
                title: 'Error!',
                stateType: 'error',
                contents: '양식을 확인해 주세요.'
              });
    
              return;
            }

            if (status === 403) {
              modal({
                title: 'Error!',
                stateType: 'error',
                contents: '권한 없음!'
              });
    
              return;
            }

            if (status === 405) {
              modal({
                title: 'Error!',
                stateType: 'error',
                contents: '이미 답변 처리 된 청원입니다.'
              });
    
              return;
            }

            if (status === 410) {
              RefreshToken(modal, status, () => {
                answerToPetition(data);
              });
            }
    
            if (status === 500) {
              modal({
                title: 'Error!',
                stateType: 'error',
                contents: '서버 에러! 조금만 기다려 주세요. (__)'
              });
    
              return;
            }
          });
      }
    });
  };


  const handleBlindPetition = async (idx, isBlind) => {
    let guideStr = '';
    const data = {
      idx,
      isBlind,
    };

    if (!isBlind) {
      guideStr = '블라인드 해제';
    } else {
      guideStr = '블라인드';
    }

    await modal({
      modalType: 'basic',
      title: 'Warning!',
      contents: `해당 청원 글을 ${guideStr} 처리하시겠습니까?`,
      confirmFunc: async () => {
        await blindPetition(data).
          then((response) => {
            modal({
              title: 'Success!',
              stateType: 'success',
              contents: `청원이 성공적으로 ${guideStr} 처리되었습니다.`,
            });
            history.push('/dgsw.petition');
          })
          .catch((error) => {
            const { status } = error.response;
            if (status === 403) {
              modal({
                title: 'Error!',
                stateType: 'error',
                contents: '권한 없음!'
              });
    
              return;
            }

            if (status === 410) {
              RefreshToken(modal, status, () => {
                blindPetition(data);
              });
            }
    
            if (status === 500) {
              modal({
                title: 'Error!',
                stateType: 'error',
                contents: '서버 에러! 조금만 기다려 주세요. (__)'
              });
    
              return;
            }
          });
      }
    });
  };

  const handleadminAuth = () => {
    const token = TokenVerification() === 'localT' ? localStorage.getItem('petition-token') : sessionStorage.getItem('petition-token'); 

    if (token) {
      if (userInfo.accessLevel === 0 || userInfo.accessLevel === 1) {
        setAdminAuth(true);
      } else if (userInfo.accessLevel === 2) {
        return;
      }
    } else {
      return;
    }
  };

  const handlePetitionDetail = async () => {
    await getPetitionDetail(idx);
  };

  const handlePetitionDelete = async (idx) => {
    await modal({
      modalType: 'basic',
      title: 'Warning!',
      contents: '해당 청원 글을 삭제 하시겠습니까?',
      confirmFunc: async () => {
        await deletePetition(idx).
          then((response) => {
            modal({
              title: 'Success!',
              stateType: 'success',
              contents: '청원이 성공적으로 삭제 되었습니다.',
            });
            history.push('/dgsw.petition');
          })
          .catch((error) => {
            const { status } = error.response;
            if (status === 400) {
              modal({
                title: 'Error!',
                stateType: 'error',
                contents: '양식이 맞지 않아요!'
              });
    
              return;
            }

            if (status === 410) {
              RefreshToken(modal, status, () => {
                deletePetition(idx);
              });
            }
    
            if (status === 500) {
              modal({
                title: 'Error!',
                stateType: 'error',
                contents: '서버 에러! 조금만 기다려 주세요. (__)'
              });
    
              return;
            }
          });
      }
    });
  };

  const handleWritePagePath = async () => {
    const token = TokenVerification() === 'localT' ? localStorage.getItem('petition-token') : sessionStorage.getItem('petition-token'); 

    if (token === null) {
      await modal({
        title: 'Warning!',
        stateType: 'warning',
        contents: '로그인 후 이용해 주세요.'
      });

      return;
    }

    history.push('/dgsw.petition/petition-write');
  };

  const handleSideAllowedPetition = async () => {
    await getPetitionFeed(1, 5, 'allowed');
  };

  const handleWriteComment = async (petitionIdx) => {
    const token = TokenVerification() === 'localT' ? localStorage.getItem('petition-token') : sessionStorage.getItem('petition-token'); 
    
    if (token === null) {
      await modal({
        title: 'Warning!',
        stateType: 'warning',
        contents: '로그인 후 이용해 주세요.'
      });

      return;
    }
    
      
    if (commentContents.length === 0) {
      await modal({
        title: 'Warning!',
        stateType: 'warning',
        contents: '댓글을 작성 해주세요.'
      });

      return;
    }

    let data = {
      petitionIdx,
      contents: commentContents,
    };

    await writePetitionComment(data).
      then((response) => {
        modal({
          title: 'Success!',
          stateType: 'success',
          contents: '댓글 작성 성공!'
        });

        getData();
  
        return;
      })
      .catch((error) => {
        const { status } = error.response;

        if (status === 400) {
          modal({
            title: 'Warning!',
            stateType: 'warning',
            contents: '양식이 맞지 않습니다.'
          });
    
          return;
        }

        if (status === 403) {
          modal({
            title: 'Warning!',
            stateType: 'warning',
            contents: '이미 동의한 청원 입니다.'
          });
    
          return;
        }

        if (status === 405) {
          modal({
            title: 'Warning!',
            stateType: 'warning',
            contents: '이미 승인 처리 된 청원 입니다.'
          });
    
          return;
        }

        if (status === 410) {
          RefreshToken(modal, status, () => {
            writePetitionComment(data);
          });
        }


        if (status === 500) {
          modal({
            title: 'Error!',
            stateType: 'error',
            contents: '서버 에러! 조금만 기다려 주세요. (__)'
          });

          return;
        }

      });
  };

  const [isLoading, getData] = usePending(handlePetitionDetail);
  const [isLoadingSideAllowedPeition, getSideAllowedPetition] =usePending(handleSideAllowedPetition);
  
  useEffect(() => {
    handleadminAuth();
  }, []);
  useEffect(() => {
    getData();
    getSideAllowedPetition();
    window.scrollTo(0, 0);
  }, [idx]);

  useEffect(() => {
    setDetailData(PetitionDetailData);
  }, [PetitionDetailData]);
  const test = () => {

  }

  useEffect(() => {
    if (allowedPetitions) {
      let itemList = [];
      for (let i = 0; i <allowedPetitions.length; i ++) {
        itemList.push(<SideAllowedPetitionItem key={allowedPetitions[i].idx} count={i} item={allowedPetitions[i]}/>);
      }
      setSideAllowedPetition(itemList);
    }
  }, [allowedPetitions]);

  return (
    <PetitionDetailTemplate
      detailData={detailData}
      commentContentsObj = {GroupingState('commentContents', commentContents, setCommentContents)}
      answerContentsObj = {GroupingState('answerContents', answerContents, setAnswerContents)}
      handleWriteCommentFunc = {handleWriteComment}
      handleAnswerPetitionUpdate = {handleAnswerPetitionUpdate}
      handlePetitionDelete={handlePetitionDelete}
      handleWritePagePath={handleWritePagePath}
      sideAllowedPetition={sideAllowedPetition}
      adminAuth={adminAuth}
      handleBlindPetition={handleBlindPetition}
      handleAnswerPetition={handleAnswerPetition}
    />
  );
};

PetitionDetailContainer.propTypes = {
  store: PropTypes.any,
  history: PropTypes.any
};

export default inject('store')(observer(withRouter(PetitionDetailContainer)));