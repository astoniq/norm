import {Modal} from "../../../components/Modal";
import {CreateResourceForm} from "../CreateResourceForm";
import {Resource} from "@astoniq/norm-schema";

export type CreateResourceModalProps = {
    readonly onClose: (createdResource?: Resource) => void
}

export function CreateResourceModal({onClose}: CreateResourceModalProps) {


    return (
        <Modal onClose={onClose}>
            <CreateResourceForm onClose={onClose}/>
        </Modal>
    )
}