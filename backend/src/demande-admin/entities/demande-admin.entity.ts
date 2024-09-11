import { CategoryEntity } from "src/categories/entities/category.entity";
import { DemandeAdminStatus } from "src/enum/demande-admin-status.enum";
import { Roles } from "src/enum/user_enum";
import { Images } from "src/images/entities/image.entity";
import { OrderItems } from "src/order/entities/order-item.entity";
import { Product } from "src/product/entities/product.entity";
import { Size } from "src/size/entities/size.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('demandeadmins')

export class DemandeAdmin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nom: string;

    @Column()
    email:string;

    @Column()
    telephone: string;

    @Column()
    createdate: Date;

    @Column()
    message: string;

    @Column({
        type: 'enum',
        enum: DemandeAdminStatus,
        default: DemandeAdminStatus.PROCESSING
    })
    status:DemandeAdminStatus;

}
