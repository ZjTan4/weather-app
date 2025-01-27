import RecordEntry from "./RecordEntry";

const RecordList = ({ recordList }) => {
    return (
        <div className="mt-4">
            <ul>
                {recordList.map((record) => (
                    <li key={record._id}>
                        <RecordEntry record={record} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecordList;