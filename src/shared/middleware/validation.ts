import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { AnyObject, Maybe, ObjectSchema, ValidationError } from 'yup';

type TProperty = 'body' | 'headers' | 'params' | 'query';
type TgetSchema = <T extends Maybe<AnyObject>>(schema: ObjectSchema<T>) => ObjectSchema<T>;
type TAllSchemas = Record<TProperty, ObjectSchema<any>>;
type TgetAllSchema = (getSchema: TgetSchema) => Partial<TAllSchemas>;
type TValidation = (getAllSchemas: TgetAllSchema) => RequestHandler;

export const validation: TValidation = (getAllSchemas) => async (req: any, res: any, next) => {
  try {
    const schemas = getAllSchemas(schema => schema);
    const errorsResult: Record<string, Record<string, string>> = {};

    for (const [key, schema] of Object.entries(schemas)) {
      try {
        schema.validateSync(req[key as TProperty], { abortEarly: false });
      } catch (error) {
        const yupError = error as ValidationError;
        const errors: Record<string, string> = {};

        yupError.inner.forEach(err => {
          if (err.path) {
            errors[err.path] = err.message;
          }
        });

        errorsResult[key] = errors;
      }
    }

    if (Object.keys(errorsResult).length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errorsResult });
    }

    next();
  } catch (error) {
    console.error("Erro no middleware de validação:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Erro interno do servidor na validação." });
  }
};
