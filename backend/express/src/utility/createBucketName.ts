/**
 * Create bucket name from string input.
 * Appends '-statistics' to the name and checks for bucket override
 * @param name input name
 * @return final bucket name
 */
const createBucketName = (name: string): string => {
    return process.env.INFLUX_USE_OVERRIDE_BUCKET === 'true' ? process.env.INFLUX_OVERRIDE_BUCKET : `${name}`;
};

export {createBucketName};
