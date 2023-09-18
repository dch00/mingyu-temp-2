export default function Modal({ children, show, setShow }) {
  return (
    <>
      <input
        type="checkbox"
        id="my_modal_7"
        className="modal-toggle"
        checked={show}
        readOnly={true}
      />
      <div className="modal">
        <div className="modal-box">
          {children}{" "}
          <button
            onClick={() => setShow(undefined)}
            className="absolute top-2 right-2 btn-xs btn-error"
          >
            close
          </button>
        </div>
      </div>
    </>
  );
}
