import { useParams } from "react-router-dom";

export default function MovieDetailPage() {
  const { movieId } = useParams();
  return <div>Movie ID: {movieId}</div>;
}
