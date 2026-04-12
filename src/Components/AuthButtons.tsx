interface AuthButtonsProps {
  onLogin: () => void;
}

const AuthButtons = ({ onLogin }: AuthButtonsProps) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={onLogin}
        className="px-4 py-2 bg-main-bg border border-ui-border rounded-md hover:border-brand transition-colors font-medium"
      >
        Login
      </button>
    </div>
  );
};

export default AuthButtons;
