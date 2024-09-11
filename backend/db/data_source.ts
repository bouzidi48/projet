import {DataSource,DataSourceOptions} from 'typeorm'
import {config} from 'dotenv' 
import { User } from 'src/user/entities/user.entity';

config()
export const dataSourceOptions:DataSourceOptions={
    type:'mysql',
    host:process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE,
    entities:['dist/**/*.entity{.ts,.js}'],
    migrations:[],
    logging:false,
    synchronize:true

}

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;