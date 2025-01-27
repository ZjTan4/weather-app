const normalizeDate = (date) => {
    return new Date(date).toISOString().split('T')[0]; // Returns YYYY-MM-DD
};

// normalize location string
const normalizeLocation = (loc) => {
    return loc.toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
};

// fuzzy match: check if locations are similar
const areLocationsSimilar = (loc1, loc2) => {
    // Convert both to lowercase and remove extra spaces
    const norm1 = normalizeLocation(loc1);
    const norm2 = normalizeLocation(loc2);

    // Exact match after normalization
    if (norm1 === norm2) return true;

    // Check if one contains the other
    if (norm1.includes(norm2) || norm2.includes(norm1)) return true;

    // Check if they share significant parts
    const parts1 = norm1.split(',').map(p => p.trim());
    const parts2 = norm2.split(',').map(p => p.trim());

    // Check if they share the same city or region
    const mainPart1 = parts1[0];
    const mainPart2 = parts2[0];

    return mainPart1 === mainPart2;
};

module.exports = {
    normalizeDate,
    areLocationsSimilar
};