import { NextFunction, Request, Response } from "express"
import { HttpException } from "../interfaces/httpException"

export function errorMiddleware(
  error: HttpException, 
  req: Request, 
  res: Response, 
  next: NextFunction
) {
  const status: number = error.status ?? 500
  const message: string = error.message ?? "Internal Server Error"

  res.status(status).json({
    status,
    message 
  })
}
