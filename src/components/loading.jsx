import { useContext, useEffect } from "react";
import { AppContext } from "../utils/appcontext";

export default function Loading() {
  let { setLoading } = useContext(AppContext);

  useEffect(() => {
    let timerId = setInterval(() => {
      setLoading(false);
      clearInterval(timerId);
    }, Math.floor(Math.random() * 1000 + 500));

    return () => clearInterval(timerId);
  }, [setLoading]);
  return (
    <div className="flex-grow flex justify-center items-center">
      <span className="loading loading-ring loading-lg m-20"></span>
    </div>
  );
}
