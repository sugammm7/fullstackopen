function Notification({ message, isSuccess }) {
  if (message === null) {
    return null;
  }

  return (
    <div className={`notification-msg ${!isSuccess && "error"}`}>{message}</div>
  );
}

export default Notification;
