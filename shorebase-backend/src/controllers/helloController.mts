import { Request, Response, NextFunction } from "express";

export const getHello = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send('<h3>Hello World</h3>');
    } catch (error) {
        next(error);
    }
}
