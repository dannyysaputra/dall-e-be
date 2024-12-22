import BaseModel from "./Model";

export type UserType = {
    id: string;
    username: string;
    email: string;
    password: string | null;
    created_at: Date;
    updated_at: Date;
}

export class UserModel extends BaseModel {
    static tableName: string = "users";

    id!: string;
    username!: string;
    email!: string;
    password!: string | null; // null for update profile
}