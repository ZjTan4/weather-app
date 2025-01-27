import RecordEntry from "./RecordEntry";

const RecordList = ({ recordList }) => {
    return (
        <div>
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