'server only';

import { NextResponse } from 'next/server';

export enum HttpStatusCode {
  OK = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  ServerError = 500
}

export const Success = (message: unknown) => {
  return NextResponse.json({ body: message }, { status: HttpStatusCode.OK });
};

export const BadRequest = (message?: unknown) => {
  return NextResponse.json({ error: message }, { status: HttpStatusCode.BadRequest });
};

export const NotFound = (message?: unknown) => {
  return NextResponse.json({ error: message }, { status: HttpStatusCode.NotFound });
};

export const Unauthorized = (message: unknown) => {
  return NextResponse.json({ error: message }, { status: HttpStatusCode.Unauthorized });
};

export const Created = (message: unknown) => {
  return NextResponse.json({ body: message }, { status: HttpStatusCode.Created });
};

export const ServerError = (message: unknown) => {
  return NextResponse.json({ error: message }, { status: HttpStatusCode.ServerError });
};
