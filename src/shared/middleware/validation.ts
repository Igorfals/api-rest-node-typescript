import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { AnyObject, Maybe, ObjectSchema, ValidationError } from 'yup'

type TProperty = 'body' | 'header' | 'params' | 'query';
type TgetSchema = <T extends Maybe<AnyObject>>(schema: ObjectSchema<T>) => ObjectSchema<T>;
type TAllSchemas = Record<TProperty, ObjectSchema<any>>;
type TgetAllSchema = (getSchema: TgetSchema) => Partial<TAllSchemas>;
type TValidation = (getAllSchemas: TgetAllSchema) => RequestHandler;

export const validation: TValidation = (schemas) => async (req, res, next) => {
  console.log(schemas);

  const errorsResult: Record<string, Record<string, string>> = {};


  Object.entries(schemas).forEach(([key, schema]) => {
    try {
      schema.validateSync(req[key as TProperty], { abortEarly: false });
    } catch (error) {
      const yupError = error as ValidationError;
      const errors: Record<string, string> = {};

      yupError.inner.forEach(error => {
        if (error.path === undefined) return;
        errors[error.path] = error.message;
      });
      errorsResult[key] = errors;
    }
  });
  if (Object.entries(errorsResult).length === 0) {
    return next();
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({ errors: errorsResult });
    return;
  }
};