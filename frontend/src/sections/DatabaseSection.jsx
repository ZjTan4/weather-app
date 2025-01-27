import RangeSearchBox from "../components/RangeSearchBox";
import RecordList from "../components/RecordList";

const DatabaseSection = () => {
    return (
        <section className="container mt-4 p-4">
            <h2>Database</h2>
            <RangeSearchBox />
            <RecordList />
        </section>
    );
};

export default DatabaseSection;

