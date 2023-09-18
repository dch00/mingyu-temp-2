import { useContext, useEffect, useState } from "react";
import Card from "../components/card";
import SubjectFilter from "../components/subject-filter";
import Loading from "../components/loading";
import { AppContext } from "../utils/appcontext";

export default function Index() {
  return (
    <div className="w-full flex-grow flex flex-col items-center">
      <div className="w-full flex flex-col items-center">
        <Filter />
        <Tutors />
      </div>
    </div>
  );
}

function Filter() {
  let { selectedIds, setSelectedIds, rating, setRating } = useContext(
    AppContext
  );
  let [show, setShow] = useState(false);

  return (
    <div className="bg-base-200 w-full flex justify-center">
      <div className="max-w-6xl w-full flex justify-between">
        <div className="flex items-center">
          <button
            className="btn btn-xs sm:btn-sm btn-primary"
            onClick={() => setShow(true)}
          >
            Subjects
          </button>
          <button
            className={`btn btn-xs sm:btn-sm btn-primary ${
              !rating && "btn-outline"
            }`}
            onClick={() => {
              setRating(!rating);
            }}
          >
            Rating
          </button>
        </div>
        <div className="flex items-center">
          <button
            className="btn btn-xs sm:btn-sm btn-warning"
            onClick={() => {
              setSelectedIds([]);
            }}
          >
            Reset
          </button>
        </div>
        <SubjectFilter
          show={show}
          setShow={setShow}
          subjects={selectedIds}
          onApply={setSelectedIds}
        />
      </div>
    </div>
  );
}

function Tutors() {
  let { sortedUsers, loading, setLoading } = useContext(AppContext);
  useEffect(() => {
    setLoading(true);
  }, [sortedUsers, setLoading]);

  if (loading) return <Loading />;

  return (
    <div className="w-full max-w-6xl bg-base-200">
      {sortedUsers.map((tutor) => (
        <Card key={tutor.user_id} tutor={tutor} />
      ))}
    </div>
  );
}
