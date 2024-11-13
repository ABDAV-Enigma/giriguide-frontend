import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import {
  addSelectedHikingPoint,
  deleteHikingPoint,
  fetchHikingPoint,
  setIsUpdate,
} from "../../redux/feature/hikingPointSlice";
import { useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { GrEdit } from "react-icons/gr";

const HikingPointList = () => {
  const dispatch = useDispatch();
  const {
    hikingPoints = [],
    status,
    isError,
    error,
    mountainId,
  } = useSelector((state) => state.hikingPoint);

  const handleDeleteHikingPoint = (idHikingPoint) => {
    const acceptdDelete = window.confirm(
      "Are you sure you want to delete this hiking point?"
    );
    if (!acceptdDelete) {
      return;
    }
    dispatch(deleteHikingPoint(idHikingPoint));
  };

  useEffect(() => {
    dispatch(fetchHikingPoint(mountainId));
  }, []);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message || "Error"}</div>;
  }

  return (
    <section className="flex flex-wrap gap-3 mt-5 p-4">
      {hikingPoints.length === 0 && (
        <section className="flex justify-center items-center">
          <p className="text-center text-2xl text-zinc-500 font-bold">
            No Hiking Point
          </p>
        </section>
      )}
      {hikingPoints.map((hikingPoint) => (
        <Card
          key={hikingPoint?.id}
          variant="light"
          isPressable
          className="w-full"
          onPress={() => console.log("item pressed")}>
          <CardHeader>
            <p className="font-bold text-mainSoil text-xl">
              {hikingPoint?.name || "Unnamed Hiking Point"}
            </p>
          </CardHeader>

          <CardBody>
            <p className="text-mainGreen">
              Coordinate: {hikingPoint?.coordinate || "N/A"}
              <br />
              Price: {hikingPoint?.price || "N/A"}
            </p>
          </CardBody>

          <CardFooter className="flex items-center justify-end gap-4">
            <GrEdit
              className="text-3xl rounded-full text-mainSoil"
              onClick={() => {
                dispatch(addSelectedHikingPoint(hikingPoint));
                dispatch(setIsUpdate(true));
              }}
            />
            <MdDelete
              className="text-3xl rounded-full text-errorHover"
              onClick={() => {
                handleDeleteHikingPoint(hikingPoint?.id);
              }}
            />
          </CardFooter>
        </Card>
      ))}
    </section>
  );
};

export default HikingPointList;
