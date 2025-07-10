// src/users/subscribers/user.subscriber.ts
import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { User } from '../entities/user.entity';
import { PasswordUtil } from 'src/common/utils/password-util'; // PasswordUtil 임포트

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  // User 엔티티가 DB에 삽입되기 전에 호출
  async beforeInsert(event: InsertEvent<User>) {
    if (event.entity.password) {
      event.entity.password = await PasswordUtil.hash(event.entity.password);
    }
  }

  // User 엔티티가 DB에서 업데이트되기 전에 호출
  async beforeUpdate(event: UpdateEvent<User>) {
    // entity가 존재할 경우에만 진행
    if (event.entity && event.updatedColumns.some(col => col.propertyName === 'password')) {
      if (event.entity.password) {
        event.entity.password = await PasswordUtil.hash(event.entity.password);
      }
    }
  }
}