export var getHello = function (req, res, next) {
    try {
        res.send('<h3>Hello World</h3>');
    }
    catch (error) {
        next(error);
    }
};
