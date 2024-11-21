function calculateTimeToAdd(st, end) {
    // Normalize the seconds to ensure valid input (0-59)
    st = st % 60;
    end = end % 60;

    // Calculate the difference
    let diff = (end - st + 60) % 60;

    // If the difference is already 5, no need to add time
    if (diff === 5) {
        return 0;
    }

    // Calculate how much to add to make the difference 5
    const timeToAdd = (5 - diff + 60) % 60;
    return timeToAdd*1000;
}
module.exports= calculateTimeToAdd;