import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { OrderStatus } from "src/enum/order-status.enum";

export class updateOrderStatusDto{
    @IsNotEmpty()
    @IsString()
    @IsIn([OrderStatus.SHIPPED,OrderStatus.DELIVERED])
    status:OrderStatus;


}