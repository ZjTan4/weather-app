export const deleteRecord = async (id) => {
    try {
        const response = await fetch(`/api/records/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete record');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error deleting record:', error);
        throw error;
    }
};