import { useImperativeHandle, useState } from 'react';

function Togglable({ label, ref, children }) {
  const [visible, setVisible] = useState(false);

  const showWhenVisible = { display: visible ? '' : 'none' };
  const hideWhenVisible = { display: visible ? 'none' : '' };

  function handleTogglability() {
    setVisible(!visible);
  }

  useImperativeHandle(ref, () => {
    return { handleTogglability };
  });

  return (
    <>
      <div style={hideWhenVisible}>
        <button onClick={handleTogglability}>{label}</button>
      </div>

      <div style={showWhenVisible}>
        {children}
        <button onClick={handleTogglability}>cancel</button>
      </div>
    </>
  );
}

export default Togglable;
