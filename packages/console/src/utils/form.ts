import {FieldValues, SubmitHandler} from "react-hook-form";
import React from "react";
import {HTTPError} from "ky";

export const trySubmitSafe =
    <T extends FieldValues>(handler: SubmitHandler<T>) =>
        async (formData: T, event?: React.BaseSyntheticEvent) => {
            try {
                await handler(formData, event)
            } catch (error) {
                if (error instanceof HTTPError && error.response.status !== 401) {
                    return;
                }
                throw error;
            }
        }