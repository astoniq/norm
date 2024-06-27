import {FormCard} from "../../../components/FormCard";
import {DetailsPageContent} from "../../../components/DetailsPageContent";
import SigningKeyField from "./SignKeyField";
import {useOutletContext} from "react-router-dom";
import {ResourceDetailsOutletContext} from "../types.ts";

export function ResourceSecurity() {

    const {resource, onResourceUpdated} = useOutletContext<ResourceDetailsOutletContext>()

    return (
        <DetailsPageContent
            title={'resource_details.security.security'}
            description={'resource_details.security.security_description'}
        >
            <FormCard title={'resource_details.security.form_title'}
                      description={'resource_details.security.form_description'}>
                <SigningKeyField
                    resourceId={resource.id}
                    signingKey={resource.signingKey}
                    onSigningKeyUpdated={(signingKey) => {
                        onResourceUpdated({...resource, signingKey})
                    }}/>
            </FormCard>
        </DetailsPageContent>

    )

}