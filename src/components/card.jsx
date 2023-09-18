import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../utils/appcontext";

export default function Tutor({ tutor }) {
  let { subjectsMap, selectedIds } = useContext(AppContext);

  return (
    <Link to={`/profile/${tutor.user_id}`}>
      <div className="bg-slate-100 border rounded shadow-lg p-4 space-y-2">
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <div
              className="h-12 w-12 rounded-full bg-center bg-cover"
              style={{ backgroundImage: `url(${tutor.profile_picture})` }}
            />
            <div>
              <div className="font-bold">{tutor.name}</div>
              <div className="flex items-center space-x-1">
                <div className="text-lg text-warning font-bold">
                  {new Array(tutor.rating).fill("★")}
                  {new Array(5 - tutor.rating).fill("☆")}
                </div>
                <div className="badge badge-sm badge-warning">
                  {tutor.ratings}
                </div>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-700">
            Last Active: {new Date(tutor.last_active).toLocaleDateString()}
          </div>
        </div>
        <div className="flex flex-wrap">
          {tutor.subjects.map((subject) => (
            <div
              key={subjectsMap.get(subject).subject_id}
              className={`mr-2 mb-2 badge badge-sm sm:badge-md ${
                selectedIds.includes(subject)
                  ? "badge-primary"
                  : "badge-secondary"
              }`}
            >
              {subjectsMap.get(subject).subject}
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
