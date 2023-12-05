import { Injectable, CanActivate } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

@Injectable()
export class WsGuard implements CanActivate {
  constructor() {}

  canActivate(context: any): boolean {
    const bearerToken = context.args[0].handshake.headers.authorization;
    try {
      const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET, {
        algorithms: ["HS256"],
      });
      if (decoded) return true;
      return false;
    } catch (ex) {
      return false;
    }
  }
}
