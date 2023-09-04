import { useState } from 'react';
import eye from '../assets/icons/eye.svg';
import eyeClose from '../assets/icons/eye-off.svg';

const UsePasswordToggle = (): ['text' | 'password', JSX.Element] => {
  const [visible, setVisible] = useState<boolean>(false);

  const Icon = (
    <img
      src={visible ? eye : eyeClose}
      alt="eye"
      onClick={() => {
        setVisible(!visible);
      }}
    />
  );

  const InputType = visible ? 'text' : 'password';

  return [InputType, Icon];
};

export default UsePasswordToggle;
