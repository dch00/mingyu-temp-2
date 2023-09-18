import { useContext, useState } from "react";
import { AppContext } from "../utils/appcontext";
import Modal from "./modal";

export default function SubjectFilter({ show, setShow, subjects, onApply }) {
  let { subjectsMap } = useContext(AppContext);
  let [selected, setSelected] = useState([...subjects]);

  return (
    <Modal show={show} setShow={setShow}>
      <div className="space-y-5 flex flex-col items-center">
        <div className="text-xl font-bold">Select Tags</div>
        <div className="flex flex-wrap items-center">
          {Array.from(subjectsMap).map((subject) => (
            <div
              onClick={() =>
                selected.includes(subject[0])
                  ? setSelected(selected.filter((t) => subject[0] !== t))
                  : setSelected([...selected, subject[0]])
              }
              className={`cursor-pointer badge py-3 px-4 m-1 rounded ${
                selected.includes(subject[0])
                  ? "badge-primary"
                  : "badge-secondary"
              }`}
              key={subject[0]}
            >
              {subject[1].subject}
            </div>
          ))}
        </div>
        <div className="space-x-1">
          <button
            className="btn btn-sm btn-success"
            onClick={() => {
              onApply(selected);
              setShow(false);
            }}
          >
            Apply
          </button>
          <button
            className="btn btn-sm btn-warning"
            onClick={() => setSelected([])}
          >
            Reset
          </button>
        </div>
      </div>
    </Modal>
  );
}
