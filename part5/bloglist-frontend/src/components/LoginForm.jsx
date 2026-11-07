import Button from './Button';

function LoginForm({
  username,
  password,
  onChangeUsername,
  onChangePassword,
  onLogin,
}) {
  return (
    <form onSubmit={onLogin}>
      <div>
        <label htmlFor="username">username: </label>
        <input
          id="username"
          type="text"
          value={username}
          name="username"
          onChange={(e) => onChangeUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">password: </label>
        <input
          id="password"
          type="password"
          value={password}
          name="password"
          onChange={(e) => onChangePassword(e.target.value)}
        />
      </div>
      <Button text="login" />
    </form>
  );
}

export default LoginForm;
