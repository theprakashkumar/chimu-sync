import { useParams } from "react-router-dom";

const useProjectId = () => {
  const params = useParams();
  return params.projectId as string;
};

export default useProjectId;
