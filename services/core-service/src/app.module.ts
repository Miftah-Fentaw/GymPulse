import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DisciplinesModule } from './modules/disciplines/disciplines.module';
import { BoxingModule } from './modules/boxing/boxing.module';
import { MmaModule } from './modules/mma/mma.module';
import { MuayThaiModule } from './modules/muay_thai/muay_thai.module';
import { AerobicsModule } from './modules/aerobics/aerobics.module';
import { ShopModule } from './modules/shop/shop.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    DisciplinesModule,
    BoxingModule,
    MmaModule,
    MuayThaiModule,
    AerobicsModule,
    ShopModule,
    BookingsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
