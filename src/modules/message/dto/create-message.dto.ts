import { IsDate, IsEnum, IsNotEmpty, IsString, isString } from "class-validator";
import { MessageType } from "../message.entity";

export class CreateMessageDto {
    
    @IsString()
    subject: string;

    @IsNotEmpty()
    body: string;

    @IsNotEmpty()
    room: string;

    @IsEnum(MessageType)
    type: string;

    @IsDate()
    expirationDate: Date;

    parentMessage

}
