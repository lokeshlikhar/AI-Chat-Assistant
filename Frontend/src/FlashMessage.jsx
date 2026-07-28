import { useEffect } from "react";

function FlashMessage({ message, onClose }) {
  useEffect(() => {
    if (!message) return undefined;

    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="flashMessage" role="alert" aria-live="assertive">
      <i className="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
      <span>{message}</span>
      <button type="button" onClick={onClose} aria-label="Close error message">
        <i className="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    </div>
  );
}

export default FlashMessage;
