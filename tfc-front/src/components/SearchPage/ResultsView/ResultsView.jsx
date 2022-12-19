import './ResultsView.css';

import { Link } from 'react-router-dom';

export default function ResultsView(props) {
    return (
        <div className="results-view">
            {props.studios.map((studio, index) => {
                return (
                    <Link key={index} to={`/studio?studio_id=${studio.id}`}>
                        <div className="studio-item">
                            <h2>{studio.name}</h2>
                            <p>Address: {studio.address}, {studio.postal_code}</p>
                            <p>Phone: {studio.phone_number}</p>
                        </div>
                    </Link>
                )
            })}
        </div>
    );
}