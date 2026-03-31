import { useParams } from "react-router-dom";

const MovieDetailPage = () => {
    const params = useParams();
    console.log(params);
    return <div>MoviedetailPage{params.movieId}</div>;
};

export default MovieDetailPage
