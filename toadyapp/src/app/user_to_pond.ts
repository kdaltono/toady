export interface UserToPond {
    pond_id: number,
    user_id: number,
    is_manager: boolean
}
/* 
    pond_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    is_manager BOOLEAN DEFAULT FALSE NOT NULL,
    PRIMARY KEY (pond_id, user_id)
*/