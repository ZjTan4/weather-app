export const updateRecord = async (id, updateData) => {
    try {
        const response = await fetch(`/api/records/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update record');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error updating record:', error);
        throw error;
    }
};