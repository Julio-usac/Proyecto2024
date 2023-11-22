// NO TOCAR ESTE ARCHIVO NO IMPORTA :V

import useAuth from "../auth/authStore";

const Token = () => {
  const token = useAuth((state) => state.token);
  return (
    <div>
      {token}
      {/* button for copy to clipboard token */}
      <button
        onClick={() => {
          navigator.clipboard.writeText(token);
        }}
      >
        copy
      </button>
    </div>
  );
};

export default Token;
