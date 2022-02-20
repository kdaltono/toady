import { FormGroup } from "@angular/forms";

export interface Pad {
    pad_id: number,
    pad_name: string,
    parent_pond_id: number,
    order_value: number,
    review_text: string,
    pad_is_complete: boolean,
    start_dstamp: Date,
    end_dstamp: Date,
    activeTime: FormGroup
}