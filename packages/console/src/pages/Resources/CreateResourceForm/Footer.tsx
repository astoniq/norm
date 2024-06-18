import Button from "../../../components/Button";


export type FooterProps = {
    readonly isCreating: boolean;
    readonly onClickCreate: () => void;
}

export function Footer(
    {
        isCreating,
        onClickCreate
    }: FooterProps
) {

    return (
        <Button
            htmlType={'submit'}
            title={'resources.create_resource_button'}
            size={'large'}
            type={'primary'}
            isLoading={isCreating}
            onClick={onClickCreate}
        />
    )
}