function Notification({ message, isSuccess }) {
  return <p className={`message ${!isSuccess ? 'failed' : ''}`}>{message}</p>;
}

export default Notification;
