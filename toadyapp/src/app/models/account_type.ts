export interface AccountType {
    account_type_id: number,
    display_name: string,
    can_modify_pads: boolean,
    can_delete_pads: boolean,
    can_create_pads: boolean,
    can_modify_assigned_users: boolean,
    can_modify_tasks: boolean,
    can_create_tasks: boolean,
    pond_id: number
}