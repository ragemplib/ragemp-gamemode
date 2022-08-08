import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import crypto from 'crypto'

@Entity('user')
class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
      unique: true,
      length: 64,
      nullable: false
    })
    login: string

    @Column({
      unique: true,
      length: 128,
      nullable: false
    })
    email: string

    @Column({
      length: 256,
      nullable: false
    })
    password: string

    @Column({
      nullable: true
    })
    promo: string

    @Column({
      nullable: true
    })
    referralLink: string

    @Column({
      length: 32,
      nullable: false
    })
    passwordSalt: string

    
    @Column({
      length: 16,
      nullable: false
    })
    passwordAlg: string

    @Column({
      nullable: false
    })
    acceptPolicy: boolean

    @Column({
      nullable: true
    })
    recoveryCode: string

    @Column({
      nullable: true
    })
    recoveryCodeTimeEnd: string

    setPassword(password: string): void {
      this.passwordSalt = crypto.randomBytes(16).toString('hex')
      this.passwordAlg = 'sha256'
      this.password = crypto.pbkdf2Sync(password, this.passwordSalt, 1000, 64, this.passwordAlg).toString('hex')
    }

    verifyPassword(password: string): boolean {
      return this.password == crypto.pbkdf2Sync(password, this.passwordSalt, 1000, 64, this.passwordAlg).toString('hex')
    }
}

export default User
