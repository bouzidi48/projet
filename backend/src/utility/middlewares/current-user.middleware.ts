/* import { Injectable, NestMiddleware } from '@nestjs/common';
import { isArray } from 'class-validator';
import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';

declare global{
    namespace Express{
        interface Request{
            currentUser?:UserEntity;
        }
    }

}
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private readonly userService:UsersService){}
  async  use(req: Request, res: Response, next: NextFunction) {
    const authHeader=req.headers.authorization || req.headers.Authorization;
    if(!authHeader || isArray(authHeader) || !authHeader.startsWith('Bearer' )){
        req.currentUser=null;
        next();
    }else{
        const token=authHeader.split(' ')[1];
        //console.log(token);
        const {id}=<JwtPayload>verify(token,process.env.ACCESS_TOKEN_SECRET_KEY);
        const currentUser=await this.userService.findOne(+id);
        req.currentUser=currentUser;
        console.log(currentUser);
         next();

    }
   
  }
}

interface JwtPayload{
    id:string;
} */


    import { Injectable, NestMiddleware } from '@nestjs/common';
    import { isArray } from 'class-validator';
    import { verify, JsonWebTokenError } from 'jsonwebtoken';
    import { Request, Response, NextFunction } from 'express';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
    
    
    declare global {
        namespace Express {
            interface Request {
                currentUser?: User;
            }
        }
    }
    
    @Injectable()
    export class CurrentUserMiddleware implements NestMiddleware {
        constructor(private readonly userService: UserService) {}
    
        async use(req: Request, res: Response, next: NextFunction) {
            const authHeader = req.headers.authorization || req.headers.Authorization;
    
            if (!authHeader || isArray(authHeader) || !authHeader.startsWith('Bearer ')) {
                req.currentUser = null;
                return next();
            }
    
            const token = authHeader.split(' ')[1];
    
            try {
                const { id } = <JwtPayload>verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
                const currentUser = await this.userService.findOne(+id);
                req.currentUser = currentUser.data;
                console.log(currentUser);
            } catch (err) {
                if (err instanceof JsonWebTokenError) {
                    console.error('JWT Error:', err.message);
                } else {
                    console.error('Error verifying token:', err);
                }
                req.currentUser = null;
            }
    
            next();
        }
    }
    
    interface JwtPayload {
        id: string;
    }
    