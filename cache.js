const redis = require("redis");
const client = redis.createClient({
    host: "localhost",
    port: 6379
});

client.on("error", (err) => {
    console.log(err);
});

/////// GETTING INFO FROM REDIS ///////

module.exports.get = key => {
    return new Promise((resolve, reject) => {
        client.get(key, (err, data) => {
            if (err) {
                reject("Error in redis GET: ", err);
            } else {
                resolve(data);
            }
        });
    });
};

/////// SETEX IN REDIS ///////

module.exports.setex = (key, expiry, val) => {
    return new Promise((reject, resolve) => {
        client.setex([key, expiry, val], (err, data) => {
            console.log("error: ", err, "data: ", data);
            if (err) {
                reject("Error in redis SET: ", err);
            } else {
                resolve(data);
            }
        });
    });
};

/////// DEL FROM REDIS ///////

exports.del = key => {
    client.del(key)
};
