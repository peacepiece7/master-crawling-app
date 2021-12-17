import React, { useCallback, useRef } from 'react';

const crawlWorkForm = ({ onQuery }) => {
  const queryRef = useRef();
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const query = queryRef.current.value;
    onQuery(query);
  }, []);
  // TODO : alex나 특정 manufacture를 선택하는 기능
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <span>쿼리를 입력해 주세요</span>
          <input ref={queryRef} type='text'></input>
        </div>
        <div>
          <input type='submit'></input>
        </div>
      </form>
    </div>
  );
};

export default crawlWorkForm;
