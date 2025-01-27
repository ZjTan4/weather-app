import { deleteRecord } from "../apis/deleteRecord";
import { updateRecord } from "../apis/updateRecord";
import RecordEntry from "./RecordEntry";

const RecordList = ({ recordList, setRecordList }) => {
    const handleEdit = async (updatedRecord) => {
        try {
            const updatedData = await updateRecord(updatedRecord._id, updatedRecord);
            // Update the local state with the new data
            setRecordList(prevList => 
                prevList.map(record => 
                    record._id === updatedRecord._id ? updatedData.data : record
                )
            );
        } catch (error) {
            console.error('Failed to update record:', error);
            alert('Failed to update record. Please try again.');
        }
    };
    const handleDelete = async (recordToDelete) => {
        try {
            await deleteRecord(recordToDelete._id);
            setRecordList(prevList => 
                prevList.filter(record => record._id !== recordToDelete._id)
            );

        } catch (error) {
            console.error('Failed to delete record:', error);
            alert('Failed to delete record. Please try again.');
        }
    };
    return (
        <div className="mt-4">
            <ul>
                {recordList.map((record) => (
                    <li key={record._id}>
                        <RecordEntry 
                            record={record}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecordList;